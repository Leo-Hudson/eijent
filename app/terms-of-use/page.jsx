import Link from 'next/link';
import Footer from '@/components/sections/Footer';
import LegalToc from '@/components/sections/LegalToc';
import { isProduction } from '@/lib/seo';

const TOC = [
  { id: 'acceptance', label: '1. Acceptance of terms' },
  { id: 'service', label: '2. The Service' },
  { id: 'accounts', label: '3. Accounts & registration' },
  { id: 'acceptable-use', label: '4. Acceptable use' },
  { id: 'user-content', label: '5. Your content' },
  { id: 'third-party', label: '6. Third-party integrations' },
  { id: 'beta', label: '7. Beta & preview features' },
  { id: 'subscriptions', label: '8. Subscriptions & fees' },
  { id: 'ip', label: '9. Intellectual property' },
  { id: 'privacy-ref', label: '10. Privacy' },
  { id: 'termination', label: '11. Termination' },
  { id: 'disclaimers', label: '12. Disclaimers' },
  { id: 'liability', label: '13. Limitation of liability' },
  { id: 'indemnification', label: '14. Indemnification' },
  { id: 'governing', label: '15. Governing law & disputes' },
  { id: 'changes', label: '16. Changes to these terms' },
  { id: 'general', label: '17. General provisions' },
  { id: 'contact', label: '18. Contact us' },
];

export const metadata = {
  title: 'Terms of Use — Eijent',
  description:
    'Terms of Use governing your access to and use of the Eijent platform, services, and Pulse hardware.',
  alternates: { canonical: '/terms-of-use' },
  robots: isProduction ? { index: true, follow: true } : { index: false, follow: false },
};

export default function TermsOfUse() {
  return (
    <>
      <section className="legal-hero">
        <div className="legal-shell">
          <div className="eyebrow eyebrow--indigo">Legal</div>
          <h1>Terms of Use</h1>
          <div className="legal-hero__meta">
            <span><strong>Effective:</strong> June 4, 2026</span>
            <span><strong>Last updated:</strong> June 4, 2026</span>
            <span><strong>Version:</strong> 1.0</span>
          </div>
        </div>
      </section>

      <div className="legal-shell">
        <div className="legal">
          <LegalToc items={TOC} />

          <article className="legal-content">
            <h2 id="acceptance">1. Acceptance of terms</h2>
            <p>These Terms of Use (&ldquo;Terms&rdquo;) form a binding agreement between you (&ldquo;you&rdquo; or &ldquo;User&rdquo;) and <strong>Eijent, Inc.</strong>, a Delaware corporation (&ldquo;Eijent,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), governing your access to and use of the Eijent platform, our website at <a href="https://eijent.app">eijent.app</a>, our web and mobile applications, our Pulse hardware companion, and any related services (collectively, the &ldquo;Service&rdquo;).</p>
            <p>By accessing or using the Service, joining the waitlist, signing in with a third-party identity provider (including Google), or clicking &ldquo;I agree&rdquo; where presented, you confirm that you have read, understood, and agree to be bound by these Terms and our <Link href="/privacy-policy">Privacy Policy</Link>. If you do not agree, do not use the Service.</p>
            <p>If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms, and &ldquo;you&rdquo; refers to both you personally and that organization.</p>

            <h2 id="service">2. The Service</h2>
            <p>Eijent provides an AI-first operational platform for revenue teams, including data, pipelines, workflows, AI agents (Copilot and custom Eijents), a Knowledge Base, an Activity timeline, and the optional Pulse hardware companion that captures real-world conversations.</p>
            <p>The Service is currently offered as a private beta to a select group of design partners. Features, pricing, and availability may change at any time during the beta period.</p>

            <h2 id="accounts">3. Accounts &amp; registration</h2>
            <h3>3.1 Eligibility</h3>
            <p>You must be at least eighteen (18) years old and have the legal capacity to enter into a contract to use the Service. The Service is intended for use by businesses and operational teams.</p>
            <h3>3.2 Account creation</h3>
            <p>To use most features, you must create an account. You agree to provide accurate, current, and complete information and to keep it updated. You are responsible for maintaining the confidentiality of your credentials (including any OAuth tokens issued through Google sign-in) and for all activities that occur under your account.</p>
            <h3>3.3 Notification</h3>
            <p>Notify us immediately at <a href="mailto:security@eijent.app">security@eijent.app</a> if you suspect unauthorized access to your account.</p>

            <h2 id="acceptable-use">4. Acceptable use</h2>
            <p>You agree not to, and not to permit any third party to:</p>
            <ul>
              <li>Use the Service for any illegal, harmful, fraudulent, or infringing purpose;</li>
              <li>Send spam, phishing messages, or unsolicited commercial communications;</li>
              <li>Upload or transmit malware, viruses, or any code intended to disrupt or damage software or hardware;</li>
              <li>Attempt to gain unauthorized access to the Service, our systems, or any user data;</li>
              <li>Reverse-engineer, decompile, or otherwise attempt to derive source code or trade secrets;</li>
              <li>Use the Service to develop a competing product or to train any machine-learning model;</li>
              <li>Use the Service in a way that violates the rights of any third party, including intellectual-property, privacy, or publicity rights;</li>
              <li>Record audio with Pulse in jurisdictions or contexts where doing so without consent is unlawful (you are responsible for obtaining all necessary consents);</li>
              <li>Use the Service to make automated decisions with significant legal or similarly significant effect on individuals without appropriate human oversight;</li>
              <li>Circumvent any usage limits, rate limits, or security mechanisms.</li>
            </ul>
            <p>We may suspend or terminate access if we reasonably believe you have violated these Terms.</p>

            <h2 id="user-content">5. Your content</h2>
            <h3>5.1 Ownership</h3>
            <p>You retain all rights to the content you create or upload to the Service, including entities, pipeline data, workflows, knowledge documents, comments, files, Pulse recordings and transcripts, and any AI-generated outputs you direct the Service to produce on your behalf (collectively, &ldquo;Your Content&rdquo;).</p>
            <h3>5.2 License to Eijent</h3>
            <p>You grant Eijent a worldwide, non-exclusive, royalty-free license to host, store, copy, process, transmit, and display Your Content solely as necessary to operate, maintain, secure, and improve the Service for you and the workspace members you authorize. This license ends when you delete Your Content or close your account, except where retention is required by law or for backup purposes (in which case content remains under the protections of this license until removed).</p>
            <h3>5.3 No training on Your Content</h3>
            <p>We do not use Your Content, including Pulse audio, to train any generalized machine-learning or AI model. AI features operate within your workspace context only.</p>
            <h3>5.4 Responsibility</h3>
            <p>You are solely responsible for Your Content and for ensuring that you have all necessary rights, consents, and permissions for the content you upload to or capture with the Service.</p>

            <h2 id="third-party">6. Third-party integrations</h2>
            <p>The Service may interoperate with third-party services you choose to connect, including Google Workspace, Microsoft 365, Slack, calendar providers, CRM platforms, and call-recording tools. Your use of any third-party service is governed by that service&rsquo;s own terms, and we are not responsible for the availability, accuracy, content, or practices of any third-party service.</p>
            <p>When you grant Eijent access to a third-party service (for example, through Google OAuth), you authorize us to access, read, and write data on your behalf only to the extent of the scopes you approve. You can revoke this access at any time from your account settings or from the third-party service. See our <Link href="/privacy-policy#google-api">Privacy Policy &middot; Section 4 (Google API Services)</Link> for details on Google integrations.</p>

            <h2 id="beta">7. Beta &amp; preview features</h2>
            <p>The Service is currently in private beta. Features designated as beta, preview, alpha, or experimental are provided on an &ldquo;as-is&rdquo; basis, may change or be discontinued at any time, and may contain bugs, errors, or other issues. We may collect additional usage data from beta features to improve them. You agree to provide reasonable feedback if requested, and you grant us a perpetual, royalty-free license to use any feedback you provide to improve the Service.</p>

            <h2 id="subscriptions">8. Subscriptions &amp; fees</h2>
            <h3>8.1 Pricing</h3>
            <p>During the private beta, the Service is provided to design partners at no cost. As we approach general availability, we will introduce paid plans. We will notify all active beta users at least 30 days before any fee takes effect, and beta partners will receive founding-team pricing in perpetuity.</p>
            <h3>8.2 Payments</h3>
            <p>If you elect to pay for the Service, fees are billed in advance on a subscription basis (monthly or annually) and are non-refundable except as required by law or as expressly stated in your subscription agreement. Taxes are your responsibility unless otherwise stated.</p>
            <h3>8.3 Pulse hardware</h3>
            <p>Pulse hardware, when made available, is sold separately and is governed by a separate hardware purchase agreement and limited warranty.</p>

            <h2 id="ip">9. Intellectual property</h2>
            <p>Eijent and our licensors own all right, title, and interest in and to the Service, including all software, designs, text, graphics, the Eijent name and logo, the Pulse name and design, and all associated trademarks and trade dress. Except for the limited rights expressly granted in these Terms, no rights are granted to you by implication, estoppel, or otherwise.</p>
            <p>You may not use Eijent&rsquo;s trademarks or branding without our prior written permission.</p>

            <h2 id="privacy-ref">10. Privacy</h2>
            <p>Our handling of personal information is described in our <Link href="/privacy-policy">Privacy Policy</Link>, which is incorporated into these Terms by reference. By using the Service, you agree to the practices described in the Privacy Policy.</p>

            <h2 id="termination">11. Termination</h2>
            <h3>11.1 By you</h3>
            <p>You may stop using the Service at any time and close your account from your account settings or by emailing <a href="mailto:hello@eijent.app">hello@eijent.app</a>.</p>
            <h3>11.2 By us</h3>
            <p>We may suspend or terminate your access immediately, with or without notice, if we reasonably believe you have violated these Terms, if continued provision would expose us to legal liability, or if we discontinue the Service or any portion of it.</p>
            <h3>11.3 Effect of termination</h3>
            <p>Upon termination, your right to access the Service ends. We will make Your Content available for export for at least 30 days after termination, after which we may delete it in accordance with our <Link href="/privacy-policy#retention">data-retention practices</Link>. Sections that by their nature should survive termination (including 5.2, 9, 12, 13, 14, 15, and 17) will survive.</p>

            <h2 id="disclaimers">12. Disclaimers</h2>
            <div className="caps">
              The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. To the maximum extent permitted by law, Eijent and its affiliates, licensors, and service providers disclaim all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, title, non-infringement, and any warranties arising out of course of dealing or usage of trade. We do not warrant that the Service will be uninterrupted, error-free, secure, or free of harmful components, or that any defect will be corrected. AI-generated outputs may be inaccurate, incomplete, or otherwise unsuitable for your purposes — you are responsible for reviewing all such outputs before relying on them.
            </div>

            <h2 id="liability">13. Limitation of liability</h2>
            <div className="caps">
              To the maximum extent permitted by law, in no event will Eijent, its affiliates, officers, directors, employees, agents, or licensors be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, including loss of profits, revenue, data, goodwill, or business opportunities, arising out of or related to these Terms or the Service, whether based on contract, tort (including negligence), strict liability, or any other legal theory, even if we have been advised of the possibility of such damages.
            </div>
            <div className="caps">
              Our total aggregate liability for any claim arising out of or related to these Terms or the Service will not exceed the greater of (a) the amounts you paid to us for the Service in the twelve (12) months preceding the event giving rise to the claim, or (b) one hundred US dollars (US$100). Some jurisdictions do not allow the limitation or exclusion of liability for certain damages, so the above limitations may not apply to you.
            </div>

            <h2 id="indemnification">14. Indemnification</h2>
            <p>You agree to defend, indemnify, and hold harmless Eijent and its affiliates, officers, directors, employees, and agents from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys&rsquo; fees) arising out of or related to (a) your use of the Service in violation of these Terms or applicable law; (b) Your Content; (c) your violation of any third-party right, including any intellectual-property or privacy right; or (d) any consent or recording activity you conduct using Pulse.</p>

            <h2 id="governing">15. Governing law &amp; disputes</h2>
            <p>These Terms are governed by the laws of the State of California, United States, without regard to its conflict-of-laws principles. The United Nations Convention on Contracts for the International Sale of Goods does not apply.</p>
            <p>Any dispute arising out of or related to these Terms or the Service will be resolved exclusively in the state or federal courts located in San Francisco, California, and you and we consent to personal jurisdiction in those courts. To the extent permitted by law, you and Eijent each waive any right to a jury trial.</p>

            <h2 id="changes">16. Changes to these terms</h2>
            <p>We may update these Terms from time to time. The most current version will always be posted at this URL with the &ldquo;Last updated&rdquo; date noted at the top. If we make material changes, we will notify you by email or through a prominent in-product notice at least 30 days before the change takes effect. Your continued use of the Service after the changes take effect constitutes acceptance of the updated Terms.</p>

            <h2 id="general">17. General provisions</h2>
            <ul>
              <li><strong>Entire agreement.</strong> These Terms, together with the Privacy Policy and any subscription agreement, constitute the entire agreement between you and Eijent regarding the Service and supersede any prior agreements.</li>
              <li><strong>Severability.</strong> If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.</li>
              <li><strong>No waiver.</strong> Our failure to enforce any provision is not a waiver of our right to do so later.</li>
              <li><strong>Assignment.</strong> You may not assign these Terms without our prior written consent. We may assign these Terms in connection with a merger, acquisition, or sale of assets.</li>
              <li><strong>Notices.</strong> We may give you notice by email, through the Service, or by posting on our website. You may give us notice at <a href="mailto:legal@eijent.app">legal@eijent.app</a>.</li>
              <li><strong>Force majeure.</strong> Neither party will be liable for any failure or delay caused by events beyond reasonable control, including acts of God, natural disasters, war, terrorism, pandemic, labor disputes, or government action.</li>
              <li><strong>Relationship.</strong> Nothing in these Terms creates a partnership, joint venture, employment, or agency relationship between you and Eijent.</li>
            </ul>

            <h2 id="contact">18. Contact us</h2>
            <p>If you have questions about these Terms, please reach out:</p>

            <div className="contact-strip">
              <div className="contact-strip__row">
                <span className="contact-strip__label">Legal</span>
                <span className="contact-strip__value"><a href="mailto:legal@eijent.app">legal@eijent.app</a></span>
              </div>
              <div className="contact-strip__row">
                <span className="contact-strip__label">Security</span>
                <span className="contact-strip__value"><a href="mailto:security@eijent.app">security@eijent.app</a></span>
              </div>
              <div className="contact-strip__row">
                <span className="contact-strip__label">General</span>
                <span className="contact-strip__value"><a href="mailto:hello@eijent.app">hello@eijent.app</a></span>
              </div>
              <div className="contact-strip__row">
                <span className="contact-strip__label">Mail</span>
                <span className="contact-strip__value">Eijent, Inc. &middot; 1730 Marin Way &middot; San Francisco, CA 94124 &middot; USA</span>
              </div>
            </div>
          </article>
        </div>
      </div>

      <Footer />
    </>
  );
}
