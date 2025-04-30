import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaPhone } from "react-icons/fa";

const ContactUs = () => {
  return (
    <section className="bg-lime-50 py-20 font-poppins" id="contact">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <h2 className="text-4xl font-bold text-center text-lime-800 mb-4">Contact Us</h2>
        <p className="text-center text-gray-600 mb-12">
          We'd love to hear from you! Reach out for inquiries, partnerships, or support.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6 text-gray-700 text-lg">
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-lime-600 text-xl" />
              <a href="mailto:agroconnect@gmail.com" className="hover:underline">
                agroconnect@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-4">
              <FaPhone className="text-lime-600 text-xl" />
              <a href="tel:+94771234567" className="hover:underline">
                +94 77 123 4567
              </a>
            </div>
            <div className="flex gap-6 text-2xl mt-6">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-blue-700 hover:text-blue-900">
                <FaFacebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-pink-600 hover:text-pink-800">
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-sky-500 hover:text-sky-700">
                <FaTwitter />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <form
            action="mailto:agroconnect@gmail.com"
            method="POST"
            encType="text/plain"
            className="bg-white shadow-md rounded-2xl p-8 space-y-6 border border-lime-200"
          >
            <input
              type="text"
              name="Name"
              placeholder="Your Name"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400"
              required
            />
            <input
              type="email"
              name="Email"
              placeholder="Your Email"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400"
              required
            />
            <textarea
              name="Message"
              placeholder="Your Message"
              rows="5"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-lime-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-lime-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;