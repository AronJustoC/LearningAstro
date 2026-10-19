// Datos de contacto oficiales: única fuente para Hero, Footer, Contacto y ContactForm.
export const CONTACT_EMAIL = "aronchoque727@gmail.com";
export const WHATSAPP_DISPLAY = "+51 983 731 782";

const WHATSAPP_NUMBER = "51983731782"; // formato wa.me: país + número, sin "+"

export const whatsappUrl = (
  text = "Hola Aron, quiero conversar sobre una solución de software para mi empresa.",
) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
