import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 mt-4">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Privacy Policy</h1>
        <p className="text-sm text-gray-800 mb-8 text-right leading-[160%]">
          <span className='font-semibold text-gray-900'>Effective Date:</span> June 1st, 2025 <br /> <span className='font-semibold text-gray-900'>Last Updated:</span> June 1st, 2025
        </p>

        <p className="text-md text-gray-700 leading-relaxed mb-6">Inprep.ai (“we,” “us,” or “our”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, app, Chrome extension, and related services (collectively, the “Service”).</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">1. Information We Collect</h2>
          <p className="text-md text-gray-700 leading-relaxed mb-6">
            <strong>a. Personal Information:</strong> We collect personal information when you:
          </p>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-6">
            <li>Register (email, name, profile image via Google or direct signup)</li>
            <li>Use the Service (mock interviews, assessments, session logs)</li>
            <li>Contact support or provide feedback</li>
          </ul>
          <p className="text-md text-gray-700 leading-relaxed mb-6">
            <strong>b. Interview & Session Data:</strong> When using our mock interview tools, we collect:
          </p>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-6">
            <li>Video/audio recordings (with your camera/mic permission)</li>
            <li>Transcripts and interview responses</li>
            <li>AI-generated feedback (voice tone, eye contact, pacing, etc.)</li>
          </ul>
          <p className="text-md text-gray-700 leading-relaxed mb-6">
            <strong>c. Imported Job Listings:</strong> If you use our Chrome extension, we may collect job descriptions or postings you import from LinkedIn, Indeed, Glassdoor, etc., to tailor your mock interviews.
          </p>
          <p className="text-md text-gray-700 leading-relaxed mb-6">
            <strong>d. Device & Usage Data:</strong> We automatically collect:
          </p>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
            <li>Browser type, IP address, operating system</li>
            <li>Device identifiers and usage metrics</li>
            <li>Cookie data (see Cookie Policy)</li>
          </ul>
        </section>

        <hr className="border-t border-gray-400 mb-6" />

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">2. How We Use Your Data</h2>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
            <li>Provide and personalize the Service</li>
            <li>Deliver feedback and performance analytics</li>
            <li>Improve our AI models and user experience</li>
            <li>Respond to inquiries and support requests</li>
            <li>Send occasional updates or promotional materials (opt-out available)</li>
          </ul>
        </section>

        <hr className="border-t border-gray-400 mb-6" />

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">3. Sharing & Disclosure</h2>
          <p className="text-md text-gray-700 leading-relaxed">
            We do not sell your personal information. We may share data with:
          </p>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
            <li>Service providers (cloud storage, analytics, support tools) under confidentiality agreements</li>
            <li>Legal authorities if required by law, subpoena, or in defense of our rights</li>
            <li>Aggregated analytics for product development (non-identifiable form)</li>
          </ul>
        </section>

        <hr className="border-t border-gray-400 mb-6" />

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">4. Cookies & Tracking Technologies</h2>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
            <li>Authenticate users and maintain sessions</li>
            <li>Analyze site usage and improve performance</li>
            <li>Customize content and ads (via Google Analytics, Meta Pixel, etc.)</li>
          </ul>
          <p className="text-md text-gray-700 leading-relaxed mt-2">
            You can manage cookie preferences via your browser settings. See our <span className="underline">Cookie Policy</span> for details.
          </p>
        </section>

        <hr className="border-t border-gray-400 mb-6" />

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">5. Data Retention</h2>
          <p className="text-md text-gray-700 leading-relaxed">
            We retain your data as long as your account is active or as needed to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
            <li>Comply with legal obligations</li>
            <li>Resolve disputes</li>
            <li>Enforce our agreements</li>
          </ul>
          <p className="text-md text-gray-700 leading-relaxed mt-2">
            You may delete your account or request deletion of your data by emailing us at: <a href="mailto:support@inprep.ai" className="text-blue-700 underline">support@inprep.ai</a>
          </p>
        </section>

        <hr className="border-t border-gray-400 mb-6" />

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">6. Data Security</h2>
          <p className="text-md text-gray-700 leading-relaxed">
            We implement technical and organizational safeguards to protect your data, including encryption, secure data centers, and access controls. However, no system is 100% secure — please use strong passwords and notify us of any suspicious activity.
          </p>
        </section>

        <hr className="border-t border-gray-400 mb-6" />

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">7. Your Rights</h2>
          <p className="text-md text-gray-700 leading-relaxed">
            Depending on your location (e.g., GDPR, CCPA), you may have the right to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
            <li>Access your personal data</li>
            <li>Correct or delete data</li>
            <li>Withdraw consent</li>
            <li>Port your data to another service</li>
            <li>Lodge complaints with regulatory authorities</li>
          </ul>
          <p className="text-md text-gray-700 leading-relaxed mt-2">
            To exercise these rights, contact: <a href="mailto:support@inprep.ai" className="text-blue-700 underline">support@inprep.ai</a>
          </p>
        </section>

        <hr className="border-t border-gray-400 mb-6" />

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">8. Children’s Privacy</h2>
          <p className="text-md text-gray-700 leading-relaxed">
            Inprep is not intended for users under 13 (or older if required by local law). We do not knowingly collect personal data from children.
          </p>
        </section>

        <hr className="border-t border-gray-400 mb-6" />

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">9. International Users</h2>
          <p className="text-md text-gray-700 leading-relaxed">
            If you’re accessing the Service from outside the U.S., your data may be transferred to, processed, and stored in the U.S. By using the Service, you consent to this transfer.
          </p>
        </section>

        <hr className="border-t border-gray-400 mb-6" />

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">10. Changes to This Policy</h2>
          <p className="text-md text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. We encourage you to review it regularly.
          </p>
        </section>

        <hr className="border-t border-gray-400 mb-6" />

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">11. Contact Us</h2>
          <ul className="text-md text-gray-700 leading-relaxed list-none pl-0">
            <li>Inprep (Hyrworx, Inc)</li>
            <li>13010 Morris Road, Suite 670, Alpharetta, GA, 30004</li>
            <li>Email: <a href="mailto:support@inprep.ai" className="text-blue-700 underline">support@inprep.ai</a></li>
          </ul>
        </section>

        <div className="text-center">
          <a
            href="/"
            className="inline-block px-6 py-2 text-white bg-[#37B874] rounded-lg hover:bg-[#2e9b64] transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
