import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Instagram,
  Twitter,
  Facebook,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Minimal */}
      <div className="bg-secondary py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-tighter">
          Contact Us
        </h1>
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
          We'd love to hear from you. Reach out for any inquiries.
        </p>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">
                Get In Touch
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                Have questions about our premium gear or your order? We're here
                to help you achieve your fitness goals.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-3 flex items-center justify-center shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-gray-900 font-bold uppercase tracking-wide text-sm">
                    Phone
                  </p>
                  <p className="text-gray-500 mt-1">+91 98765 43210</p>
                  <p className="text-xs text-gray-400 mt-1">Mon-Fri 9am-6pm</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-3 flex items-center justify-center shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-gray-900 font-bold uppercase tracking-wide text-sm">
                    Email
                  </p>
                  <p className="text-gray-500 mt-1">support@bgfit.in</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Online support 24/7
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-3 flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-gray-900 font-bold uppercase tracking-wide text-sm">
                    Headquarters
                  </p>
                  <p className="text-gray-500 mt-1">
                    123 Fitness Ave,
                    <br />
                    Mumbai, Maharashtra 400001
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-gray-900 font-bold uppercase tracking-wide text-sm mb-4">
                Follow Us
              </p>
              <div className="flex gap-4">
                {[Instagram, Twitter, Facebook].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:bg-secondary hover:text-white hover:border-secondary transition-all duration-300"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-8 lg:p-12 border border-gray-100">
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-8 uppercase">
              Send a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="sr-only">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 px-4 py-3 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="NAME"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="sr-only">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 px-4 py-3 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="EMAIL"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="sr-only">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 px-4 py-3 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                  placeholder="MESSAGE"
                  required
                />
              </div>

              {submitted ? (
                <div className="bg-green-50 text-green-700 p-4 border border-green-200 text-center font-medium">
                  Message sent successfully! We'll get back to you soon.
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-4 font-display font-bold uppercase tracking-wider hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
