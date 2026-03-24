import { createContext, useContext, useCallback, ReactNode } from "react";
import emailjs from "@emailjs/browser";

interface EmailJSConfig {
  publicKey: string;
  donateServiceId: string;
  donateTemplateId: string;
  contactServiceId: string;
  contactTemplateId: string;
}

interface EmailJSContextType {
  sendDonationEmail: (data: {
    name: string;
    email: string;
    amount: string;
    message: string;
  }) => Promise<{ success: boolean; error?: string }>;
  sendContactEmail: (data: {
    name: string;
    email: string;
    message: string;
  }) => Promise<{ success: boolean; error?: string }>;
  isConfigured: boolean;
}

const EmailJSContext = createContext<EmailJSContextType | null>(null);

const getConfig = (): EmailJSConfig | null => {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const donateServiceId = import.meta.env.VITE_EMAILJS_DONATE_SERVICE_ID;
  const donateTemplateId = import.meta.env.VITE_EMAILJS_DONATE_TEMPLATE_ID;
  const contactServiceId = import.meta.env.VITE_EMAILJS_CONTACT_SERVICE_ID;
  const contactTemplateId = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID;

  if (!publicKey || !donateServiceId || !donateTemplateId || !contactServiceId || !contactTemplateId) {
    return null;
  }

  return {
    publicKey,
    donateServiceId,
    donateTemplateId,
    contactServiceId,
    contactTemplateId,
  };
};

interface EmailJSProviderProps {
  children: ReactNode;
}

export const EmailJSProvider = ({ children }: EmailJSProviderProps) => {
  const config = getConfig();
  const isConfigured = config !== null;
  const CONTACT_EMAIL = "info@emerhana-foundation.org";

  const sendDonationEmail = useCallback(
    async (data: { name: string; email: string; amount: string; message: string }) => {
      if (!config) {
        console.log("[EmailJS] Donation email (mock):", data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { success: true };
      }

      try {
        const result = await emailjs.send(
          config.donateServiceId,
          config.donateTemplateId,
          {
            from_name: data.name,
            from_email: data.email,
            amount: data.amount,
            message: data.message || "No message provided",
            to_email: CONTACT_EMAIL,
          },
          config.publicKey
        );
        console.log("EmailJS donation success:", result);
        return { success: true };
      } catch (error: unknown) {
        const err = error as { status?: number; text?: string };
        console.error("EmailJS donation error:", err.status, err.text);
        return { success: false, error: err.text || "Failed to send donation email" };
      }
    },
    [config]
  );

  const sendContactEmail = useCallback(
    async (data: { name: string; email: string; message: string }) => {
      if (!config) {
        console.log("[EmailJS] Contact email (mock):", data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { success: true };
      }

      try {
        const result = await emailjs.send(
          config.contactServiceId,
          config.contactTemplateId,
          {
            from_name: data.name,
            from_email: data.email,
            message: data.message,
            to_email: CONTACT_EMAIL,
          },
          config.publicKey
        );
        console.log("EmailJS contact success:", result);
        return { success: true };
      } catch (error: unknown) {
        const err = error as { status?: number; text?: string };
        console.error("EmailJS contact error:", err.status, err.text);
        return { success: false, error: err.text || "Failed to send contact email" };
      }
    },
    [config]
  );

  return (
    <EmailJSContext.Provider
      value={{
        sendDonationEmail,
        sendContactEmail,
        isConfigured,
      }}
    >
      {children}
    </EmailJSContext.Provider>
  );
};

const defaultContext = {
  sendDonationEmail: async () => ({ success: false, error: "EmailJS not configured" }),
  sendContactEmail: async () => ({ success: false, error: "EmailJS not configured" }),
  isConfigured: false,
};

export const useEmailJS = () => {
  const context = useContext(EmailJSContext);
  return context || defaultContext;
};
