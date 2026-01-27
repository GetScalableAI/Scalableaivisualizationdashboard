import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative w-full flex-1 overflow-hidden bg-gradient-to-br from-[#F5F7FA] via-white to-[#EBF0F5] flex flex-col justify-center items-center py-8">
      {/* Decorative blur elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2E5C8A]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#3B6FA0]/10 rounded-full blur-3xl" />

      <div className="relative w-full px-8 flex flex-col items-center">
        <div className="flex flex-col items-center w-full">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-bold text-gray-900 text-center"
            style={{ fontSize: '4rem', lineHeight: 1.1 }}
          >
            Transform Your Manufacturing With{' '}
            <span className="text-[#2E5C8A]">Intelligent Insights</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-gray-600 text-center"
            style={{ fontSize: '1.5rem', maxWidth: '900px' }}
          >
            Automate invoice processing, streamline PO management, and gain real-time visibility
            into your manufacturing operations with our AI-powered analytics platform.
          </motion.p>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 w-full flex justify-center"
        >
          <div className="relative w-full" style={{ maxWidth: '1200px' }}>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#2E5C8A]/20 to-[#3B6FA0]/20 rounded-2xl blur-2xl transform scale-95" />

            {/* Dashboard mockup */}
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white rounded-lg px-4 py-1.5 text-sm text-gray-400 border border-gray-200">
                    app.scalableai.com/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard content preview */}
              <div className="p-8 bg-[#F5F7FA]">
                <div className="grid grid-cols-4 gap-6 mb-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="h-4 bg-gray-200 rounded mb-3" style={{ width: '60%' }} />
                      <div className="h-8 bg-gradient-to-r from-[#2E5C8A]/20 to-[#3B6FA0]/20 rounded" style={{ width: '80%' }} />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm" style={{ height: '280px' }}>
                    <div className="h-4 bg-gray-200 rounded mb-6" style={{ width: '30%' }} />
                    <div className="flex items-end gap-3" style={{ height: '200px' }}>
                      {[40, 60, 45, 80, 55, 70, 90, 65, 75, 50].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-[#2E5C8A] to-[#3B6FA0] rounded-t"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm" style={{ height: '280px' }}>
                    <div className="h-4 bg-gray-200 rounded mb-6" style={{ width: '50%' }} />
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-[#2E5C8A]" />
                          <div className="flex-1 h-3 bg-gray-100 rounded">
                            <div
                              className="h-full bg-gradient-to-r from-[#2E5C8A] to-[#3B6FA0] rounded"
                              style={{ width: `${[75, 60, 85, 45, 70][i]}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
