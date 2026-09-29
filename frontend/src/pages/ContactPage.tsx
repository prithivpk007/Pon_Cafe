import React, { useState } from 'react';
import { Phone, MapPin, Clock, Mail, Send, CheckCircle2, MessageSquare, ShieldCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Custom Cake Inquiry');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      toast.error('Please fill in your name, contact phone, and message.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      toast.success('Thank you! Your message has been sent to Administrator Rukmani.');
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-warm text-center max-w-4xl mx-auto space-y-3 relative overflow-hidden">
        <span className="text-xs uppercase font-bold tracking-widest text-amber-400 block">
          Get in Touch
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          Contact PON CAFE (Rukmani Bakery)
        </h1>
        <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          We’d love to hear from you! Reach out for celebration cake consultations, bulk snack orders, catering, or local store directions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Contact Cards & Opening Hours */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-soft space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Rukmani Bakery
              </h2>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mt-0.5">
                PON CAFE
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-lg text-xs font-bold text-stone-800 border border-amber-200">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Administrator: <strong>Rukmani</strong></span>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Phone & Direct Call */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-stone-500 font-bold block uppercase">Direct Phone</span>
                  <a
                    href="tel:6374123265"
                    className="text-stone-900 font-bold hover:text-amber-600 transition-colors text-base"
                  >
                    6374123265
                  </a>
                  <p className="text-[11px] text-stone-500 mt-0.5">Direct contact with Rukmani</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-stone-500 font-bold block uppercase">Store Address</span>
                  <p className="text-stone-800 font-semibold leading-snug">
                    Kangeayam Road, Chennimalai, Erode – 638051, Tamil Nadu
                  </p>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-stone-500 font-bold block uppercase">Baking & Service Hours</span>
                  <p className="text-stone-800 font-semibold">
                    Monday – Sunday: 7:00 AM – 10:00 PM
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium">Open All 7 Days (Fresh daily morning bakes)</p>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="pt-2">
              <a
                href="tel:6374123265"
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-warm transition-all flex items-center justify-center gap-2 text-center"
              >
                <Phone className="w-4 h-4" />
                <span>Call Bakery Now (6374123265)</span>
              </a>
            </div>
          </div>

          {/* Location Map Placeholder / Visualization */}
          <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-soft space-y-3">
            <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Bakery Location in Chennimalai</span>
            </h3>
            <div className="h-48 rounded-2xl bg-stone-100 border border-stone-200 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-glow mb-2 animate-bounce">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="font-serif font-bold text-sm text-stone-900">
                PON CAFE (Rukmani Bakery)
              </p>
              <p className="text-xs text-stone-500">
                Kangeayam Road, Chennimalai, Erode – 638051
              </p>
              <span className="mt-3 text-[11px] bg-white border border-stone-300 text-stone-700 px-3 py-1 rounded-full font-semibold">
                📍 Prominent Landmark on Kangeyam Main Road
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-amber-100 shadow-warm space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Send Us an Online Inquiry
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Have questions or need catering? Drop us a note and we will reply promptly.
              </p>
            </div>

            {isSent ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-8 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-serif text-xl font-bold text-emerald-900">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs text-emerald-800 max-w-sm mx-auto leading-relaxed">
                  Thank you for contacting PON CAFE. Administrator Rukmani has received your inquiry and will reach out to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSent(false)}
                  className="px-6 py-2.5 bg-emerald-700 text-white font-bold text-xs uppercase rounded-xl hover:bg-emerald-800 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anandhu"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="anandhu@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Subject
                    </label>
                    <select
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    >
                      <option value="Custom Cake Inquiry">Custom Cake Inquiry</option>
                      <option value="Bulk Snack / Party Order">Bulk Snack / Party Order</option>
                      <option value="Feedback / Compliment">Feedback / Compliment</option>
                      <option value="General Bakery Question">General Bakery Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Your Message / Requirements *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you'd like to order or ask..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-warm transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Inquiry to Rukmani</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
