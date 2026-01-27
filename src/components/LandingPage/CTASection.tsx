import { motion } from 'framer-motion';
import { SignInButton } from '@clerk/clerk-react';
import { Check, ArrowRight } from 'lucide-react';

const benefits = [
  'No credit card required',
  '14-day free trial',
  'Cancel anytime',
  'Full feature access'
];

const footerLinks = {
  Product: ['Features', 'Integrations', 'Pricing', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Resources: ['Documentation', 'API Reference', 'Support', 'Status'],
  Legal: ['Privacy', 'Terms', 'Security', 'Compliance']
};

export default function CTASection() {
  return (
    <>
      {/* CTA Section */}
      <section className="w-full py-20 lg:py-32 bg-gradient-to-br from-[#2E5C8A] to-[#3B6FA0] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            Ready to Transform Your Manufacturing Operations?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto"
          >
            Join hundreds of manufacturers already using Scalable AI to streamline their operations and boost productivity.
          </motion.p>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-10"
          >
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-white/90">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <SignInButton mode="modal">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#2E5C8A] rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all group">
                Get Started Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </SignInButton>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Logo and description */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://244666554.fs1.hubspotusercontent-na2.net/hubfs/244666554/413ecf10-8ec2-4899-929d-ca6e5e564e24.png"
                  alt="Scalable AI Logo"
                  className="w-10 h-10"
                />
                <span className="text-xl font-semibold text-white">Scalable AI</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered manufacturing analytics for modern enterprises.
              </p>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-white font-semibold mb-4">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Scalable AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
