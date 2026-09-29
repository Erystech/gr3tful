import { Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

export default function PublicPageLayout({ eyebrow, title, children }) {
  return (
    <div className="min-h-screen bg-surface px-6 py-10 text-darkb transition-colors duration-300">
      <div className="mx-auto max-w-190">
        <div className="mb-12 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-darkb">
            <span>✦</span> gr3tful
          </Link>
          <ThemeToggle />
        </div>

        <main className="rounded-3xl border border-borderline bg-secondary-bg p-6 sm:p-10">
          <p className="mb-2 font-parag text-xs uppercase tracking-[2px] text-secondary">{eyebrow}</p>
          <h1 className="mb-8 font-heading text-[clamp(32px,6vw,52px)] leading-tight text-darkb">{title}</h1>
          <div className="space-y-7 font-parag text-[15px] leading-7 text-secondary-text">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
