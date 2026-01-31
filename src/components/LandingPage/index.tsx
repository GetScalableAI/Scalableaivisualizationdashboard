import { SignIn } from '@clerk/clerk-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#F5F7FA] flex flex-col items-center justify-center px-4">
      {/* Logo & Branding */}
      <div className="flex flex-col items-center mb-8">
        <img
          src="https://244666554.fs1.hubspotusercontent-na2.net/hubfs/244666554/413ecf10-8ec2-4899-929d-ca6e5e564e24.png"
          alt="Scalable AI Logo"
          className="w-14 h-14 mb-4"
        />
        <h1 className="text-2xl font-semibold text-gray-900">Scalable AI</h1>
        <p className="text-sm text-gray-500 mt-1">Manufacturing Intelligence</p>
      </div>

      {/* Clerk Sign-In Component */}
      <SignIn
        appearance={{
          elements: {
            rootBox: {
              width: '100%',
              maxWidth: '440px',
            },
            cardBox: {
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              borderRadius: '0.75rem',
            },
          },
        }}
        routing="hash"
      />
    </div>
  );
}