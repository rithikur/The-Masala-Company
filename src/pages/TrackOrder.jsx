import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { Link } from 'react-router-dom';
import { HiOutlineTruck } from 'react-icons/hi';

const TrackOrder = () => {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-cream py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 shadow-sm border border-spice-brown/10 text-center">
          <div className="w-16 h-16 bg-cream-dark rounded-full flex items-center justify-center text-spice-brown mx-auto mb-6">
            <HiOutlineTruck size={32} />
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-turmeric font-semibold block mb-3">Logistics</span>
          <h1 className="text-4xl font-display text-spice-brown mb-6">Track Your Order</h1>
          
          <p className="font-body text-charcoal-soft mb-8">
            Once your package is dispatched from our facility, you will receive an email containing a tracking link from our delivery partners. 
          </p>

          <div className="bg-cream-dark p-6 border border-spice-brown/10 mb-8 text-left">
            <h3 className="font-display text-lg text-spice-brown mb-4">Registered Customers</h3>
            <p className="font-body text-sm text-charcoal-soft mb-4">
              If you placed your order while logged into your account, you can view real-time tracking updates directly in your order history portfolio.
            </p>
            <Link to="/profile" className="inline-block bg-spice-brown text-cream px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-spice-dark transition-colors">
              Go to My Account
            </Link>
          </div>

          <div className="bg-cream-dark p-6 border border-spice-brown/10 text-left">
            <h3 className="font-display text-lg text-spice-brown mb-4">Guest Tracking</h3>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                placeholder="Enter Order ID (e.g. TMC-12345)" 
                className="flex-1 border border-spice-brown/20 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-spice-brown"
              />
              <button className="bg-spice-brown text-cream px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-spice-dark transition-colors whitespace-nowrap">
                Track
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default TrackOrder;