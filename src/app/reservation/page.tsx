// src/components/ReservationForm.tsx
"use client";

import { useMemo, useState, FormEvent } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import { ChevronLeft } from "lucide-react";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  time: string; // HH:MM
  date: string; // YYYY-MM-DD
  guests: number;
  note: string;
};

export default function ReservationForm() {
  const today = useMemo(() => new Date(), []);
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    time: "",
    date: todayStr,
    guests: 2,
    note: "",
  });

  const update = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((s) => ({ ...s, [key]: val }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: hook up API call
    console.log("Reservation submit =>", form);
  };

  // Shared input styles: neutral border, correct height, subtle focus
  const field =
    "w-full h-11 rounded-xl border border-neutral-200 bg-white px-3.5 text-sm " +
    "placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200/60";

  return (
    <Container>
      {/* Heading + breadcrumb */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Reservation</h1>
        <nav className="mt-2 text-sm text-neutral-600">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li className="text-neutral-400">›</li>
            <li className="text-neutral-900">Reservation</li>
          </ol>
        </nav>
      </header>

      <form onSubmit={submit} className="space-y-8">
        {/* Contact Information */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Contact Information</h2>

          {/* First row */}
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                required
                placeholder="Placeholder"
                className={field}
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                required
                placeholder="Placeholder"
                className={field}
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="Placeholder"
                className={field}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
          </div>

          {/* Second row: time/date + note card aligned */}
          <div className="mt-4 grid gap-6 md:grid-cols-3 items-start">
            <div>
              <label htmlFor="time" className="mb-1.5 block text-sm font-medium">
                Select Time
              </label>
              <input
                id="time"
                type="time"
                step={1800}
                min="11:00"
                max="22:00"
                className={`${field} pr-9`}
                value={form.time}
                onChange={(e) => update("time", e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="date" className="mb-1.5 block text-sm font-medium">
                Select Date
              </label>
              <input
                id="date"
                type="date"
                min={todayStr}
                className={field}
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
              />
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm">
              <p className="font-semibold">Note:</p>
              <p className="mt-1 text-neutral-600">
                You can call us for reservations that include more than 8 people.
              </p>
            </div>
          </div>

          {/* Guest Number (dropdown) */}
          <div className="mt-4 max-w-xs">
            <label htmlFor="guests" className="mb-1.5 block text-sm font-medium">
              Guest Number
            </label>
            <div className="relative">
              <select
                id="guests"
                className={`${field} pr-9`}
                value={form.guests}
                onChange={(e) => update("guests", Number(e.target.value))}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              {/* Chevron */}
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                ▾
              </span>
            </div>
          </div>
        </section>

        {/* Your note */}
        <section>
          <h2 className="mb-3 text-lg font-semibold">Your note</h2>
          <textarea
            rows={6}
            placeholder='e.g. “Birthday Celebration”'
            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200/60"
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
          />
        </section>

        {/* Actions (left Back, right Confirm) */}
        <div className="mt-2 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm hover:bg-neutral-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Confirm Reservation
          </button>
        </div>
      </form>
    </Container>
  );
}
