import { Bike, Leaf, MapPinned } from "lucide-react";

const features = [
  {
    icon: Bike,
    title: "Quick Delivery",
    desc: "Fast delivery to your door in 30–45 minutes"
  },
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    desc: "Made daily with authentic Mediterranean ingredients"
  },
  {
    icon: MapPinned,
    title: "Wide Delivery Area",
    desc: "We deliver to most areas within the city limits"
  }
];

export default function FeatureBullets() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {features.map(({ icon: Icon, title, desc }) => (
        <div
          key={title}
          className="rounded-2xl border bg-white p-5 shadow-soft"
        >
          <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
              <Icon />
            </div>
            <div>
              <h4 className="font-semibold">{title}</h4>
              <p className="text-sm text-neutral-600">{desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
