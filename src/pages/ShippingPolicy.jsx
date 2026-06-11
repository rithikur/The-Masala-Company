import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';

const ShippingPolicy = () => {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-cream py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 shadow-sm border border-spice-brown/10">
          <span className="text-xs uppercase tracking-[0.2em] text-turmeric font-semibold block mb-3">Logistics</span>
          <h1 className="text-4xl font-display text-spice-brown mb-8">Shipping Policy</h1>
          
          <div className="space-y-8 font-body text-charcoal-soft leading-relaxed text-sm">
            <p>At The Masala Company, we take immense care in packaging our premium spices so they reach your kitchen with their volatile oils and aromas fully intact.</p>

            <section>
              <h2 className="font-display text-xl text-spice-brown mb-3">Processing Times</h2>
              <p>All orders are hand-blended and packed to order. Please allow <strong>1-2 business days</strong> for us to process and dispatch your order. Orders placed after 12:00 PM IST on Friday will be processed the following Monday.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-spice-brown mb-3">Domestic Shipping (India)</h2>
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left border-collapse border border-spice-brown/10">
                  <thead>
                    <tr className="bg-cream-dark">
                      <th className="p-3 border border-spice-brown/10 font-semibold text-spice-brown">Shipping Method</th>
                      <th className="p-3 border border-spice-brown/10 font-semibold text-spice-brown">Estimated Time</th>
                      <th className="p-3 border border-spice-brown/10 font-semibold text-spice-brown">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border border-spice-brown/10">Standard Shipping</td>
                      <td className="p-3 border border-spice-brown/10">3-5 Business Days</td>
                      <td className="p-3 border border-spice-brown/10">₹80</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-spice-brown/10">Express Delivery</td>
                      <td className="p-3 border border-spice-brown/10">1-2 Business Days</td>
                      <td className="p-3 border border-spice-brown/10">₹150</td>
                    </tr>
                    <tr className="bg-green-50/50">
                      <td className="p-3 border border-spice-brown/10 font-medium">Orders over ₹1,500</td>
                      <td className="p-3 border border-spice-brown/10">3-5 Business Days</td>
                      <td className="p-3 border border-spice-brown/10 font-medium text-green-700">FREE</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl text-spice-brown mb-3">International Shipping</h2>
              <p>We ship globally to select countries. International shipping rates are calculated dynamically at checkout based on package weight and destination. Delivery typically takes <strong>7-14 business days</strong>. Please note that customers are responsible for any customs duties or import taxes levied by their respective countries.</p>
            </section>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ShippingPolicy;