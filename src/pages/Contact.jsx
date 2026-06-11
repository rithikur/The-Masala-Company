import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';

const Contact = () => {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-cream py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-turmeric font-semibold block mb-3">Get in Touch</span>
            <h1 className="text-4xl md:text-5xl font-display text-spice-brown mb-6">Contact Us</h1>
            <p className="font-body text-charcoal-soft max-w-lg mx-auto">
              Whether you have a question about an order, need culinary advice on our blends, or wish to inquire about wholesale, our team is here to help.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 text-center border border-spice-brown/10 shadow-sm flex flex-col items-center">
              <div className="w-12 h-12 bg-cream-dark rounded-full flex items-center justify-center text-spice-brown mb-4">
                <HiOutlineMail size={24} />
              </div>
              <h3 className="font-display text-lg text-spice-brown mb-2">Email</h3>
              <p className="font-body text-sm text-charcoal-soft">hello@themasalacompany.com</p>
              <p className="font-body text-xs text-charcoal-muted mt-2">We typically reply within 24 hours.</p>
            </div>

            <div className="bg-white p-8 text-center border border-spice-brown/10 shadow-sm flex flex-col items-center">
              <div className="w-12 h-12 bg-cream-dark rounded-full flex items-center justify-center text-spice-brown mb-4">
                <HiOutlinePhone size={24} />
              </div>
              <h3 className="font-display text-lg text-spice-brown mb-2">Phone</h3>
              <p className="font-body text-sm text-charcoal-soft">+91 98765 43210</p>
              <p className="font-body text-xs text-charcoal-muted mt-2">Mon-Fri, 9am - 6pm IST</p>
            </div>

            <div className="bg-white p-8 text-center border border-spice-brown/10 shadow-sm flex flex-col items-center">
              <div className="w-12 h-12 bg-cream-dark rounded-full flex items-center justify-center text-spice-brown mb-4">
                <HiOutlineLocationMarker size={24} />
              </div>
              <h3 className="font-display text-lg text-spice-brown mb-2">Headquarters</h3>
              <p className="font-body text-sm text-charcoal-soft">123 Spice Market Road<br/>Fort, Mumbai 400001<br/>India</p>
            </div>
          </div>

          <div className="bg-cream-dark p-8 md:p-12 border border-spice-brown/10">
            <h2 className="font-display text-2xl text-spice-brown mb-6 text-center">Send a Message</h2>
            <form className="space-y-6 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-soft mb-2">Name</label>
                  <input type="text" className="w-full border-b border-spice-brown/30 bg-transparent py-2 focus:outline-none focus:border-spice-brown transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-soft mb-2">Email</label>
                  <input type="email" className="w-full border-b border-spice-brown/30 bg-transparent py-2 focus:outline-none focus:border-spice-brown transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-charcoal-soft mb-2">Subject</label>
                <input type="text" className="w-full border-b border-spice-brown/30 bg-transparent py-2 focus:outline-none focus:border-spice-brown transition-colors" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-charcoal-soft mb-2">Message</label>
                <textarea rows="4" className="w-full border-b border-spice-brown/30 bg-transparent py-2 focus:outline-none focus:border-spice-brown transition-colors resize-none"></textarea>
              </div>
              <button type="submit" className="bg-spice-brown text-cream px-8 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-spice-dark transition-colors w-full md:w-auto">
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Contact;