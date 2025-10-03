import { Phone, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";

// Google Maps embed with lat/lng or address
function MapEmbed({
  lat,
  lng,
  address,
  zoom = 15,
  className = "",
}: {
  lat?: number;
  lng?: number;
  address?: string;
  zoom?: number;
  className?: string;
}) {
  const hasCoords = typeof lat === "number" && typeof lng === "number";
  const q = hasCoords ? `${lat},${lng}` : encodeURIComponent(address ?? "Wolverhampton WV1 4LP");
  const src = `https://maps.google.com/maps?q=${q}&z=${zoom}&output=embed`;

  return (
    <iframe
      title="Map"
      src={src}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

export default function ContactHours() {
  // Replace with your actual coordinates or address
  const lat = 52.5847;
  const lng = -2.1290;
  const address = "Herlan House, Field Street, Wolverhampton WV1 4LP";

  return (
    <section className="bg-[#FFF8F5]">
      <div className="grid md:grid-cols-3">
        {/* Contacts card */}
        <div className="bg-[#FFF3EB] overflow-hidden">
          <div className="p-6">
            <h4 className="font-bold mb-4">Contacts</h4>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-[#FF7A1A]/10 text-[#FF7A1A]">
                  <Phone className="h-4 w-4" />
                </span>
                <p className="font-semibold">+44048384343</p>
              </div>

              <div className="flex items-start gap-3">
                <span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-[#FF7A1A]/10 text-[#FF7A1A]">
                  <MapPin className="h-4 w-4" />
                </span>
                <p>{address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hours card */}
        <div className="bg-[#FFF3EB] overflow-hidden">
          <div className="p-6">
            <h4 className="font-bold mb-4">Working Hours</h4>

            <div className="flex items-start gap-3">
              <span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-[#FF7A1A]/10 text-[#FF7A1A]">
                <Clock className="h-4 w-4" />
              </span>
              <p className="text-sm">Open Every Day: 11:00 – 23:45</p>
            </div>

            <div className="mt-6 flex justify-center">
              <Link
                to="/reservation"
                className="inline-flex items-center justify-center border border-neutral-200 bg-white px-10 py-2 text-sm font-semibold hover:bg-neutral-50"
              >
                Book A Table
              </Link>
            </div>
          </div>
        </div>

        {/* Map card */}
        <div className="bg-[#FFF3EB] overflow-hidden">
          <MapEmbed
            lat={lat}
            lng={lng}
            address={address}
            className="h-[220px] w-full md:h-full"
          />
        </div>
      </div>
    </section>
  );
}
