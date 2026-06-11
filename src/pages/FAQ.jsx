import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';

const FAQ = () => {
  const faqs = [
    {
      q: "Are your spices certified organic?",
      a: "While many of our partner farms utilize traditional, pesticide-free, and regenerative farming practices that exceed organic standards, not all of our spices carry official organic certification due to the prohibitive costs of certification for smallholder farmers. We prioritize purity and ethical sourcing above all."
    },
    {
      q: "How should I store my Masala Company spices?",
      a: "To preserve their volatile essential oils, spices should be kept in airtight containers (like our premium glass jars) in a cool, dark place away from direct sunlight and heat sources like stoves. Never store spices in the refrigerator, as humidity can cause clumping."
    },
    {
      q: "What is the shelf life of your spices?",
      a: "Whole spices retain their optimal flavor for 1-2 years. Ground spices are best consumed within 6-8 months. Because we process in small batches, our spices reach you at peak freshness."
    },
    {
      q: "Are your spice blends gluten-free?",
      a: "Yes. Our facility processes only spices, herbs, and salts. There are no wheat or gluten products in our production area, ensuring our blends are naturally gluten-free."
    },
    {
      q: "Do you offer international shipping?",
      a: "Yes, we ship to most major international destinations. Shipping costs are calculated at checkout based on your location and the package weight."
    }
  ];

  return (
    <PageWrapper>
      <div className="min-h-screen bg-cream py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-turmeric font-semibold block mb-3">Knowledge Base</span>
            <h1 className="text-4xl md:text-5xl font-display text-spice-brown mb-6">Frequently Asked Questions</h1>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 md:p-8 shadow-sm border border-spice-brown/10 hover:border-spice-brown/30 transition-colors">
                <h3 className="font-display text-xl text-spice-brown mb-3 flex items-start gap-3">
                  <span className="text-turmeric font-bold">Q.</span> {faq.q}
                </h3>
                <p className="font-body text-charcoal-soft leading-relaxed pl-8">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <p className="font-body text-charcoal-soft mb-4">Still have questions?</p>
            <a href="/contact" className="inline-block border-b border-spice-brown text-spice-brown pb-1 font-body uppercase tracking-widest text-sm hover:text-turmeric hover:border-turmeric transition-colors">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default FAQ;