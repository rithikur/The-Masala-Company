import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { HiOutlineOfficeBuilding, HiOutlineCube, HiOutlineUserGroup } from 'react-icons/hi';

const BulkOrders = () => {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-cream py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-turmeric font-semibold block mb-3">B2B & Wholesale</span>
            <h1 className="text-4xl md:text-5xl font-display text-spice-brown mb-6">Bulk Sourcing</h1>
            <p className="font-body text-charcoal-soft max-w-2xl mx-auto leading-relaxed">
              Elevate your culinary creations. We supply premium, single-origin spices and bespoke blends to distinguished restaurants, specialty retailers, and food manufacturers worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 border border-spice-brown/10 shadow-sm text-center md:text-left flex flex-col items-center md:items-start">
              <HiOutlineOfficeBuilding size={32} className="text-turmeric mb-4" />
              <h3 className="font-display text-xl text-spice-brown mb-3">Restaurants</h3>
              <p className="font-body text-sm text-charcoal-soft">Consistent, highly aromatic profiles that form the backbone of your signature dishes. Available in bulk foodservice packaging.</p>
            </div>
            <div className="bg-white p-8 border border-spice-brown/10 shadow-sm text-center md:text-left flex flex-col items-center md:items-start">
              <HiOutlineCube size={32} className="text-turmeric mb-4" />
              <h3 className="font-display text-xl text-spice-brown mb-3">Retailers</h3>
              <p className="font-body text-sm text-charcoal-soft">Premium retail-ready glass jars and gift sets for specialty grocers, lifestyle boutiques, and gourmet delis.</p>
            </div>
            <div className="bg-white p-8 border border-spice-brown/10 shadow-sm text-center md:text-left flex flex-col items-center md:items-start">
              <HiOutlineUserGroup size={32} className="text-turmeric mb-4" />
              <h3 className="font-display text-xl text-spice-brown mb-3">Custom Blending</h3>
              <p className="font-body text-sm text-charcoal-soft">Collaborate with our master blenders to develop exclusive, proprietary masalas tailored to your exact specifications.</p>
            </div>
          </div>

          <div className="bg-spice-brown text-cream p-8 md:p-16 text-center shadow-lg">
            <h2 className="font-display text-3xl mb-4">Request a Wholesale Catalog</h2>
            <p className="font-body text-cream/80 max-w-lg mx-auto mb-8">
              Please include your business name, nature of business, and estimated volume requirements in your inquiry.
            </p>
            <a 
              href="mailto:wholesale@themasalacompany.com" 
              className="inline-block bg-turmeric text-spice-brown px-8 py-4 font-body text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors"
            >
              Email Our Wholesale Team
            </a>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default BulkOrders;