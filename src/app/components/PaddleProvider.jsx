"use client";
import { useEffect } from "react";
import { initializePaddle } from "@paddle/paddle-js";

export default function PaddleProvider() {
  useEffect(() => {
    initializePaddle({
      environment: "sandbox",
      token: "test_1a4ec1f9df524f5570405eeb210"
    });
  }, []);

  return null;
}