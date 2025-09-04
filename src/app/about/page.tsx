import Container from "@/components/Container";
import PhotoGallery from "@/components/PhotoGallery";

export default function AboutPage() {
  const images = [
    { src: "/images/gallery/01.jpg", alt: "Shop front" },
    { src: "/images/gallery/02.jpg", alt: "Interior seating" },
    { src: "/images/gallery/03.jpg", alt: "Menu board" },
  ];

  return (
    <>
      <section className="py-12">
        <Container>
          {/* Title with lines */}
          <div className="flex items-center gap-4">
            <span className="hidden h-px flex-1 bg-gray-200 md:block" />
            <h2 className="text-center text-3xl font-bold text-red-600">
              Under New Management Since May 2019!
            </h2>
            <span className="hidden h-px flex-1 bg-gray-200 md:block" />
          </div>

          <p className="mt-6 italic text-gray-500">
            5 Stars Really Means 5 Stars @ Pagham Kebab &amp; Pizza House
          </p>

          <div className="prose prose-gray mt-4 max-w-none">
            <p>
              At Pagham Kebab and Pizza House, we serve fresh and tasty food, made to order,
              when you order. Along with our 5 Star Hygiene and our excellent customer service,
              you always know you’re in safe hands when ordering from us.
            </p>
            <p>
              We always want to make it easier and faster for our customers to order, and to
              eliminate any mistakes, we have launched our new online ordering portal, so you can
              order for Delivery, Pick Up or In-Store. Our easy to use website allows you to order
              fast, and the order comes directly into our store for us to prepare fresh. We also
              give 10% OFF all online orders.
            </p>
            <p>
              We always want to meet the expectations of your taste buds, so sometimes food
              preparation times can take longer during busy periods, but we will always try our best
              to get your food ready on time.
            </p>
            <p>
              We can also cater for larger orders, or parties, so if you do need more information,
              do call or email us, and we will aim to be in touch. Remember to Like Us on Facebook,
              and Follow Us on Instagram to stay up to date with offers and deals.
            </p>
            <p className="font-semibold">
              Many Thanks From The Pagham Kebab &amp; Pizza Team
            </p>
          </div>

          {/* Photo Gallery */}
          <div className="mt-10">
            <div className="mb-4 flex items-center gap-4">
              <span className="hidden h-px flex-1 bg-gray-200 md:block" />
              <h3 className="text-2xl font-bold text-red-600">Photo Gallery</h3>
              <span className="hidden h-px flex-1 bg-gray-200 md:block" />
            </div>

            <PhotoGallery images={images} />
          </div>
        </Container>
      </section>
    </>
  );
}
