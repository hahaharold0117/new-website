import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import Container from "./components/Container";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const photos = [
  { src: "https://images.unsplash.com/photo-1465311530779-5241f5a29892?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80", width: 1600, height: 1000 },
  { src: "https://images.unsplash.com/photo-1585338447937-7082f8fc763d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80", width: 1200, height: 1600 },
  { src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80", width: 1600, height: 1067 },
  { src: "https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80", width: 1400, height: 900 },
  { src: "https://images.unsplash.com/photo-1526281216101-e55f00f0db7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80", width: 1200, height: 800 },
];

export default function Gallery() {
  return (
    <Container>
      <h1 className="mt-6 mb-6 text-2xl font-bold">Gallery</h1>

      <nav className="mb-2 flex items-center text-sm text-gray-500">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span className="font-medium text-gray-700">Gallery</span>
      </nav>

      <RowsPhotoAlbum photos={photos} spacing={16} targetRowHeight={280} />
    </Container>
  );
}
