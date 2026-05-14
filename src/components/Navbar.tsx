'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function Navbar() {
  const { itemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">☕</span>
            <span className="font-bold text-xl text-gray-900">
              Saudara Coffee
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm"
            >
              Beranda
            </Link>
            <Link
              href="/catalog"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm"
            >
              Katalog
            </Link>
            <Link
              href="/cart"
              className="relative text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              Keranjang
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>
            <Link
              href="/admin/login"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link
              href="/catalog"
              className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Katalog
            </Link>
            <Link
              href="/cart"
              className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors text-sm font-medium flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Keranjang
              {itemCount > 0 && (
                <span className="ml-2 bg-primary-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link
              href="/admin/login"
              className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors text-sm font-medium flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
