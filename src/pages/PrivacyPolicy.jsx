import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';

const PrivacyPolicy = () => {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-cream py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 shadow-sm border border-spice-brown/10">
          <span className="text-xs uppercase tracking-[0.2em] text-turmeric font-semibold block mb-3">Legal</span>
          <h1 className="text-4xl font-display text-spice-brown mb-8">Privacy Policy</h1>
          
          <div className="space-y-8 font-body text-charcoal-soft leading-relaxed text-sm">
            <p>Your privacy is critically important to us. This policy explains how we collect, use, and protect your personal data when you interact with The Masala Company.</p>
            
            <section>
              <h2 className="font-display text-xl text-spice-brown mb-3">Information We Collect</h2>
              <ul className="list-none space-y-3">
                <li className="flex gap-3">
                  <span className="text-turmeric mt-1">✦</span>
                  <div><strong>Personal Identification:</strong> Name, email address, phone number, and shipping/billing addresses when you make a purchase or create an account.</div>
                </li>
                <li className="flex gap-3">
                  <span className="text-turmeric mt-1">✦</span>
                  <div><strong>Payment Information:</strong> Processed securely by our payment gateways; we do not store full credit card details on our servers.</div>
                </li>
                <li className="flex gap-3">
                  <span className="text-turmeric mt-1">✦</span>
                  <div><strong>Usage Data:</strong> Information on how you navigate our website, collected via cookies to improve your user experience.</div>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl text-spice-brown mb-3">How We Use Your Data</h2>
              <p>We use the collected data for various purposes, including:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>To process and fulfill your orders</li>
                <li>To provide customer support</li>
                <li>To notify you about changes to our service</li>
                <li>To send promotional emails (if opted in)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl text-spice-brown mb-3">Data Protection</h2>
              <p>We implement a variety of security measures to maintain the safety of your personal information. All sensitive data is transmitted via Secure Socket Layer (SSL) technology and encrypted in our database.</p>
            </section>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PrivacyPolicy;