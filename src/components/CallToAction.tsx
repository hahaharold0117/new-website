import Container from "./Container";
import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="relative py-16">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-white p-10 text-center shadow-soft">
          <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-brand/10" />
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-brand/10" />
          <h2
            className="text-center font-black uppercase tracking-tight leading-[1.05] text-[clamp(28px,4vw,40px)]"
          >
            <span className="block">READY</span>
            <span className="block">TO</span>
            <span className="block">ORDER?</span>
          </h2>

          <p className="mt-2 text-neutral-600">
            Browse our menu and place order for quick pick-up delivery
          </p>
          <Link
            href="#menu"
            className="mt-6 inline-flex rounded-full border bg-white px-6 py-3 font-semibold hover:border-neutral-400"
          >
            View Menu
          </Link>
        </div>
      </Container>
    </section>
  );
}
