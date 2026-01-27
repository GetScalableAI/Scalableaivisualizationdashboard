import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.tsx";
import "./styles/globals.css";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in environment variables");
}

const clerkAppearance = {
  layout: {
    socialButtonsPlacement: 'bottom' as const,
    socialButtonsVariant: 'iconButton' as const,
  },
  variables: {
    fontSize: '1.1rem',
    spacingUnit: '1.2rem',
    borderRadius: '0.75rem',
  },
  elements: {
    rootBox: {
      width: '100%',
    },
    card: {
      padding: '2.5rem',
      minWidth: '420px',
    },
    headerTitle: {
      fontSize: '1.75rem',
    },
    headerSubtitle: {
      fontSize: '1.1rem',
    },
    formButtonPrimary: {
      fontSize: '1.1rem',
      padding: '0.875rem 1.5rem',
    },
    formFieldInput: {
      fontSize: '1.1rem',
      padding: '0.875rem 1rem',
    },
    formFieldLabel: {
      fontSize: '1rem',
    },
    footerActionLink: {
      fontSize: '1rem',
    },
    identityPreview: {
      fontSize: '1rem',
    },
    socialButtonsBlockButton: {
      padding: '0.75rem 1rem',
    },
  },
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} appearance={clerkAppearance}>
      <App />
    </ClerkProvider>
  </StrictMode>
);
  