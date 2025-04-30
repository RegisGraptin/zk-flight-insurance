"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gradient-to-br from-indigo-900 to-purple-800 shadow-xl">
      <nav className="border-white/20 backdrop-blur-sm">
        <div className="container mx-auto flex max-w-4xl flex-wrap items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-2xl font-bold text-white transition-opacity hover:opacity-80"
          >
            <span className="text-3xl">✈️</span>
            <span className="hidden sm:inline-block">FlightSurety</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center space-x-6">
            {/* Add any additional nav items here */}
            {/* <ConnectButton
              accountStatus="full"
              chainStatus="full"
              showBalance={false}
            /> */}
          </div>

          {/* Mobile Menu Button (hidden on desktop) */}
          <button
            className="relative ml-auto h-10 w-10 rounded-lg bg-white/10 p-2 text-white transition-all hover:bg-white/20 lg:hidden"
            type="button"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}