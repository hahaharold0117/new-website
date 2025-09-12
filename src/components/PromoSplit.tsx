import Container from "./Container";

export default function PromoSplit() {
  return (
    <section className="py-6">
      <Container>
        <h2
            className="text-center font-black uppercase tracking-tight leading-[1.05] text-[clamp(28px,4vw,40px)]"
          >
            <span className="block">HUNGRY?</span>
            <span className="block">CHECK IT OUT.</span>
          </h2>
      </Container>
    </section>
  );
}
