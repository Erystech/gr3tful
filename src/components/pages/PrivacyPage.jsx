import PublicPageLayout from "../layout/PublicPageLayout";

export default function PrivacyPage() {
  return (
    <PublicPageLayout eyebrow="Legal" title="Privacy Policy">
      <p>Gr3tful stores the information needed to provide your private gratitude journal: your account email, journal entries, tags, and entry dates.</p>
      <section>
        <h2 className="mb-2 font-heading text-xl text-darkb">How your information is used</h2>
        <p>Your information is used to sign you in, save and display your journal, calculate your streak, and send essential account emails such as confirmation and password-reset messages.</p>
      </section>
      <section>
        <h2 className="mb-2 font-heading text-xl text-darkb">Who can see your journal</h2>
        <p>Your journal entries are protected by account-level access controls. Other users cannot read them. Gr3tful publishes only a combined count of gratitudes written by everyone; that number contains no journal text or personal activity.</p>
      </section>
      <section>
        <h2 className="mb-2 font-heading text-xl text-darkb">Service providers</h2>
        <p>Gr3tful uses trusted providers to host the application and database and to deliver essential account emails. These providers process only the information required to perform those services.</p>
      </section>
      <section>
        <h2 className="mb-2 font-heading text-xl text-darkb">Your choices</h2>
        <p>You may request access to, correction of, or deletion of your account information through the Contact page. This policy will be updated if Gr3tful’s data practices change.</p>
      </section>
      <p className="text-xs">Effective: September 25, 2026</p>
    </PublicPageLayout>
  );
}
