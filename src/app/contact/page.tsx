"use client";

import Container from "@/components/Container";
import Link from "next/link";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaLinkedinIn,
  FaGooglePlusG,
  FaRss,
} from "react-icons/fa";
import { FormEvent } from "react";

const HOURS: { day: string; value: string }[] = [
  { day: "Monday",    value: "7:35 am – 11:45 pm" },
  { day: "Tuesday",   value: "11:00 am – 2:00 pm • 4:00 pm – 11:00 pm" },
  { day: "Wednesday", value: "8:00 am – 10:00 pm" },
  { day: "Thursday",  value: "12:02 am – 11:59 pm" },
  { day: "Friday",    value: "12:00 am – 10:50 pm" },
  { day: "Saturday",  value: "12:01 am – 8:00 am" },
  { day: "Sunday",    value: "10:00 am – 6:00 pm" },
];

// JS: 0=Sun..6=Sat  -> make Monday index 0
const jsDay = new Date().getDay();
const TODAY_INDEX = jsDay === 0 ? 6 : jsDay - 1;

export default function ContactPage() {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Thanks! Hook this form to your API/email when ready.");
  };

  return (
    <>
      <section className="py-12">
        <Container>
          {/* Top grid */}
          <div className="grid gap-12 md:grid-cols-3">
            {/* Opening Hours */}
            <div>
              <SectionTitle>Opening Hours</SectionTitle>
              <ul className="mt-6 space-y-2 text-sm">
                {HOURS.map((row, idx) => (
                  <li key={row.day} className="flex items-baseline justify-between gap-6 border-b border-gray-100 pb-2">
                    <span className={idx === TODAY_INDEX ? "font-semibold text-gray-900" : "text-gray-700"}>
                      {row.day}
                    </span>
                    <span className="text-gray-500">{row.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Leave a Message */}
            <div className="md:col-span-2">
              <SectionTitle>Leave us a Message</SectionTitle>
              <form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  required
                  name="name"
                  placeholder="Your name"
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 outline-none focus:border-red-500"
                />
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Your email"
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 outline-none focus:border-red-500"
                />
                <input
                  name="subject"
                  placeholder="Subject (optional)"
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 outline-none focus:border-red-500 md:col-span-2"
                />
                <textarea
                  required
                  name="message"
                  rows={6}
                  placeholder="Your message"
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 outline-none focus:border-red-500 md:col-span-2"
                />
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="rounded-md bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>

            {/* Address */}
            <div className="md:col-span-1">
              <SectionTitle>Address</SectionTitle>
              <div className="mt-6 space-y-3 text-sm">
                <p className="flex items-center gap-3">
                  <FaPhoneAlt className="text-red-600" /> 01243265252
                </p>
                <p className="flex items-center gap-3">
                  <FaEnvelope className="text-red-600" />
                  <a href="mailto:info@paghampizza.co.uk" className="hover:underline">
                    info@paghampizza.co.uk
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-red-600" /> 2 The Parade, Bognor Regis PO21 4TW, UK
                </p>
              </div>

              <div className="mt-4 flex items-center gap-3 text-red-600">
                <Link href="#" aria-label="Facebook"><FaFacebookF /></Link>
                <Link href="#" aria-label="Twitter"><FaTwitter /></Link>
                <Link href="#" aria-label="Pinterest"><FaPinterestP /></Link>
                <Link href="#" aria-label="LinkedIn"><FaLinkedinIn /></Link>
                <Link href="#" aria-label="Google+"><FaGooglePlusG /></Link>
                <Link href="#" aria-label="RSS"><FaRss /></Link>
              </div>
            </div>
          </div>

          <div className="mt-12 overflow-hidden rounded-md border">
            <iframe
              title="LB Express Map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                "2 The Parade, Bognor Regis PO21 4TW, UK"
              )}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[380px] w-full border-0"
            />
          </div>
        </Container>
      </section>
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="text-2xl font-bold text-red-600">{children}</h2>
      <span className="h-px flex-1 bg-gray-200" />
    </div>
  );
}
