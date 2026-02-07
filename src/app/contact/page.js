"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    userType: "",
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ userType: "", name: "", email: "", message: "" });
        setTimeout(() => setStatus(""), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus(""), 5000);
      }
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-black" />,
      title: "Email",
      value: "hr.unwrite@gmail.com",
      href: "mailto:hr.unwrite@gmail.com",
      color: "bg-white", // Changed from gradient to solid white
    },
    {
      icon: <Phone className="w-6 h-6 text-black" />,
      title: "Phone",
      value: "+91 6205698145",
      href: "tel:+916205698145",
      color: "bg-neutral-400", // Changed from blue to neutral
    },
    {
      icon: <MapPin className="w-6 h-6 text-black" />,
      title: "Location",
      value: "Bengaluru, India",
      color: "bg-neutral-600", // Changed from orange to neutral
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Background Elements - Subtle Gray Glows */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-40 left-20 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-neutral-500/10 rounded-full blur-[120px]" />
      </div>

      <section className="relative pt-32 pb-20">
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          
          {/* Section Header */}
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-20"
          >
            <div className="inline-block px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-8">
              <span className="text-white text-sm font-medium uppercase tracking-wider">
                Get In Touch
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight max-w-4xl mx-auto">
              Bring your ideas to life —{" "}
              <span className="text-neutral-500">
                we are just one message away
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light">
              Ready to unwrite your digital story? Drop us a message and let's get started.
            </p>
          </motion.div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition duration-300">
                  <div className={`inline-flex p-3 rounded-xl ${info.color} mb-4`}>
                    {info.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{info.title}</h3>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-gray-400">{info.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <div className="p-8 md:p-12 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* User Type Select */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    I am a...
                  </label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white/50 transition duration-300"
                  >
                    <option value="" className="bg-black">Select an option</option>
                    <option value="Business Owner" className="bg-black">Business Owner</option>
                    <option value="Startup Founder" className="bg-black">Startup Founder</option>
                    <option value="Agency" className="bg-black">Agency</option>
                    <option value="Individual" className="bg-black">Individual</option>
                  </select>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-white focus:outline-none focus:ring-1 focus:ring-white/50 transition duration-300"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-white focus:outline-none focus:ring-1 focus:ring-white/50 transition duration-300"
                  />
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Tell us about your project..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-white focus:outline-none focus:ring-1 focus:ring-white/50 transition duration-300 resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.99 }}
                  className="group relative w-full px-8 py-4 rounded-full bg-white text-black text-lg font-bold
                           hover:bg-neutral-200 transition-all duration-300 disabled:opacity-50 
                           flex items-center justify-center gap-2 overflow-hidden"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                {/* Status Messages */}
                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 rounded-xl bg-white/10 text-white border border-white/20 flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-sm">Delivered successfully.</span>
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 rounded-xl bg-red-900/20 text-red-400 border border-red-500/20 flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium text-sm">Failed to send. Please try again.</span>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}