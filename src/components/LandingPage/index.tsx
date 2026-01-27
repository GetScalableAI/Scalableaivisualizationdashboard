import { SignInButton } from '@clerk/clerk-react';
import HeroSection from './HeroSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#F5F7FA] flex flex-col">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="w-full px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="https://244666554.fs1.hubspotusercontent-na2.net/hubfs/244666554/413ecf10-8ec2-4899-929d-ca6e5e564e24.png"
                alt="Scalable AI Logo"
                className="w-10 h-10"
              />
              <div>
                <span className="text-xl font-semibold text-gray-900">Scalable AI</span>
                <div className="text-xs text-gray-500">Manufacturing Intelligence</div>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="px-4 py-2 bg-gradient-to-r from-[#2E5C8A] to-[#3B6FA0] text-white rounded-lg font-medium text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Get Started
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content (with top padding for fixed nav) */}
      <main className="pt-16 w-full flex-1 flex flex-col">
        <HeroSection />
      </main>
    </div>
  );
}
