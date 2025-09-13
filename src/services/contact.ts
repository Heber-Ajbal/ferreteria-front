import emailjs from "@emailjs/browser";

const PUB  = 'mGvNIvjj6DZIaPVFD';
const SVC  = 'service_zsw3sv9';
const TPL  = 'template_g0j03xf';

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export async function sendContactEmail(p: ContactPayload) {
  if (!PUB || !SVC || !TPL) throw new Error("EmailJS no configurado");
  const params = {
    from_name: p.name,
    reply_to: p.email,
    phone: p.phone ?? "",
    subject: p.subject,
    message: p.message,
  };
  // EmailJS retorna { status: 200 } en éxito
  const res = await emailjs.send(SVC, TPL, params, { publicKey: PUB });
  return res;
}
