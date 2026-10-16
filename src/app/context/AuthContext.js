"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";
import { adminApiUrl } from "../lib/runtime-config";
import { validateAccountProfile } from "../lib/admin-api.mjs";

const AuthContext = createContext({
  user: null,
  mongoUser: null,
  loading: true,
  profileLoading: false,
  profileError: null,
  refreshProfile: async () => null,
});

const PROFILE_REQUEST_TIMEOUT_MS = 12_000;

export const AuthProvider = ({ children }) => {
  const pathname = usePathname();
  const waitForAuth = !pathname || /^\/(admin|auth|cart|my-assets)(\/|$)/.test(pathname);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mongoUser, setMongoUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const profileRequestId = useRef(0);
  const profileAbortController = useRef(null);

  const cancelProfileRequest = useCallback(() => {
    ++profileRequestId.current;
    profileAbortController.current?.abort();
    profileAbortController.current = null;
  }, []);

  const loadProfile = useCallback(async (firebaseUser, forceTokenRefresh) => {
    const requestId = ++profileRequestId.current;
    profileAbortController.current?.abort();

    const controller = new AbortController();
    let didTimeOut = false;
    let timeoutId;
    const cancellationPromise = new Promise((_, reject) => {
      controller.signal.addEventListener(
        "abort",
        () => reject(new Error("Profile request was cancelled.")),
        { once: true },
      );
    });
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        didTimeOut = true;
        controller.abort();
        reject(new Error("Profile verification timed out. Please try again."));
      }, PROFILE_REQUEST_TIMEOUT_MS);
    });

    profileAbortController.current = controller;
    setProfileLoading(true);
    setProfileError(null);

    try {
      const profileData = await Promise.race([
        (async () => {
          const token = await firebaseUser.getIdToken(forceTokenRefresh);
          const response = await fetch(
            adminApiUrl(`users/${encodeURIComponent(firebaseUser.uid)}`),
            {
              headers: { Authorization: `Bearer ${token}` },
              cache: "no-store",
              signal: controller.signal,
            },
          );
          const result = await response.json().catch(() => null);

          if (!response.ok || result?.success !== true) {
            throw new Error(
              result?.message ||
                `Unable to load your profile (${response.status}).`,
            );
          }

          if (!result.data || typeof result.data !== "object") {
            throw new Error("The profile service returned invalid data.");
          }

          return validateAccountProfile(result.data, firebaseUser.uid);
        })(),
        cancellationPromise,
        timeoutPromise,
      ]);

      if (requestId === profileRequestId.current) {
        setMongoUser(profileData);
      }

      return profileData;
    } catch (error) {
      if (requestId !== profileRequestId.current) return null;

      const profileRequestError = didTimeOut
        ? new Error("Profile verification timed out. Please try again.")
        : error;

      setMongoUser(null);
      setProfileError(profileRequestError);
      throw profileRequestError;
    } finally {
      clearTimeout(timeoutId);
      if (profileAbortController.current === controller) {
        profileAbortController.current = null;
      }
      if (requestId === profileRequestId.current) {
        setProfileLoading(false);
      }
    }
  }, []);

  const refreshProfile = useCallback(
    async ({ forceTokenRefresh = false } = {}) => {
      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        cancelProfileRequest();
        setMongoUser(null);
        setProfileError(null);
        setProfileLoading(false);
        return null;
      }

      return loadProfile(firebaseUser, forceTokenRefresh);
    },
    [cancelProfileRequest, loadProfile],
  );

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!active) return;

      cancelProfileRequest();
      setUser(firebaseUser);
      setLoading(false);
      setMongoUser(null);

      if (!firebaseUser) {
        setProfileLoading(false);
        setProfileError(null);
        return;
      }

      loadProfile(firebaseUser, false).catch((error) => {
        // The visible profile error provides a retry without logging account data.
        void error;
      });
    });

    return () => {
      active = false;
      cancelProfileRequest();
      unsubscribe();
    };
  }, [cancelProfileRequest, loadProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        mongoUser,
        profileLoading,
        profileError,
        refreshProfile,
      }}
    >
      {(!loading || !waitForAuth) && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
