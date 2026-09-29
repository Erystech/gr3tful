import PublicPageLayout from "../layout/PublicPageLayout";

export default function TermsPage() {
  return (
    <PublicPageLayout eyebrow="Legal" title="Terms of Use">
      <p>Gr3tful is a personal gratitude-journaling tool. By using it, you agree to use the service lawfully and to provide accurate account information.</p>
      <section>
        <h2 className="mb-2 font-heading text-xl text-darkb">Your account</h2>
        <p>You are responsible for keeping your password secure and for activity performed through your account. Tell us promptly if you believe your account has been compromised.</p>
      </section>
      <section>
        <h2 className="mb-2 font-heading text-xl text-darkb">Your journal</h2>
        <p>You retain ownership of the content you write. You give Gr3tful permission to store and process it only as needed to operate the journal features you use.</p>
      </section>
      <section>
        <h2 className="mb-2 font-heading text-xl text-darkb">Wellbeing notice</h2>
        <p>Gr3tful supports personal reflection. It is not medical advice, mental-health treatment, or an emergency service.</p>
      </section>
      <section>
        <h2 className="mb-2 font-heading text-xl text-darkb">Availability</h2>
        <p>The service may change or occasionally be unavailable. We will take reasonable care of the product and your information, but cannot promise uninterrupted operation.</p>
      </section>
      <p className="text-xs">Effective: September 25, 2026</p>
    </PublicPageLayout>
  );
}
