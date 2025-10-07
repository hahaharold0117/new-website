import { Phone, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useMain } from "@/contexts/main-context";
import { Restaurant } from "../types";

function MapEmbed({
  address,
  zoom = 16,
  className = "",
}: {
  address: string;
  zoom?: number;
  className?: string;
}) {
  const q = encodeURIComponent(address);
  const src = `https://maps.google.com/maps?q=${q}&z=${zoom}&output=embed&hl=en`;

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
  const { restaurant } = useMain() as { restaurant: Restaurant };

  // Build address from restaurant fields
  const street = restaurant?.Street?.trim();
  const city = restaurant?.City?.trim();
  const postcode = restaurant?.PostCode?.trim();
  const address = [street, city, postcode].filter(Boolean).join(", ");

  return (
    <section className="bg-[#FFF8F5]">
      <div className="grid md:grid-cols-3">
        {/* Contacts card */}
        <div className="bg-[#FFF3EB] overflow-hidden">
          <div className="p-6">
            <h4 className="font-bold mb-4">Contacts</h4>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-[var(--brand)]/10 text-[var(--brand)]">
                  <Phone className="h-4 w-4" />
                </span>
                <p className="font-semibold">{restaurant?.Tel1 ?? ""}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-[var(--brand)]/10 text-[var(--brand)]">
                  <MapPin className="h-4 w-4" />
                </span>
                <p>{address || "Address unavailable"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hours card */}
        <div className="bg-[#FFF3EB] overflow-hidden">
          <div className="p-6">
            <h4 className="font-bold mb-4">Working Hours</h4>

            <div className="flex items-center gap-3">
              <span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-[var(--brand)]/10 text-[var(--brand)]">
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
          {address ? (
            <MapEmbed address={address} className="h-[220px] w-full md:h-full" />
          ) : (
            <div className="h-[220px] w-full md:h-full bg-neutral-100 grid place-items-center text-neutral-500 text-sm">
              Map not available
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
