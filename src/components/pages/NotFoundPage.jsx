import { Link } from "react-router-dom";
import PublicPageLayout from "../layout/PublicPageLayout";

export default function NotFoundPage() {
  return (
    <PublicPageLayout eyebrow="404 · Page not found" title="This path doesn't lead anywhere yet.">
      <div className="mx-auto max-w-xl py-8 text-center">
        <p className="mb-4 text-5xl" aria-hidden="true">🌿</p>
        <p className="mb-8 font-parag text-sm leading-7 text-secondary-text">
          The page may have moved, or the address may be incorrect.
        </p>
        <Link to="/" className="inline-block rounded-full bg-secondary px-7 py-3 font-parag text-sm italic text-fwhite">
          Return home
        </Link>
      </div>
    </PublicPageLayout>
  );
}
