"use client";

import TopNav from "@/components/TopNav";
import { useAppPreferences } from "@/components/AppPreferencesProvider";

const TERMS_COPY = {
  es: {
    kicker: "Informaci\u00f3n de compra",
    title: "T\u00e9rminos y condiciones",
    intro:
      "Esta p\u00e1gina deja visible una base clara para la tienda mientras se completa la versi\u00f3n final legal y comercial de Amada Crochet.",
    items: [
      "Cada pieza es artesanal y puede tener peque\u00f1as variaciones propias del trabajo hecho a mano.",
      "Los tiempos de entrega y disponibilidad se confirman antes de cerrar cada pedido.",
      "Los pedidos personalizados deben validarse por WhatsApp antes de iniciar producci\u00f3n.",
      "Si necesitas cambios o ajustes, el canal principal de atenci\u00f3n ser\u00e1 WhatsApp.",
    ],
    note:
      "Si vas a publicar la web, conviene reemplazar este contenido temporal por el texto legal definitivo del negocio.",
  },
  en: {
    kicker: "Purchase information",
    title: "Terms and conditions",
    intro:
      "This page shows a clear baseline while the final legal and commercial version for Amada Crochet is being completed.",
    items: [
      "Each piece is handmade and may include small natural variations.",
      "Delivery times and availability are confirmed before each order is closed.",
      "Custom orders must be validated via WhatsApp before production starts.",
      "If you need changes or adjustments, WhatsApp is the main support channel.",
    ],
    note:
      "Before publishing the website, replace this temporary content with the final legal terms of the business.",
  },
} as const;

export default function TermsPage() {
  const { locale } = useAppPreferences();
  const copy = TERMS_COPY[locale];

  return (
    <>
      <TopNav solid />
      <main className="terms-page">
        <section className="terms-card">
          <p className="terms-kicker">{copy.kicker}</p>
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>

          <div className="terms-list">
            {copy.items.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>

          <p className="terms-note">{copy.note}</p>
        </section>
      </main>
    </>
  );
}
