import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";
import { XIcon, FacebookIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="mt-24 bg-footer text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <div className="inline-block rounded-full bg-white px-4 py-2 text-navy"><Logo /></div>
          <p className="mt-4 max-w-xs text-white/75">
            Find an approved tutor by class, subject and budget, then apply in one tap.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="https://x.com" aria-label="MentorLagbe on X" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white hover:text-navy">
              <XIcon />
            </a>
            <a href="https://facebook.com" aria-label="MentorLagbe on Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white hover:text-navy">
              <FacebookIcon />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold">Quick links</h3>
          <ul className="mt-4 space-y-2 text-white/75">
            <li><Link className="hover:text-white" href="/tuitions">Browse Tuitions</Link></li>
            <li><Link className="hover:text-white" href="/pricing">Pricing</Link></li>
            <li><Link className="hover:text-white" href="/sign-up">Become a Tutor</Link></li>
            <li><Link className="hover:text-white" href="/#how-it-works">How It Works</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold">Contact</h3>
          <ul className="mt-4 space-y-3 text-white/75">
            <li className="flex items-center gap-3"><Mail size={18} /> hello@mentorlagbe.com</li>
            <li className="flex items-center gap-3"><Phone size={18} /> +880 1700-000000</li>
            <li className="flex items-center gap-3"><MapPin size={18} /> Dhanmondi, Dhaka, Bangladesh</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-white/60">
        © 2026 MentorLagbe. All rights reserved.
      </div>
    </footer>
  );
}
