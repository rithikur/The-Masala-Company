import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';

const TermsOfService = () => {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-cream py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 shadow-sm border border-spice-brown/10">
          <span className="text-xs uppercase tracking-[0.2em] text-turmeric font-semibold block mb-3">Legal</span>
          <h1 className="text-4xl font-display text-spice-brown mb-8">Terms of Service</h1>
          
          <div className="space-y-8 font-body text-charcoal-soft leading-relaxed text-sm">
            <section>
              <h2 className="font-display text-xl text-spice-brown mb-3">1. Agreement to Terms</h2>
              <p>By accessing or using The Masala Company website and purchasing our products, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-spice-brown mb-3">2. Products and Pricing</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>All products are subject to availability. We reserve the right to discontinue any product at any time.</li>
                <li>Prices for our products are subject to change without notice.</li>
                <li>We have made every effort to display the colors and images of our products accurately. However, natural agricultural products may vary slightly in appearance.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl text-spice-brown mb-3">3. User Accounts</h2>
              <p>When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-spice-brown mb-3">4. Intellectual Property</h2>
              <p>The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of The Masala Company and its licensors. The Service is protected by copyright, trademark, and other laws of both India and foreign countries.</p>
            </section>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default TermsOfService;