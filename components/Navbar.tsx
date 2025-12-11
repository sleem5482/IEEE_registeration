"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="w-full bg-white/10 border-b border-white/20 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <div className="relative w-12 h-12">
              <Image
                src="/icon.png"
                alt="TIME Event Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-white">TIME Event</h1>
              <p className="text-sm text-white/70">Technology, Innovation, Management, Entrepreneurship</p>
            </div>
          </Link>
          
          <div className="flex items-center gap-4 md:gap-6">
            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/register"
                className="text-white/80 hover:text-white transition-colors font-medium"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="text-white/80 hover:text-white transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                href="/admin/users"
                className="text-white/80 hover:text-white transition-colors font-medium"
              >
                Admin
              </Link>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-3 md:gap-4 md:ml-4 md:pl-4 md:border-l md:border-white/20">
              <a
                href="https://www.facebook.com/IEEEEgypt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/ieeeegypt/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/IEEEEgypt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/school/ieee-egypt/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

