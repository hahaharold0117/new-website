import Container from "@/components/Container";
import Hero from "@/components/Hero";
import PromoSplit from "@/components/PromoSplit";
import FeatureBullets from "@/components/FeatureBullets";
import Highlights from "@/components/Highlights";
import CallToAction from "@/components/CallToAction";
import ContactHours from "@/components/ContactHours";

export default function Page() {
  return (
    <>
      <Hero />
      <PromoSplit />
      <section className="py-6">
        <Container>
          <FeatureBullets />
        </Container>
      </section>
      <section className="py-6 mt-4">
        <Container>
          <h2
            className="text-center font-black uppercase tracking-tight leading-[1.05] text-[clamp(28px,4vw,40px)]"
          >
            <span className="block">HIGHLIGHTS</span>
            <span className="block">OF US</span>
          </h2>
          <div className="mt-8">
            <Highlights />
          </div>
        </Container>
      </section>
      <CallToAction />
      <section className="py-12">
        <Container>
          <ContactHours />
        </Container>
      </section>
    </>
  );
}
