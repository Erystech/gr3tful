import PublicPageLayout from "../layout/PublicPageLayout";

export default function ContactPage() {
  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL;

  return (
    <PublicPageLayout eyebrow="Support" title="Contact Gr3tful">
      <p>Need help with your account, password, journal data, or a privacy request? Get in touch and include the email address connected to your account.</p>
      {supportEmail ? (
        <a
          href={`mailto:${supportEmail}`}
          className="inline-flex rounded-full bg-secondary px-6 py-3 font-semibold text-fwhite"
        >
          Email {supportEmail}
        </a>
      ) : (
        <div role="status" className="rounded-2xl border border-borderline bg-surface p-5">
          The public support email will be added before launch.
        </div>
      )}
    </PublicPageLayout>
  );
}
