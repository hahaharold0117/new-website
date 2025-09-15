import Container from "./Container";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FFDECE]">
      <div className="absolute inset-0 -z-10 opacity-10">
      </div>
      <Container>
        <div className="grid gap-8 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="mt-4 text-4xl md:text-6xl font-black leading-[1.05]">
              FRESH TURKISH
              <br />
              DELIVERED FAST.
            </h1>
            <p className="mt-3 text-neutral-600">
              Authentic flavors from our kitchen to your door. Order now for pickup or delivery.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Link
                href="/order-online"
                className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-white font-semibold shadow-soft hover:opacity-90"
              >
                Order Online
              </Link>
            </div>
          </div>

          {/* Hero feature tiles (like your “Tasty / New Taste” row) */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative overflow-hidden rounded-2xl shadow-soft">
              <Image
                src="/images/promo-left.png"
                alt="Tasty as ever"
                width={1280}
                height={720}
                className="h-56 w-full object-cover md:h-64"
                priority
              />

              {/* Dark overlay for contrast */}
              <div className="absolute inset-0 bg-black/55" />

              {/* Content layer */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col text-white">
                <h3 className="text-3xl font-black leading-tight drop-shadow">
                  TASTY.
                  <br />
                  AS EVER.
                </h3>

                {/* CTA aligned to the right, near the bottom */}
                <div className="mt-auto flex justify-end">
                  <Link
                    href="#menu"
                    className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm hover:bg-black/50"
                  >
                    See Menu
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>


            <div className="relative overflow-hidden rounded-2xl shadow-soft bg-white">
              <Image
                src="/images/promo-right.jpg"
                alt="New taste unlocked"
                width={1280}
                height={720}
                className="h-56 w-full object-cover md:h-64 mix-blend-multiply"
              />
              <div className="absolute inset-0 bg-brand/20" />

              {/* Content */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col text-white">
                <h3 className="text-3xl font-black leading-tight">
                  NEW TASTE,
                  <br />
                  UNLOCKED.
                </h3>
                <span className="w-max py-2 text-sm font-semibold text-white">
                  Citrus Revani Cake
                </span>

                {/* Arrow button bottom-right */}
                <Link
                  href="#"
                  className="absolute bottom-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-white text-brand shadow-md hover:bg-neutral-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
}
