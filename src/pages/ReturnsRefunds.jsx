import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';

const ReturnsRefunds = () => {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-cream py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 shadow-sm border border-spice-brown/10">
          <span className="text-xs uppercase tracking-[0.2em] text-turmeric font-semibold block mb-3">Customer Care</span>
          <h1 className="text-4xl font-display text-spice-brown mb-8">Returns & Refunds</h1>
          
          <div className="space-y-6 font-body text-charcoal-soft leading-relaxed text-sm">
            <p className="text-base text-spice-brown font-medium">Your satisfaction is the foundation of our business. If you are not entirely satisfied with your purchase, we're here to help.</p>
            
            <section className="bg-cream-dark p-6 border-l-4 border-turmeric">
              <h2 className="font-display text-lg text-spice-brown mb-2">The Perishable Nature of Spices</h2>
              <p>Because spices are consumable, perishable food items, <strong>we cannot accept physical returns of opened or unopened products</strong> once they have been delivered. This policy ensures strict adherence to food safety and hygiene standards.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-spice-brown mb-3">Damaged or Incorrect Items</h2>
              <p>If your order arrives damaged, defective, or if you receive the wrong item, please notify us immediately. We will gladly issue a free replacement or a full refund.</p>
              <ul className="list-decimal pl-5 space-y-2 mt-4">
                <li>Contact us at <strong>returns@themasalacompany.com</strong> within 48 hours of delivery.</li>
                <li>Include your Order ID and clear photographs of the damaged item/packaging.</li>
                <li>Our team will review the claim within 1 business day and process your replacement or refund.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl text-spice-brown mb-3">Refund Processing</h2>
              <p>Approved refunds will be initiated to your original method of payment immediately. Please allow 5-7 business days for the credit to reflect in your account, depending on your card issuer's policies.</p>
            </section>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ReturnsRefunds;