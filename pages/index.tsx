import Head from "next/head";
import Hero from "@/components/landing-page/hero.component";
import HowItWorks from "@/components/landing-page/how-it-works.component";
import CtaSection from "@/components/landing-page/cta-section.component";
import ContactUs from "@/components/landing-page/contact-us.component";
import NavFooterLayout from "@/components/layouts/nav-footer-layout.component";

export default function Home() {
  return (
    <>
      <Head>
        <title>BlackPlum - Private Investment Platform</title>
      </Head>
      <NavFooterLayout>
        {/* Hero section */}
        <Hero />
        {/* How It Works section */}
        <HowItWorks />
        {/* CTA section */}
        <CtaSection />
        {/* Contact Us section */}
        <ContactUs />
      </NavFooterLayout>
    </>
  );
}
