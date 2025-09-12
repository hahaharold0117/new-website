import Container from "./Container";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-10">
        {/* subtle brand blobs already handled by globals */}
      </div>

      <Container>
        <div className="grid gap-8 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <p className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-semibold tracking-wide shadow-sm">
              <span className="h-2 w-2 rounded-full bg-brand" />
              Fresh & Fast
            </p>
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
                className="rounded-full bg-brand px-6 py-3 text-white font-semibold shadow-soft hover:opacity-90"
              >
                Order Online
              </Link>
              <Link
                href="#menu"
                className="rounded-full border border-neutral-300 bg-white px-6 py-3 font-semibold hover:border-neutral-400"
              >
                See Menu
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
              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between text-white">
                <h3 className="text-3xl font-black leading-tight">
                  TASTY.
                  <br />
                  AS EVER.
                </h3>
                <Link href="#menu" className="inline-flex w-max rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-black hover:bg-white">
                  See Menu
                </Link>
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
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between text-black">
                <h3 className="text-3xl font-black leading-tight">
                  NEW TASTE,
                  <br />
                  UNLOCKED.
                </h3>
                <span className="inline-flex w-max rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
                  Citrus Revani Cake
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
