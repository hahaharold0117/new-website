// src/components/Highlights.tsx
import ProductCard from "./ProductCard";

const items = [
  {
    id: "ck-flatbread",
    title: "Chicken Kebab Flatbread",
    desc: "Juicy chicken, fresh vegetables, and our signature sauce wrapped in...",
    price: "£8.99",
    img: "/images/dish-1.png",
  },
  {
    id: "mqb-a",
    title: "Mediterranean Quinoa Bowl",
    desc: "Healthy grains, fresh vegetables, and our signature sauce wrapped in...",
    price: "£8.99",
    img: "/images/dish-2.png",
  },
  {
    id: "mqb-b",
    title: "Mediterranean Quinoa Bowl",
    desc: "Juicy chicken, fresh vegetables, and our signature sauce wrapped in...",
    price: "£8.99",
    img: "/images/dish-3.png",
  },
];

export default function Highlights() {
  return (
    <div id="highlights" className="grid gap-6 md:grid-cols-3">
      {items.map(({ id, ...props }) => (
        <ProductCard key={id} {...props} />
      ))}
    </div>
  );
}
