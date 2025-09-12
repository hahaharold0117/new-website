import { Phone, MapPin, Clock } from "lucide-react";
import Image from "next/image";

export default function ContactHours() {
  return (
    <div id="contact" className="grid gap-6 md:grid-cols-3">
      <div className="rounded-2xl border bg-white p-6 shadow-soft">
        <h4 className="font-bold mb-3">Contacts</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Phone className="text-brand" />
            <div>
              <p className="font-semibold">+44048384343</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="text-brand" />
            <div>
              <p>Herlan House, Field Street, Wolverhampton WV1 4LP</p>
            </div>
          </div>
        </div>
        <a
          href="#"
          className="mt-4 inline-flex rounded-full bg-brand px-4 py-2 text-white font-semibold"
        >
          Book A Table
        </a>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-soft">
        <h4 className="font-bold mb-3">Working Hours</h4>
        <div className="flex items-start gap-3">
          <Clock className="text-brand" />
          <p>Open Every Day: 11:00 – 23:45</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-3 shadow-soft">
        <Image
          src="/images/map-placeholder.jpg"
          alt="Map"
          width={800}
          height={600}
          className="h-56 w-full rounded-xl object-cover"
        />
      </div>
    </div>
  );
}
