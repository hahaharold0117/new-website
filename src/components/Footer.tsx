// src/components/Footer.tsx
import React from "react";
import Container from "./Container";
import { FaGoogle, FaXTwitter, FaFacebookF, FaGithub } from "react-icons/fa6";

type FooterProps = {
  company?: string;
  year?: number;
  links?: { label: string; href: string }[];
  socials?: { label: string; href: string; icon: React.ReactNode }[];
};

export default function Footer({
  company = "ACME Ltd.",
  year = new Date().getFullYear(),
  links = [
    { label: "Terms of Use", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Site Credit", href: "#" },
  ],
  socials = [
    { label: "Google", href: "#", icon: <FaGoogle className="text-lg text-[#ea4335]" /> },
    { label: "Twitter / X", href: "#", icon: <FaXTwitter className="text-lg text-black" /> },
    { label: "Facebook", href: "#", icon: <FaFacebookF className="text-lg text-[#1877f2]" /> },
    { label: "GitHub", href: "#", icon: <FaGithub className="text-lg text-black" /> },
  ],
}: FooterProps) {
  return (
    <footer className="mt-auto">
      <Container>
        <div className="py-10 text-center space-y-6">
          {/* Socials */}
          <div className="flex justify-center gap-3">
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.href}
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm hover:bg-neutral-50"
              >
                {s.icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-neutral-600">© {year} {company}. All rights reserved.</p>

          {/* Links */}
          <div className="flex justify-center gap-4 text-sm text-neutral-600">
            {links.map((l, i) => (
              <React.Fragment key={l.label}>
                {i > 0 && <span>•</span>}
                <a href={l.href} className="hover:text-[var(--brand)]">
                  {l.label}
                </a>
              </React.Fragment>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
