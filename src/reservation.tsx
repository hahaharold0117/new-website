// src/components/ReservationForm.tsx
import { useMemo, useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import Container from './components/Container.tsx'
import { ChevronLeft } from "lucide-react";
import { useMain } from "@/contexts/main-context";
import { createReservation } from '@/helpers/backend_helper'
import moment from "moment-timezone";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  time: string; // HH:MM
  date: string; // YYYY-MM-DD
  guests: number;
  note: string;
};

type FormErrors = Partial<Record<keyof FormState, string>> & {
  global?: string;
};

const DEFAULT_TIME_MINUTES = 90;

function validate(form: FormState, now: Date): FormErrors {
  const errors: FormErrors = {};

  if (!form.firstName.trim()) errors.firstName = "First name is required.";
  if (!form.lastName.trim()) errors.lastName = "Last name is required.";
  if (!form.email.trim()) errors.email = "Email is required.";
  if (!form.mobile.trim()) errors.mobile = "Mobile number is required.";
  if (!form.date) errors.date = "Date is required.";
  if (!form.time) errors.time = "Time is required.";

  // email format
  if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address.";
  }

  // mobile basic validation
  const digits = form.mobile.replace(/\D/g, "");
  if (form.mobile && digits.length < 7) {
    errors.mobile = "Please enter a valid mobile number.";
  }

  // guests
  if (form.guests < 1 || form.guests > 8) {
    errors.guests = "Guest number must be between 1 and 8.";
  }

  // date/time not in the past
  if (form.date && form.time) {
    const chosen = new Date(`${form.date}T${form.time}:00`);
    if (isNaN(chosen.getTime())) {
      errors.time = "Please select a valid time.";
    } else if (chosen.getTime() < now.getTime()) {
      errors.time = "Reservation time cannot be in the past.";
    }
  }

  return errors;
}

export default function ReservationForm() {
  const today = useMemo(() => new Date(), []);
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const { restaurant } = useMain();
  const restaurantId = (restaurant as any)?.id as number | undefined;

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    time: "",
    date: todayStr,
    guests: 2,
    note: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const update = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm((s) => ({ ...s, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: undefined })); // clear field-level error
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    if (!restaurantId) {
      setErrors({
        global: "Restaurant information is missing. Please refresh and try again.",
      });
      return;
    }

    const now = new Date();
    const validationErrors = validate(form, now);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const localDT = `${form.date} ${form.time}`;
    const londonTime = moment.tz(localDT, "YYYY-MM-DD HH:mm", "Europe/London");
    const bookingString = londonTime.format("YYYY-MM-DD HH:mm:ss");

    const payload = {
      RestaurantId: restaurantId,
      FirstName: form.firstName.trim() || null,
      LastName: form.lastName.trim() || null,
      Email: form.email.trim(),
      Mobile: form.mobile.trim() || null,
      BookingTime: bookingString,
      GuestNumber: form.guests,
      DefaultTime: DEFAULT_TIME_MINUTES,
      Notes: form.note.trim() || null,
    };

    try {
      setSubmitting(true);
      setErrors({});

      const res = await createReservation(payload);
      console.log('res =>', res)

      if (res?.success === false) {
        const message = res?.message || "Failed to submit reservation.";
        setErrors({ global: message });
        return;
      }

      setSuccessMessage("Your reservation has been created successfully.");

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        time: "",
        date: todayStr,
        guests: 2,
        note: "",
      });
    } catch (err) {
      console.error("Reservation submit error:", err);
      setErrors({
        global: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const field =
    "w-full h-11 rounded-xl border border-neutral-200 bg-white px-3.5 text-sm " +
    "placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200/60";

  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <Container>
      {/* Heading + breadcrumb */}
      <header className="mb-6">
        <h1 className="mt-6 text-3xl font-bold tracking-tight">Reservation</h1>
        <nav className="mt-2 text-sm text-neutral-600">
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li className="text-neutral-400">›</li>
            <li className="text-neutral-900">Reservation</li>
          </ol>
        </nav>
      </header>

      {errors.global && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.global}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      <form onSubmit={submit} className="space-y-8">
        <section>
          <h2 className="mb-4 text-lg font-semibold">Contact Information</h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label
                htmlFor="firstName"
                className="mb-1.5 block text-sm font-medium"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                required
                placeholder="John"
                className={field}
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
              />
              {errors.firstName && (
                <p className={errorClass}>{errors.firstName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="mb-1.5 block text-sm font-medium"
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                required
                placeholder="Doe"
                className={field}
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
              />
              {errors.lastName && (
                <p className={errorClass}>{errors.lastName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                className={field}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>
          </div>

          <div className="mt-4 grid gap-6 md:grid-cols-3">
            <div>
              <label
                htmlFor="guests"
                className="mb-1.5 block text-sm font-medium"
              >
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
              </div>
              {errors.guests && <p className={errorClass}>{errors.guests}</p>}
            </div>

            <div>
              <label
                htmlFor="mobile"
                className="mb-1.5 block text-sm font-medium"
              >
                Mobile <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="mobile"
                  type="tel"
                  required
                  placeholder="e.g. +1 555 123 4567"
                  className={field}
                  value={form.mobile}
                  onChange={(e) => update("mobile", e.target.value)}
                />
              </div>
              {errors.mobile && <p className={errorClass}>{errors.mobile}</p>}
            </div>
          </div>

          {/* Time / Date */}
          <div className="mt-4 grid items-start gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="time"
                className="mb-1.5 block text-sm font-medium"
              >
                Select Time <span className="text-red-500">*</span>
              </label>
              <input
                id="time"
                type="time"
                step={1800}
                className={`${field} pr-9`}
                value={form.time}
                onChange={(e) => update("time", e.target.value)}
              />
              {errors.time && <p className={errorClass}>{errors.time}</p>}
            </div>

            <div>
              <label
                htmlFor="date"
                className="mb-1.5 block text-sm font-medium"
              >
                Select Date <span className="text-red-500">*</span>
              </label>
              <input
                id="date"
                type="date"
                min={todayStr}
                className={field}
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
              />
              {errors.date && <p className={errorClass}>{errors.date}</p>}
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Your Note</h2>
          <textarea
            rows={6}
            placeholder='e.g. “Birthday celebration, window table if possible.”'
            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200/60"
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
          />
        </section>

        {/* Actions */}
        <div className="mt-2 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm hover:bg-neutral-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Submitting..." : "Confirm Reservation"}
          </button>
        </div>
      </form>
    </Container>
  );
}
