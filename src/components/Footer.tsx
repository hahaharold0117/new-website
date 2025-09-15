// src/components/Footer.tsx
import Container from "./Container";
import Link from "next/link";
import { FaGoogle, FaXTwitter, FaFacebookF, FaGithub } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="">
      <Container>
        <div className="py-10 text-center space-y-6">
          <div className="flex justify-center gap-3">
            <a
              href="#"
              aria-label="Google"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm hover:bg-neutral-50"
            >
              <FaGoogle className="text-lg text-[#ea4335]" />
            </a>
            <a
              href="#"
              aria-label="Twitter / X"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm hover:bg-neutral-50"
            >
              <FaXTwitter className="text-lg text-black" />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm hover:bg-neutral-50"
            >
              <FaFacebookF className="text-lg text-[#1877f2]" />
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm hover:bg-neutral-50"
            >
              <FaGithub className="text-lg text-black" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-neutral-600">
            © {new Date().getFullYear()} ACME Ltd. All rights reserved.
          </p>

          {/* Links */}
          <div className="flex justify-center gap-4 text-sm text-neutral-600">
            <Link href="#" className="hover:text-brand">Terms of Use</Link>
            <span>•</span>
            <Link href="#" className="hover:text-brand">Privacy Policy</Link>
            <span>•</span>
            <Link href="#" className="hover:text-brand">Site Credit</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}