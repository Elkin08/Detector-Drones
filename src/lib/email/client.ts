import { Resend } from "resend";

// Cliente de Resend para envío de emails
export const resend = new Resend(process.env.RESEND_API_KEY);

// Email remitente (verificado en Resend)
export const EMAIL_FROM = process.env.EMAIL_FROM || "onboarding@resend.dev";
