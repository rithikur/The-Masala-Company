import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';

const About = () => {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-cream py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-turmeric font-semibold block mb-3">Our Story</span>
            <h1 className="text-4xl md:text-5xl font-display text-spice-brown mb-6">The Masala Company</h1>
            <p className="font-accent italic text-lg text-charcoal-soft">Rooted in tradition, crafted for the modern kitchen.</p>
          </div>
          
          <div className="space-y-8 font-body text-charcoal-soft leading-relaxed">
            <p className="text-lg text-center max-w-2xl mx-auto">
              The Masala Company was born out of a profound reverence for the rich culinary heritage of India and a desire to bring the unadulterated essence of traditional spices to discerning chefs and home cooks.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
               <div className="bg-white p-8 border border-spice-brown/10 hover:border-spice-brown/30 transition-colors shadow-sm">
                 <h3 className="font-display text-2xl text-spice-brown mb-4">Our Heritage</h3>
                 <p>For generations, the secret to extraordinary Indian cuisine has been the careful selection and blending of whole spices. We honor this tradition by sourcing directly from heritage farms across the subcontinent, ensuring authenticity in every jar.</p>
               </div>
               <div className="bg-white p-8 border border-spice-brown/10 hover:border-spice-brown/30 transition-colors shadow-sm">
                 <h3 className="font-display text-2xl text-spice-brown mb-4">Our Promise</h3>
                 <p>No fillers, no artificial colors, and absolutely no preservatives. What you get is 100% pure, single-origin spices that have been ethically sourced and meticulously processed to retain their volatile oils and maximum flavor.</p>
               </div>
            </div>

            <div className="bg-cream-dark p-8 md:p-12 border-l-4 border-turmeric">
              <h2 className="font-display text-3xl text-spice-brown mb-6">Sustainable & Ethical Sourcing</h2>
              <ul className="space-y-6">
                <li>
                  <strong className="text-spice-brown block text-lg mb-1">Direct Trade</strong>
                  We eliminate middlemen, ensuring our partner farmers receive fair compensation for their labor and generational expertise.
                </li>
                <li>
                  <strong className="text-spice-brown block text-lg mb-1">Regenerative Agriculture</strong>
                  We partner exclusively with growers who employ sustainable farming methods that protect the soil and local ecosystems.
                </li>
                <li>
                  <strong className="text-spice-brown block text-lg mb-1">Small Batch Processing</strong>
                  Our spices are ground and blended in small batches just before shipping to guarantee unparalleled freshness and potency.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default About;