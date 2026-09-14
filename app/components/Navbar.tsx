"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-black/95 backdrop-blur">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">

        <Link
          href="/"
          className="text-lg font-bold text-white"
        >
          🛡️ Bipat Rakshya
        </Link>

        <Link
          href="/emergency"
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg"
        >
          🚨 Emergency
        </Link>

      </div>
    </nav>
  );
}