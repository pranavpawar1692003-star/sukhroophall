import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", event: "", date: "", message: "",
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".section-header > *", {
        scrollTrigger: { trigger: ".section-header", start: "top 95%" },
        opacity: 0, y: 30, duration: 0.8, stagger: 0.2, clearProps: "all"
      });
      gsap.from(".contact-left > *", {
        scrollTrigger: { trigger: ".contact-left", start: "top 95%" },
        opacity: 0, x: -30, duration: 0.6, stagger: 0.08, clearProps: "all"
      });
      gsap.from(".contact-form", {
        scrollTrigger: { trigger: ".contact-form", start: "top 95%" },
        opacity: 0, x: 30, duration: 0.8, clearProps: "all"
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Format the message for WhatsApp and Email
    const messageText = `*New Enquiry from Sukhrup Garden Website*%0A%0A` +
      `*Name:* ${formData.name}%0A` +
      `*Phone:* ${formData.phone}%0A` +
      `*Email:* ${formData.email || "Not provided"}%0A` +
      `*Event Type:* ${formData.event || "Not specified"}%0A` +
      `*Event Date:* ${formData.date || "Not set"}%0A` +
      `*Message:* ${formData.message || "No additional message"}`;

    const phoneNumber = "917304999009"; // Venue's WhatsApp number
    const emailAddress = "info@sukhrupgarden.com";

    // Primary action: Redirect to WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${messageText}`;

    // Backup: Email fall-through if they prefer
    const subject = `New Event Inquiry - ${formData.name}`;
    const body = messageText.replace(/%0A/g, "\n").replace(/\*/g, "");
    const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");

    alert("Inquiry prepared! Opening WhatsApp to send your details. You can also contact us via email at " + emailAddress);
    setFormData({ name: "", phone: "", email: "", event: "", date: "", message: "" });
  };

  const inputClasses = "w-full px-4 py-3 bg-background border border-border text-foreground font-body text-base focus:outline-none focus:border-gold transition-colors";

  return (
    <section id="contact" ref={sectionRef} className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="section-header text-center mb-16">
          <p className="section-subtitle mb-3 text-lg md:text-xl font-bold">Get In Touch</p>
          <h2 className="section-title mb-6 text-5xl md:text-6xl lg:text-7xl font-bold">
            <span className="text-gold-gradient">Contact Us</span>
          </h2>
          <div className="gold-divider" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="contact-left">
            <h3 className="font-display text-2xl font-semibold text-foreground mb-6">
              Quick Inquiry
            </h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed mb-8">
              Have a question or want to check availability? Reach out to us and our team
              will get back to you within 24 hours.
            </p>

            <div className="space-y-6">
              {[
                { icon: MapPin, label: "Address", value: "In Front Of Bageti Ganapati Mandir, Haripur Sangli Road, Haripur, Sangli, Maharashtra 416415" },
                { icon: Phone, label: "Phone", value: "+91 7304999009\n+91 6262429009" },
                { icon: Mail, label: "Email", value: "info@sukhrupgarden.com" },
                { icon: Clock, label: "Office Hours", value: "Mon - Sun: 9:00 AM - 9:00 PM" },
              ].map((item) => (
                <div key={item.label} className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1">
                      {item.label}
                    </p>
                    <p className="font-body text-sm text-foreground whitespace-pre-line">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="mt-8 h-52 bg-muted border border-border overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3818.555901974735!2d74.54247247492194!3d16.848373483949786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc10fb1df56b255%3A0xecdb1d9a30e35c73!2sSukhrup%20Garden%20%26%20Multipurpose%20Hall!5e0!3m2!1sen!2sin!4v1773654624996!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Sukhrup Garden & Multipurpose Hall Location"
              />
            </div>
          </div>

          <div className="contact-form bg-card border border-gold/10 p-8 shadow-[var(--shadow-elegant)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl rounded-full -mr-16 -mt-16" />

            <h3 className="font-display text-2xl font-semibold text-foreground mb-8 relative z-10">
              Send a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name *"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClasses}
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  minLength={10}
                  title="Please enter a valid 10-digit phone number"
                  inputMode="numeric"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setFormData({ ...formData, phone: value });
                  }}
                  className={inputClasses}
                />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClasses}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  value={formData.event}
                  onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                  className={inputClasses}
                >
                  <option value="">Select Event Type</option>
                  <option value="wedding">Wedding</option>
                  <option value="reception">Reception</option>
                  <option value="engagement">Engagement</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="cultural">Cultural Program</option>
                  <option value="other">Other</option>
                </select>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={inputClasses}
                />
              </div>
              <textarea
                rows={5}
                placeholder="Tell us about your event..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={inputClasses + " resize-none"}
              />
              <button type="submit" className="btn-gold w-full flex items-center justify-center gap-2 mt-2">
                <Send size={16} />
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
