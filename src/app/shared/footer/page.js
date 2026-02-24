/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Gamepad2, Twitter, Github, Youtube, Mail } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border-color pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand & Bio */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                <Gamepad2 className="text-foreground" size={20} />
              </div>
              <span className="text-xl font-bold tracking-tighter text-foreground">
                Everything You Need to Build in
                <span className="text-purple-500">UEFN</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Pre-built maps, premium Maps & assets, Verse programming, and
              custom fixes—ready to download and easy to publish.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-foreground font-bold mb-6">Pages</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li>
                <Link
                  href="/my-assets"
                  className="hover:text-purple-500 transition-colors"
                >
                  Browse All Assets
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace"
                  className="hover:text-purple-500 transition-colors"
                >
                  Shope
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="hover:text-purple-500 transition-colors"
                >
                  Aboute US
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/contact"
                  className="hover:text-purple-500 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-foreground font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li>
                <Link href="/legal/faqs">FAQs</Link>
              </li>
              <li>
                <Link href="/legal/terms-of-service">Terms of Service</Link>
              </li>
              <li>
                <Link href="/legal/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/legal/refund-policy">Refund Policy</Link>
              </li>
              <li>
                <Link href="/legal/contact-support">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div>
            <h4 className="text-foreground font-bold mb-6">Stay Connected</h4>
            <div className="flex gap-4 mb-6">
              <a
                href="#"
                className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-foreground transition-all"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-foreground transition-all"
              >
                <Youtube size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-foreground transition-all"
              >
                <Github size={18} />
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Mail size={16} className="text-purple-500" />
              <span>support@uefnmaps.com</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-color flex flex-col md:row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs text-center md:text-left">
            © {new Date().getFullYear()} 2026 FORTNITE UEFN With © 2026
            uefnmap.com. All rights reserved
          </p>
          <div className="flex items-center gap-6">
            <img
              src="/paddle-secure.png"
              alt="Paddle Secured"
              className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer"
              title="Payments secured by Paddle"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
