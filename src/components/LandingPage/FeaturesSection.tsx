import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  GitCompare,
  ClipboardList,
  Database
} from 'lucide-react';

const features = [
  {
    icon: LayoutDashboard,
    title: 'Daily Snapshot Dashboard',
    description: 'Get real-time visibility into your manufacturing KPIs, production metrics, and operational performance at a glance.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: FileText,
    title: 'Invoice Automation',
    description: 'Automate invoice processing with AI-powered data extraction, validation, and approval workflows.',
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    icon: MessageSquare,
    title: 'AI Chatbot Assistant',
    description: 'Ask questions about your data in natural language and get instant insights powered by advanced AI.',
    color: 'from-violet-500 to-violet-600'
  },
  {
    icon: GitCompare,
    title: '3-Way Matching',
    description: 'Automatically match purchase orders, receipts, and invoices to prevent discrepancies and fraud.',
    color: 'from-amber-500 to-amber-600'
  },
  {
    icon: ClipboardList,
    title: 'PO Processing',
    description: 'Streamline purchase order creation, approval, and tracking with intelligent automation.',
    color: 'from-rose-500 to-rose-600'
  },
  {
    icon: Database,
    title: 'ERP Integration',
    description: 'Seamlessly connect with your existing ERP systems for unified data flow and real-time synchronization.',
    color: 'from-cyan-500 to-cyan-600'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function FeaturesSection() {
  return (
    <section className="w-full py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-[#2E5C8A] uppercase tracking-wider mb-4"
          >
            Platform Features
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Everything You Need to Optimize Operations
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Six powerful modules designed to transform your manufacturing workflows and drive efficiency across your organization.
          </motion.p>
        </div>

        {/* Feature cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2E5C8A] to-[#3B6FA0] rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
