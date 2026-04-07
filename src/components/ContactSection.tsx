import { useData } from "@/contexts/DataContext";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const { contactInfo } = useData();
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

    const phoneNumber = contactInfo?.phone.replace(/\D/g, "") || "917304999009"; // Venue's WhatsApp number
    const emailAddress = contactInfo?.email || "info@sukhrupgarden.com";

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

  const contactItems = [
    { icon: MapPin, label: "Address", value: contactInfo?.address || "In Front Of Bageti Ganapati Mandir, Haripur Sangli Road, Haripur, Sangli, Maharashtra 416415" },
    { icon: Phone, label: "Phone", value: contactInfo?.phone || "+91 7304999009\n+91 6262429009" },
    { icon: Mail, label: "Email", value: contactInfo?.email || "info@sukhrupgarden.com" },
    { icon: Clock, label: "Office Hours", value: contactInfo?.timing || "Mon - Sun: 9:00 AM - 9:00 PM" },
  ];

  return (
    <section id="contact" ref={sectionRef} className="section-padding bg-background relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient opacity-20" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="section-header text-center mb-10 md:mb-16">
          <p className="section-subtitle mb-3 text-base md:text-lg font-bold tracking-widest uppercase text-gold">Get In Touch</p>
          <h2 className="section-title mb-6 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
            <span className="text-gold-gradient">Contact Us</span>
          </h2>
          <div className="gold-divider mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="contact-left order-2 lg:order-1">
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-4 sm:mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-gold" />
              Quick Inquiry
            </h3>
            <p className="text-muted-foreground font-body text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-xl">
              Have a question or want to check availability? Reach out to us and our team
              will get back to you within 24 hours.
            </p>

            <div className="space-y-6 sm:space-y-8">
              {contactItems.map((item) => (
                <div key={item.label} className="flex gap-4 sm:gap-6 items-start group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors duration-300">
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                  </div>
                  <div>
                    <p className="font-body text-xs sm:text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2 font-semibold">
                      {item.label}
                    </p>
                    <div className="font-body text-sm sm:text-base text-foreground leading-relaxed">
                      {item.label === "Phone" ? (
                        <div className="space-y-2 flex flex-col items-start">
                          {item.value.split(/[/,\n|;&]|\s{2,}/).filter(n => n.trim().length > 5).map((n, i) => (
                            <a
                              key={i}
                              href={`tel:${n.replace(/\D/g, "")}`}
                              className="hover:text-gold transition-colors inline-block font-medium border-b border-transparent hover:border-gold pb-0.5"
                            >
                              {n.trim()}
                            </a>
                          ))}
                        </div>
                      ) : item.label === "Email" ? (
                        <a href={`mailto:${item.value}`} className="hover:text-gold transition-colors inline-block font-medium border-b border-transparent hover:border-gold pb-0.5">
                          {item.value}
                        </a>
                      ) : (
                        <p className="whitespace-pre-line leading-relaxed">{item.value}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="mt-10 sm:mt-12 h-60 sm:h-72 w-full bg-muted border border-border overflow-hidden rounded-2xl shadow-lg relative grayscale hover:grayscale-0 transition-all duration-500">
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

          <div className="contact-form order-1 lg:order-2 bg-card border border-gold/20 p-6 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-gold/5 blur-3xl rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-gold/5 blur-3xl rounded-full -ml-16 -mb-16" />

            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-8 sm:mb-10 relative z-10">
              Send a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Name</label>
                  <input
                    type="text"
                    placeholder="Enter Your Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClasses + " rounded-xl px-4 py-3 sm:py-4"}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="10-digit number"
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
                    className={inputClasses + " rounded-xl px-4 py-3 sm:py-4"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClasses + " rounded-xl px-4 py-3 sm:py-4"}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Event Type</label>
                  <select
                    value={formData.event}
                    onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                    className={inputClasses + " rounded-xl px-4 py-3 sm:py-4 appearance-none cursor-pointer"}
                  >
                    <option value="">Select Event Type</option>
                    <option value="wedding">Wedding</option>
                    <option value="reception">Reception</option>
                    <option value="engagement">Engagement</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="cultural">Cultural Program</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Event Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={inputClasses + " rounded-xl px-4 py-3 sm:py-4 cursor-pointer"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your event..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={inputClasses + " resize-none rounded-xl px-4 py-3 sm:py-4"}
                />
              </div>

              <button type="submit" className="btn-gold w-full flex items-center justify-center gap-3 py-4 sm:py-5 text-lg shadow-lg hover:shadow-gold/20 transform hover:-translate-y-1 transition-all duration-300">
                <Send className="w-5 h-5" />
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
