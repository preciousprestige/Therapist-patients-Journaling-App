import React from 'react';

export default function Contact() {
  return (
    <section className="mt-16 text-center">
      <h3 className="text-3xl font-bold gradient-text mb-4">Get in Touch</h3>
      <p className="text-gray-300 mb-6">Let’s collaborate or discuss your journaling needs.</p>
      <a
        href="mailto:nootherprecious@gmail.com"
        className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold hover:scale-105 transition"
      >
        Contact Me
      </a>
      <p className="mt-4 text-sm text-gray-400">Thank you for visiting my wellness portfolio.</p>
    </section>
  );
}
