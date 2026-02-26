/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Gamepad2, Twitter, Youtube, Mail } from "lucide-react";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";

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
                href="https://x.com/Uefnmapcom"
                className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-forground hover:bg-purple-600 hover:text-foreground transition-all"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://www.youtube.com/@UEFNMAP"
                className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-forground hover:bg-purple-600 hover:text-foreground transition-all"
              >
                <Youtube size={18} />
              </a>
              <a
                href="https://discord.gg/Wv7GhuKTG3"
                className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-forground hover:bg-purple-600 hover:text-foreground transition-all"
              >
                <BsDiscord size={18} />
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Mail size={16} className="text-purple-500" />
              <span>webuefnmap@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-color flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright Text */}
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest text-center md:text-left">
            © {new Date().getFullYear()} FORTNITE UEFN | uefnmap.com
          </p>

          {/* Developer Info - WhatsApp & Fiverr */}
          <div className="flex flex-wrap justify-center items-center gap-4 border-x border-border-color/50 px-6">
            <span className="text-[9px] font-black uppercase text-muted-foreground tracking-tighter">
              Developed by:
            </span>

            {/* WhatsApp */}
            <a
              href="https://wa.me/+8801832822560"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-green-500 transition-colors group"
            >
              <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500 transition-all">
                <svg
                  size={12}
                  className="group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  width="12"
                  height="12"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              WhatsApp
            </a>

            {/* Fiverr */}
            <a
              href="https://www.fiverr.com/shah_jalal_web"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-green-400 transition-colors group"
            >
              <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#1dbf73] group-hover:border-transparent transition-all">
                <span className="text-[10px] font-black group-hover:text-white">
                  fi
                </span>
              </div>
              Fiverr
            </a>
          </div>

          {/* Payment Partners */}
          <div className="flex items-center gap-6">
            <img
              src="/paddle-secure.png"
              alt="Paddle Secured"
              className="h-5 opacity-40 grayscale hover:grayscale-0 transition-all cursor-pointer"
              title="Payments secured by Paddle"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
