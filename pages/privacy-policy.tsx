import Head from "next/head";
import NavFooterLayout from "@/components/layouts/nav-footer-layout.component";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - BlackPlum</title>
      </Head>
      <NavFooterLayout>
        <div className="bg-white px-6 py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Privacy Policy</h1>
            <p className="mt-6 text-xl leading-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <div className="mt-10 max-w-2xl">
              <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">Information We Collect</h2>
              <p className="mt-6">
                BlackPlum collects information you provide directly to us, such as when you create an account, 
                make an investment, or contact us for support. This may include:
              </p>
              <ul className="mt-4 list-disc list-inside space-y-2">
                <li>Name, email address, and contact information</li>
                <li>Investment preferences and financial information</li>
                <li>Identity verification documents</li>
                <li>Communications with us</li>
              </ul>

              <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">How We Use Your Information</h2>
              <p className="mt-6">
                We use the information we collect to:
              </p>
              <ul className="mt-4 list-disc list-inside space-y-2">
                <li>Process your investments and transactions</li>
                <li>Verify your accredited investor status</li>
                <li>Send you investment updates and communications</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Improve our services and platform</li>
              </ul>

              <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">Information Security</h2>
              <p className="mt-6">
                We implement appropriate technical and organizational measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. All data is encrypted in 
                transit and at rest.
              </p>

              <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">Contact Us</h2>
              <p className="mt-6">
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                <a href="mailto:privacy@blackplum.com" className="text-blue-600 hover:text-blue-500">
                  privacy@blackplum.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </NavFooterLayout>
    </>
  );
} 