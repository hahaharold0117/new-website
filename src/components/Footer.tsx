"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaFacebookF, FaTwitter, FaPinterest, FaLinkedinIn, FaGooglePlusG, FaRss, FaArrowUp } from "react-icons/fa";

export default function Footer() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-neutral-900 text-gray-300">
      {/* Top Section */}
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
        {/* Opening Hours */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Opening Hours</h3>
          <ul className="space-y-1 text-sm">
            <li className="flex justify-between">
              <span>Monday</span> <span>7:35 am – 11:45 pm</span>
            </li>
            <li className="flex justify-between">
              <span>Tuesday</span> <span>11:00 am – 2:00 pm / 4:00 pm – 11:00 pm</span>
            </li>
            <li className="flex justify-between">
              <span>Wednesday</span> <span>8:00 am – 10:00 pm</span>
            </li>
            <li className="flex justify-between font-bold">
              <span>Thursday</span> <span>12:02 am – 11:59 pm</span>
            </li>
            <li className="flex justify-between">
              <span>Friday</span> <span>12:00 am – 10:50 pm</span>
            </li>
            <li className="flex justify-between">
              <span>Saturday</span> <span>12:01 am – 8:00 am</span>
            </li>
            <li className="flex justify-between">
              <span>Sunday</span> <span>10:00 am – 6:00 pm</span>
            </li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li>📞 01243265252</li>
            <li>✉️ info@paghampizza.co.uk</li>
            <li>📍 2 The Parade, Bognor Regis PO21 4TW, UK</li>
          </ul>
          <div className="mt-4 flex gap-3 text-lg">
            <FaFacebookF />
            <FaTwitter />
            <FaPinterest />
            <FaLinkedinIn />
            <FaGooglePlusG />
            <FaRss />
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/">Home Page</Link>
            </li>
            <li>
              <Link href="/order-online">Order Online</Link>
            </li>
            <li>
              <Link href="#">Track Your Order</Link>
            </li>
            <li>
              <Link href="/about">About Us</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800 bg-neutral-950 py-4 text-center text-xs text-gray-400">
        <p>
          Powered By <span className="font-semibold text-white">ePosAnytime</span>
        </p>
        <img
          src="/logo.png"
          alt="logo"
          className="mx-auto mt-2 h-6"
        />
      </div>

      {/* Scroll to Top */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded bg-red-600 text-white shadow-lg hover:bg-red-700"
        >
          <FaArrowUp />
        </button>
      )}
    </footer>
  );
}
