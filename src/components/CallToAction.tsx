import Container from "./Container";
import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="relative py-16 bg-[#FFF8F5]">
      <Container>
        <div className="relative text-center">
          {/* background shapes */}

          <h2 className="font-black uppercase tracking-tight leading-[1.05] text-[clamp(28px,4vw,40px)]">
            <span className="block">READY</span>
            <span className="block">TO</span>
            <span className="block">ORDER?</span>
          </h2>

          <p className="mt-2 text-neutral-600">
            Browse our menu and place an order for quick pick-up delivery
          </p>

          <Link
            href="/menu"
            className="mt-6 inline-flex rounded-md bg-white px-6 py-2 font-semibold text-black shadow hover:bg-neutral-50"
          >
            View Menu
          </Link>
        </div>
      </Container>
    </section>

  );
}
