import Link from 'next/link';
import Footer from '@/components/sections/Footer';
import LegalToc from '@/components/sections/LegalToc';
import { isProduction } from '@/lib/seo';

const TOC = [
  { id: 'overview', label: '1. Overview' },
  { id: 'information-we-collect', label: '2. Information we collect' },
  { id: 'how-we-use', label: '3. How we use information' },
  { id: 'google-api', label: '4. Google API Services' },
  { id: 'sharing', label: '5. How we share information' },
  { id: 'retention', label: '6. Data retention' },
  { id: 'security', label: '7. Security' },
  { id: 'your-rights', label: '8. Your rights & choices' },
  { id: 'international', label: '9. International transfers' },
  { id: 'children', label: "10. Children's privacy" },
  { id: 'changes', label: '11. Changes to this policy' },
  { id: 'contact', label: '12. Contact us' },
];

export const metadata = {
  title: 'Privacy Policy — Eijent',
  description:
    "Eijent's Privacy Policy. How we collect, use, and protect your data — including data accessed via Google API Services.",
  alternates: { canonical: '/privacy-policy' },
  robots: isProduction ? { index: true, follow: true } : { index: false, follow: false },
};

export default function PrivacyPolicy() {
  return (
    <>
      <section className="legal-hero">
        <div className="legal-shell">
          <div className="eyebrow eyebrow--indigo">Legal</div>
          <h1>Privacy Policy</h1>
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
            <h2 id="overview">1. Overview</h2>
            <p>This Privacy Policy explains how <strong>Eijent</strong> (&ldquo;Eijent,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, discloses, and protects information when you use the Eijent platform, including our website at <a href="https://eijent.app">eijent.app</a>, our web and mobile applications, our Pulse hardware companion, and any related services (collectively, the &ldquo;Service&rdquo;).</p>
            <p>Eijent is an AI-first operational platform for revenue teams, currently in private beta. By using the Service, you agree to the practices described in this Privacy Policy. If you do not agree, please do not use the Service.</p>
            <p>Eijent is operated by Eijent, Inc., a Delaware corporation, in collaboration with our sister companies Blueprint Studios and Hensley Event Resources. We act as a data controller for personal information collected through our website and as a data processor for information our customers upload or generate while using the Service.</p>

            <h2 id="information-we-collect">2. Information we collect</h2>

            <h3>2.1 Information you provide directly</h3>
            <ul>
              <li><strong>Account information:</strong> name, email address, company, role, profile photo, and password (hashed). For waitlist signups, only the email address is collected.</li>
              <li><strong>Authentication credentials:</strong> when you sign in with Google, we receive your Google account identifier, email address, name, and profile picture (see Section 4).</li>
              <li><strong>Workspace content:</strong> entities, pipelines, workflows, knowledge base documents, comments, tasks, and any other content you create or upload inside Eijent.</li>
              <li><strong>Communications:</strong> any messages you send to us, including support requests, feedback, and survey responses.</li>
              <li><strong>Payment information:</strong> when applicable, billing details processed by our payment provider (Stripe). We do not store full card numbers.</li>
            </ul>

            <h3>2.2 Information collected automatically</h3>
            <ul>
              <li><strong>Usage data:</strong> pages viewed, features used, click events, session duration, referring URLs, and similar product analytics.</li>
              <li><strong>Device &amp; log data:</strong> IP address, browser type, operating system, device identifiers, timestamps, error logs, and crash reports.</li>
              <li><strong>Cookies &amp; similar technologies:</strong> we use first-party cookies for essential session management and a limited set of analytics cookies. See our Cookie practices below.</li>
            </ul>

            <h3>2.3 Information from Pulse</h3>
            <p>If you use the Pulse hardware companion or the Pulse mobile app, we collect audio recordings of conversations you choose to capture, along with the date, time, and (with your permission) the approximate location of the capture. Audio is transcribed on-device for a first pass and encrypted before transmission to our servers for further enrichment. You can review, edit, redact, or delete any Pulse capture at any time.</p>

            <h3>2.4 Information from third parties</h3>
            <p>We may receive information from third-party services you connect to your Eijent workspace — including Google Workspace, Microsoft 365, Slack, calendar providers, CRM and call tools — only to the extent you authorize. See Section 4 for the specific scopes we request from Google.</p>

            <h2 id="how-we-use">3. How we use information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, secure, and improve the Service;</li>
              <li>Authenticate you and protect against fraud, abuse, and unauthorized access;</li>
              <li>Personalize your workspace, including AI features (Copilot and custom Eijents) grounded in your Knowledge Base;</li>
              <li>Communicate with you about product updates, security alerts, billing, and customer support;</li>
              <li>Generate aggregated, de-identified analytics to understand and improve product performance;</li>
              <li>Comply with legal obligations and enforce our <Link href="/terms-of-use">Terms of Use</Link>.</li>
            </ul>
            <p>We do <strong>not</strong> use your workspace content, Pulse audio, or any data accessed via Google API Services to train generalized machine-learning or AI models. AI features operate only within your workspace context.</p>

            <h2 id="google-api">4. Google API Services</h2>

            <div className="callout">
              <div className="callout__label">Limited Use disclosure</div>
              <h3>Eijent&rsquo;s use of information received from Google APIs adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements.</h3>
              <p>Specifically, Eijent affirms that data received from Google APIs is used only to provide or improve user-facing features that are prominent in the Eijent user interface; is not transferred to third parties except as necessary to provide or improve the Service, comply with applicable law, or as part of a merger or acquisition; is not used for serving advertisements; and is never read by humans unless we have your affirmative agreement for specific messages, do so for security purposes, to comply with applicable law, or our use is limited to internal operations and the data has been aggregated and anonymized.</p>
            </div>

            <h3>4.1 Google services we access</h3>
            <p>If you sign in with Google or connect a Google Workspace account, Eijent may request access to one or more of the following Google API scopes — only those you explicitly grant during the OAuth consent flow:</p>
            <ul>
              <li><strong>Sign-in (OpenID Connect):</strong> <code>openid</code>, <code>email</code>, <code>profile</code> — used to authenticate you, create your Eijent account, and display your name and avatar in the product.</li>
              <li><strong>Gmail (optional):</strong> <code>gmail.readonly</code>, <code>gmail.send</code>, <code>gmail.modify</code> — used to surface email threads against the correct Eijent Entity, draft and send follow-ups on your behalf when you instruct us to, and apply labels. We do not scan your inbox for advertising purposes.</li>
              <li><strong>Google Calendar (optional):</strong> <code>calendar.events</code>, <code>calendar.readonly</code> — used to display meetings against Entities, propose times, and create or update calendar events when you instruct us to.</li>
              <li><strong>Google Drive (optional):</strong> <code>drive.file</code> — used only to access files you explicitly select or that Eijent creates on your behalf. We do not request full-Drive read access.</li>
            </ul>

            <h3>4.2 How Google data is stored and used</h3>
            <ul>
              <li>OAuth tokens are stored encrypted at rest using industry-standard envelope encryption (AES-256 with keys managed by a dedicated KMS).</li>
              <li>Google data is processed only to deliver the user-facing features described above and is never shared with any third party for advertising or analytics.</li>
              <li>Google data is not used to train any machine-learning model, including those provided by third-party LLM vendors.</li>
              <li>Eijent does not transfer Google user data to any third party except service providers acting on our behalf under strict data-protection agreements (see Section 5).</li>
            </ul>

            <h3>4.3 Revoking access</h3>
            <p>You can revoke Eijent&rsquo;s access to your Google account at any time from your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">Google Account permissions page</a> or from within Eijent under <em>Settings → Connections</em>. Revoking access immediately terminates our ability to read or write data on your behalf.</p>

            <h2 id="sharing">5. How we share information</h2>
            <p>We share personal information only in the following circumstances:</p>
            <ul>
              <li><strong>With your workspace members.</strong> Content you create inside a workspace is visible to other members of that workspace according to the access controls you configure.</li>
              <li><strong>With service providers.</strong> We use vetted third-party processors who provide hosting (Amazon Web Services), email delivery, customer support, error monitoring, payment processing (Stripe), and AI model inference. Each provider is bound by a written data-protection agreement and is permitted to use data only to provide services to us.</li>
              <li><strong>For legal reasons.</strong> We may disclose information if we have a good-faith belief that disclosure is required to comply with a law, regulation, legal process, or governmental request, or to protect the rights, property, or safety of Eijent, our users, or the public.</li>
              <li><strong>In a corporate transaction.</strong> If Eijent is involved in a merger, acquisition, financing, or sale of assets, your information may be transferred to the successor entity, subject to the protections of this Privacy Policy.</li>
              <li><strong>With your consent.</strong> Where required by law or where you have specifically authorized a disclosure.</li>
            </ul>
            <p>We do <strong>not</strong> sell personal information. We do not share data with third parties for advertising purposes.</p>

            <h2 id="retention">6. Data retention</h2>
            <p>We retain personal information only as long as needed to provide the Service, comply with our legal obligations, resolve disputes, and enforce our agreements. Specifically:</p>
            <ul>
              <li><strong>Workspace content:</strong> retained for as long as your workspace is active, plus 30 days after deletion for recovery.</li>
              <li><strong>Pulse audio:</strong> retained according to your workspace settings (default: 90 days after transcription, then audio is deleted while structured signal is kept).</li>
              <li><strong>Account information:</strong> retained while your account is active; deleted within 60 days of account closure unless retention is required by law.</li>
              <li><strong>Analytics &amp; log data:</strong> retained in identifiable form for up to 13 months, then aggregated.</li>
              <li><strong>Waitlist email addresses:</strong> retained until you ask to be removed.</li>
            </ul>

            <h2 id="security">7. Security</h2>
            <p>We take security seriously and use industry-standard administrative, technical, and physical safeguards to protect personal information, including:</p>
            <ul>
              <li>Encryption in transit (TLS 1.2+) and at rest (AES-256);</li>
              <li>OAuth tokens stored under envelope encryption with keys managed by a dedicated KMS;</li>
              <li>On-device first-pass transcription for Pulse audio so audio never leaves your context unencrypted;</li>
              <li>Role-based access controls and least-privilege principles for all employee access;</li>
              <li>Continuous vulnerability scanning, dependency monitoring, and quarterly penetration testing;</li>
              <li>SOC 2 Type II audit in progress; we expect to complete certification within twelve months of general availability.</li>
            </ul>
            <p>No system is perfectly secure. If we become aware of a personal-data breach, we will notify affected users in accordance with applicable law.</p>

            <h2 id="your-rights">8. Your rights &amp; choices</h2>
            <p>Depending on where you live, you may have the following rights under applicable data protection laws (including the GDPR in the European Economic Area, the UK GDPR, and the CCPA/CPRA in California):</p>
            <ul>
              <li><strong>Access.</strong> Request a copy of the personal information we hold about you.</li>
              <li><strong>Correction.</strong> Ask us to correct inaccurate or incomplete information.</li>
              <li><strong>Deletion.</strong> Ask us to delete your personal information, subject to limited exceptions.</li>
              <li><strong>Portability.</strong> Receive a copy of your data in a structured, machine-readable format.</li>
              <li><strong>Restriction or objection.</strong> Ask us to restrict or stop certain types of processing.</li>
              <li><strong>Withdraw consent.</strong> Where we rely on your consent (such as for Google API access), withdraw it at any time.</li>
              <li><strong>Lodge a complaint.</strong> Contact your local data-protection authority.</li>
            </ul>
            <p>To exercise any of these rights, email us at <a href="mailto:privacy@eijent.app">privacy@eijent.app</a>. We will respond within 30 days.</p>

            <h2 id="international">9. International transfers</h2>
            <p>Eijent is headquartered in the United States. If you are located outside the United States, your information will be transferred to, stored in, and processed in the United States and other countries where our service providers operate. For transfers from the European Economic Area, the United Kingdom, and Switzerland, we rely on Standard Contractual Clauses approved by the European Commission and equivalent mechanisms in other jurisdictions.</p>

            <h2 id="children">10. Children&rsquo;s privacy</h2>
            <p>Eijent is not directed to children under sixteen (16), and we do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us and we will delete it promptly.</p>

            <h2 id="changes">11. Changes to this policy</h2>
            <p>We may update this Privacy Policy from time to time. The most current version will always be posted at this URL, with the &ldquo;Last updated&rdquo; date noted at the top. If we make material changes, we will notify you by email or through a prominent in-product notice at least 30 days before the change takes effect.</p>

            <h2 id="contact">12. Contact us</h2>
            <p>If you have questions about this Privacy Policy or our data practices, please reach out:</p>

            <div className="contact-strip">
              <div className="contact-strip__row">
                <span className="contact-strip__label">Email</span>
                <span className="contact-strip__value"><a href="mailto:privacy@eijent.app">privacy@eijent.app</a></span>
              </div>
              <div className="contact-strip__row">
                <span className="contact-strip__label">General</span>
                <span className="contact-strip__value"><a href="mailto:hello@eijent.app">hello@eijent.app</a></span>
              </div>
              <div className="contact-strip__row">
                <span className="contact-strip__label">Mail</span>
                <span className="contact-strip__value">Eijent, Inc. &middot; 1730 Marin Way &middot; San Francisco, CA 94124 &middot; USA</span>
              </div>
              <div className="contact-strip__row">
                <span className="contact-strip__label">DPO</span>
                <span className="contact-strip__value"><a href="mailto:dpo@eijent.app">dpo@eijent.app</a> (EU/UK data protection inquiries)</span>
              </div>
            </div>
          </article>
        </div>
      </div>

      <Footer />
    </>
  );
}
