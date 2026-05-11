/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import { createMetadata, pageMetadata, createJsonLd } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: pageMetadata.terms.title,
  description: pageMetadata.terms.description,
});

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createJsonLd("Organization")),
        }}
      />
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:px-12">
        <h1 className="mb-8 text-4xl font-bold">Terms of Service</h1>
        <p className="mb-8 text-sm text-gray-400">Last updated: May 2026</p>

        <section className="mb-12 space-y-6">
          <h2 className="text-2xl font-semibold text-orange-500">
            Agreement to Terms
          </h2>
          <p className="text-gray-300">
            By accessing and using HARON OS, you accept and agree to be bound by the
            terms and provision of this agreement. If you do not agree to abide by the
            above, please do not use this service.
          </p>
        </section>

        <section className="mb-12 space-y-6">
          <h2 className="text-2xl font-semibold text-orange-500">Use License</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              Permission is granted to temporarily download one copy of the materials
              (information or software) on HARON OS for personal, non-commercial
              transitory viewing only. This is the grant of a license, not a transfer
              of title, and under this license you may not:
            </p>
            <ul className="space-y-2 pl-4">
              <li>• Modifying or copying the materials</li>
              <li>• Using the materials for any commercial purpose or for any public display</li>
              <li>• Attempting to decompile or reverse engineer the software</li>
              <li>• Removing any copyright or other proprietary notations from the materials</li>
              <li>• Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>
          </div>
        </section>

        <section className="mb-12 space-y-6">
          <h2 className="text-2xl font-semibold text-orange-500">Disclaimer</h2>
          <p className="text-gray-300">
            The materials on HARON OS are provided on an 'as is' basis. HARON OS makes
            no warranties, expressed or implied, and hereby disclaims and negates all
            other warranties including, without limitation, implied warranties or
            conditions of merchantability, fitness for a particular purpose, or
            non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section className="mb-12 space-y-6">
          <h2 className="text-2xl font-semibold text-orange-500">Limitations</h2>
          <p className="text-gray-300">
            In no event shall HARON OS or its suppliers be liable for any damages
            (including, without limitation, damages for loss of data or profit, or due
            to business interruption) arising out of the use or inability to use the
            materials on HARON OS, even if HARON OS or an authorized representative
            has been notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section className="mb-12 space-y-6">
          <h2 className="text-2xl font-semibold text-orange-500">
            Accuracy of Materials
          </h2>
          <p className="text-gray-300">
            The materials appearing on HARON OS could include technical, typographical,
            or photographic errors. HARON OS does not warrant that any of the materials
            on its website are accurate, complete, or current. HARON OS may make changes
            to the materials contained on its website at any time without notice.
          </p>
        </section>

        <section className="mb-12 space-y-6">
          <h2 className="text-2xl font-semibold text-orange-500">Links</h2>
          <p className="text-gray-300">
            HARON OS has not reviewed all of the sites linked to its website and is not
            responsible for the contents of any such linked site. The inclusion of any
            link does not imply endorsement by HARON OS of the site. Use of any such
            linked website is at the user's own risk.
          </p>
        </section>

        <section className="mb-12 space-y-6">
          <h2 className="text-2xl font-semibold text-orange-500">
            Modifications
          </h2>
          <p className="text-gray-300">
            HARON OS may revise these terms of service for its website at any time
            without notice. By using this website, you are agreeing to be bound by the
            then current version of these terms of service.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-orange-500">
            Governing Law
          </h2>
          <p className="text-gray-300">
            These terms and conditions are governed by and construed in accordance with
            the laws of the jurisdiction in which HARON OS operates, and you
            irrevocably submit to the exclusive jurisdiction of the courts in that
            location.
          </p>
        </section>
      </div>
    </main>
  );
}
