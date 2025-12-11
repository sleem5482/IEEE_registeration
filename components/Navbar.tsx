import React from "react";
import Image from "next/image";
import Link from "next/link";

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
        </div>
      </div>
    </nav>
  );
}

