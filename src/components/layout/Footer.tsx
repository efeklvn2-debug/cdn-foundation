import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo & Description */}
          <div>
            <img src={logo} alt="Pa J.I. Emerhana Foundation" className="h-14 w-auto mb-4 rounded-md" />
            <p className="text-primary-foreground/70 text-sm leading-relaxed mt-4">
              Raising visionary leaders for the sustainable development of the Niger Delta.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-accent font-sans text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "About", to: "/about" },
                { label: "Programs", to: "/programs" },
                { label: "Launch Address", to: "/launch-address" },
                { label: "News", to: "/news" },
                { label: "Gallery", to: "/gallery" },
                { label: "Donate", to: "/donate" },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="text-primary-foreground/70 hover:text-accent text-sm transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-accent font-sans text-sm font-semibold uppercase tracking-wider mb-4">Contact</h4>
            <div className="text-primary-foreground/70 text-sm space-y-2">
              <p>Niger Delta, Nigeria</p>
              <p>info@emerhana-foundation.org</p>
              <p>08055551696</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-primary-foreground/50 text-sm">
          © 2026 Pa J.I. Emerhana Foundation for Leadership & Development. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
