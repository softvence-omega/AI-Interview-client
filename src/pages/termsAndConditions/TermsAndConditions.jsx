import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Terms and Conditions(will be updated according to you)
        </h1>
        <p className="text-sm text-gray-500 mb-8 text-center">
          Last Updated: June 11, 2025
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
          <p className="text-gray-600 leading-relaxed">
            Welcome to our platform ("Service"). These Terms and Conditions ("Terms") govern your use of our website, applications, and services provided by [Your Company Name] ("we," "us," or "our"). By accessing or using our Service, you agree to be bound by these Terms. If you do not agree, please do not use our Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Eligibility</h2>
          <p className="text-gray-600 leading-relaxed">
            You must be at least 18 years old to use our Service. By using our Service, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Accounts</h2>
          <p className="text-gray-600 leading-relaxed">
            To access certain features of our Service, you may need to create an account. You agree to provide accurate and complete information during registration and to keep your account credentials confidential. You are responsible for all activities that occur under your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Use of Service</h2>
          <p className="text-gray-600 leading-relaxed">
            You agree to use our Service only for lawful purposes and in accordance with these Terms. You may not:
          </p>
          <ul className="list-disc pl-6 text-gray-600 leading-relaxed mt-2">
            <li>Use the Service in any way that violates applicable laws or regulations.</li>
            <li>Engage in unauthorized access to or interference with our systems.</li>
            <li>Post or transmit harmful, offensive, or unlawful content.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Intellectual Property</h2>
          <p className="text-gray-600 leading-relaxed">
            All content, trademarks, and other intellectual property on our Service are owned by or licensed to us. You may not reproduce, distribute, or create derivative works from our content without our express written permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Termination</h2>
          <p className="text-gray-600 leading-relaxed">
            We may suspend or terminate your access to our Service at our discretion, with or without notice, for any reason, including if we believe you have violated these Terms. Upon termination, your right to use the Service will cease immediately.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Limitation of Liability</h2>
          <p className="text-gray-600 leading-relaxed">
            To the fullest extent permitted by law, [Your Company Name] shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability to you for any claim will not exceed the amount you paid us, if any, for the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Changes to Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            We may update these Terms from time to time. We will notify you of significant changes by posting the updated Terms on our Service or through other communication methods. Your continued use of the Service after such changes constitutes your acceptance of the revised Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Governing Law</h2>
          <p className="text-gray-600 leading-relaxed">
            These Terms are governed by and construed in accordance with the laws of [Your State/Country]. Any disputes arising under these Terms will be resolved in the courts of [Your Jurisdiction].
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            [Your Company Name]<br />
            Email: support@[yourdomain].com<br />
            Phone: [Your Phone Number]<br />
            Address: [Your Address]
          </p>
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

export default TermsAndConditions;
