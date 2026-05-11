import type { Metadata } from "next";
import { createMetadata, pageMetadata, createJsonLd } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: pageMetadata.privacy.title,
  description: pageMetadata.privacy.description,
});

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createJsonLd("Organization")),
        }}
      />
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:px-12">
        <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>
        <p className="mb-8 text-sm text-gray-400">Last updated: May 2026</p>

        <section className="mb-12 space-y-6">
          <h2 className="text-2xl font-semibold text-orange-500">Introduction</h2>
          <p className="text-gray-300">
            At HARON OS, we are committed to protecting your privacy. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your information when you
            visit our website and use our services.
          </p>
        </section>

        <section className="mb-12 space-y-6">
          <h2 className="text-2xl font-semibold text-orange-500">
            Information We Collect
          </h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-semibold text-white">Personal Information</h3>
              <p>We may collect personal information such as your name, email address,
                and usage data when you interact with our platform.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white">API Requests</h3>
              <p>We log API requests for rate limiting, security, and service improvement
                purposes. We do not store conversation content indefinitely.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white">Analytics Data</h3>
              <p>We use analytics to understand how you use HARON OS and to improve our
                services. This data is anonymized and aggregated.</p>
            </div>
          </div>
        </section>

        <section className="mb-12 space-y-6">
          <h2 className="text-2xl font-semibold text-orange-500">
            How We Use Your Information
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li>• To provide and maintain our services</li>
            <li>• To improve and optimize our platform</li>
            <li>• To prevent fraud and ensure security</li>
            <li>• To comply with legal obligations</li>
            <li>• To communicate with you about updates and changes</li>
          </ul>
        </section>

        <section className="mb-12 space-y-6">
          <h2 className="text-2xl font-semibold text-orange-500">Data Security</h2>
          <p className="text-gray-300">
            We implement industry-standard security measures to protect your information.
            However, no method of transmission over the internet is 100% secure. While we
            strive to protect your data, we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-12 space-y-6">
          <h2 className="text-2xl font-semibold text-orange-500">Third-Party Services</h2>
          <p className="text-gray-300">
            HARON OS uses Google Gemini API for AI functionality. We do not sell or share
            your personal information with third parties without your consent, except as
            required by law.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-orange-500">Contact Us</h2>
          <p className="text-gray-300">
            If you have questions about this Privacy Policy, please contact us through
            our contact page.
          </p>
        </section>
      </div>
    </main>
  );
}
