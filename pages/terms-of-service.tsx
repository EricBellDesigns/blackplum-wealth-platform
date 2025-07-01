import Head from "next/head";
import NavFooterLayout from "@/components/layouts/nav-footer-layout.component";

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service - BlackPlum</title>
      </Head>
      <NavFooterLayout>
        <div className="bg-white px-6 py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Terms of Service</h1>
            <p className="mt-6 text-xl leading-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <div className="mt-10 max-w-2xl">
              <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">Acceptance of Terms</h2>
              <p className="mt-6">
                By accessing and using the BlackPlum platform, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>

              <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">Eligibility</h2>
              <p className="mt-6">
                To use BlackPlum, you must:
              </p>
              <ul className="mt-4 list-disc list-inside space-y-2">
                <li>Be at least 18 years of age</li>
                <li>Be an accredited investor as defined by SEC regulations</li>
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
              </ul>

              <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">Investment Risks</h2>
              <p className="mt-6">
                All investments involve risk, including the potential loss of principal. Past performance 
                does not guarantee future results. You acknowledge that:
              </p>
              <ul className="mt-4 list-disc list-inside space-y-2">
                <li>Real estate investments are illiquid and speculative</li>
                <li>You may lose some or all of your investment</li>
                <li>Returns are not guaranteed</li>
                <li>You should consult with financial and tax advisors</li>
              </ul>

              <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">Prohibited Uses</h2>
              <p className="mt-6">
                You may not use the BlackPlum platform to:
              </p>
              <ul className="mt-4 list-disc list-inside space-y-2">
                <li>Violate any laws or regulations</li>
                <li>Provide false or misleading information</li>
                <li>Attempt to gain unauthorized access</li>
                <li>Interfere with platform operations</li>
              </ul>

              <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">Limitation of Liability</h2>
              <p className="mt-6">
                BlackPlum and its affiliates shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages resulting from your use of the platform.
              </p>

              <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">Contact Information</h2>
              <p className="mt-6">
                For questions about these Terms of Service, please contact us at:
                <br />
                <a href="mailto:legal@blackplum.com" className="text-blue-600 hover:text-blue-500">
                  legal@blackplum.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </NavFooterLayout>
    </>
  );
} 