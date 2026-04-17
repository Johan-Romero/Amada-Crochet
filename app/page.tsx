"use client";

import Link from "next/link";
import ThreadScene from "@/components/ThreadScene";
import HeroVideoLoop from "@/components/HeroVideoLoop";
import TopNav from "@/components/TopNav";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { type ProductCategory, products } from "@/lib/products";

const HOME_COPY = {
  es: {
    heroKicker: "Hecho a mano con estilo y car\u00e1cter",
    heroTagline: "Crochet que transforma un look com\u00fan en algo memorable.",
    slideHint: "Desliza para descubrir",
    collections: "Colecciones",
    collectionsTitle: "Lo que ella ama crear",
    womenTitle: "Mujer",
    womenSubtitle: "Vestidos de ba\u00f1o y conjuntos hechos a mano",
    girlsTitle: "Ni\u00f1as y Beb\u00e9",
    girlsSubtitle: "Prendas suaves para ocasiones especiales",
    bagsTitle: "Bolsos",
    bagsSubtitle: "Accesorios tejidos con identidad propia",
    storyKicker: "Historia de la artesana",
    storyTitleA: "Ella es el alma de",
    storyTitleB: "Amada Crochet",
    storyLead1:
      "Detr\u00e1s de cada pieza est\u00e1 una mujer apasionada por el tejido, paciente con cada puntada y fiel a los detalles que hacen \u00fanica cada creaci\u00f3n.",
    storyLead2:
      "Su historia empieza en casa, entre hilos, ideas y amor por lo hecho a mano. Hoy convierte esa pasi\u00f3n en prendas y accesorios que cuentan una historia real.",
    process1Title: "Inspiraci\u00f3n",
    process1Copy: "Observa color, forma y textura antes de iniciar cada pieza.",
    process2Title: "Tejido manual",
    process2Copy: "Cada detalle se construye con calma, t\u00e9cnica y precisi\u00f3n.",
    process3Title: "Acabado fino",
    process3Copy: "Revisa, ajusta y entrega una prenda lista para durar.",
    promoKicker: "Oferta de temporada",
    promoTitle: "Hasta 50% OFF en piezas seleccionadas",
    promoBody: "Stock limitado en referencias elegidas.",
    promoAction: "Ver promociones",
    editorialKicker: "Selecci\u00f3n editorial",
    editorialTitle: "Una muestra breve de lo que tejemos",
    editorialBody: "Cuatro piezas bastan para insinuar el car\u00e1cter de la marca sin contarlo todo de una vez.",
    noteA: "Textura protagonista",
    noteB: "Color bien escogido",
    noteC: "Hecho a mano con detalle",
    seeCatalog: "Ver en cat\u00e1logo",
    customKicker: "Creamos contigo",
    customTitle: "Cuando una idea merece una pieza pensada con m\u00e1s calma",
    customLead:
      "Algunas clientas ya llegan con una imagen en mente; otras solo tienen una sensaci\u00f3n, un color o una ocasi\u00f3n especial. Aqu\u00ed es donde el tejido se vuelve conversaci\u00f3n y cada detalle empieza a tomar forma.",
    custom1Title: "Color que s\u00ed te representa",
    custom1Copy: "Partimos de una referencia, una temporada o una idea tuya para construir una paleta con car\u00e1cter.",
    custom2Title: "Talla y ajuste con intenci\u00f3n",
    custom2Copy: "Pensamos la pieza para que se vea bien puesta, no solo bonita en foto.",
    custom3Title: "Acabado listo para regalar o estrenar",
    custom3Copy:
      "Cada entrega cuida textura, ca\u00edda y detalle final para que se sienta especial desde el primer vistazo.",
    subscribe: "Suscribirme a novedades",
    visualMain: "Texturas que elevan lo cotidiano",
    visualSmall: "Detalle floral",
    visualNoteTitle: "Tu idea, nuestra puntada",
    visualNoteBody: "Color, silueta y acabado dialogan hasta que la pieza se sienta realmente tuya.",
    ctaTitle: "Lista para crear algo hermoso",
    ctaBody: "Explora nuestro cat\u00e1logo y encuentra la pieza perfecta.",
    ctaAction: "Ver cat\u00e1logo",
    footerBody: "Piezas artesanales con identidad, hechas a mano con t\u00e9cnica y amor.",
    footerStory: "Nuestra historia",
    footerCollections: "Colecciones",
    footerOffers: "Ofertas",
    footerCatalog: "Cat\u00e1logo",
    footerTerms: "T\u00e9rminos y condiciones",
    footerSupport: "Atenci\u00f3n personalizada",
    footerWhatsApp: "Escribir por WhatsApp",
    footerPayments: "M\u00e9todos de pago",
    footerRights: "(c) 2026 Amada Crochet. Todos los derechos reservados.",
    artisanAlt: "Artesana de Amada Crochet",
  },
  en: {
    heroKicker: "Handmade with style and character",
    heroTagline: "Crochet that turns a common look into something memorable.",
    slideHint: "Scroll to discover",
    collections: "Collections",
    collectionsTitle: "What she loves to create",
    womenTitle: "Women",
    womenSubtitle: "Handmade swimwear and matching sets",
    girlsTitle: "Girls and Baby",
    girlsSubtitle: "Soft pieces for special moments",
    bagsTitle: "Bags",
    bagsSubtitle: "Woven accessories with their own identity",
    storyKicker: "The artisan story",
    storyTitleA: "She is the soul of",
    storyTitleB: "Amada Crochet",
    storyLead1:
      "Behind every piece there is a woman passionate about weaving, patient with each stitch and faithful to the details that make every creation unique.",
    storyLead2:
      "Her story starts at home, among threads, ideas and love for handmade work. Today she turns that passion into garments and accessories with a real story.",
    process1Title: "Inspiration",
    process1Copy: "She studies color, shape and texture before each piece begins.",
    process2Title: "Hand weaving",
    process2Copy: "Every detail is built with calm, craft and precision.",
    process3Title: "Fine finishing",
    process3Copy: "Each piece is reviewed and adjusted to last beautifully.",
    promoKicker: "Seasonal offer",
    promoTitle: "Up to 50% OFF on selected pieces",
    promoBody: "Limited stock on selected references.",
    promoAction: "View promotions",
    editorialKicker: "Editorial selection",
    editorialTitle: "A short glimpse of what we weave",
    editorialBody: "Four pieces are enough to suggest the brand spirit without revealing everything at once.",
    noteA: "Texture takes the lead",
    noteB: "Color chosen with intent",
    noteC: "Handmade with detail",
    seeCatalog: "View in catalog",
    customKicker: "Made with you",
    customTitle: "When an idea deserves a piece crafted with care",
    customLead:
      "Some clients arrive with a clear visual idea; others only bring a feeling, a color or a special occasion. This is where weaving becomes conversation and every detail starts taking shape.",
    custom1Title: "Color that feels like you",
    custom1Copy: "We start from a reference, a season or your own idea to build a palette with personality.",
    custom2Title: "Size and fit with intention",
    custom2Copy: "Each piece is designed to look right when worn, not only in a photo.",
    custom3Title: "Ready-to-wear finish",
    custom3Copy: "Every delivery is polished in texture, drape and final detail from first glance.",
    subscribe: "Subscribe to updates",
    visualMain: "Textures that elevate everyday looks",
    visualSmall: "Floral detail",
    visualNoteTitle: "Your idea, our stitch",
    visualNoteBody: "Color, silhouette and finish evolve until the piece truly feels yours.",
    ctaTitle: "Ready to create something beautiful",
    ctaBody: "Explore our catalog and find your perfect piece.",
    ctaAction: "View catalog",
    footerBody: "Handmade pieces with identity, crafted with skill and care.",
    footerStory: "Our story",
    footerCollections: "Collections",
    footerOffers: "Offers",
    footerCatalog: "Catalog",
    footerTerms: "Terms and conditions",
    footerSupport: "Personal support",
    footerWhatsApp: "Chat on WhatsApp",
    footerPayments: "Payment methods",
    footerRights: "(c) 2026 Amada Crochet. All rights reserved.",
    artisanAlt: "Amada Crochet artisan",
  },
} as const;

function categoryLabel(category: ProductCategory, locale: "es" | "en") {
  const labels = {
    es: {
      mujer: "Mujer",
      nina: "Ni\u00f1a",
      bebe: "Beb\u00e9",
      hogar: "Hogar",
      bolsos: "Bolsos",
    },
    en: {
      mujer: "Women",
      nina: "Girls",
      bebe: "Baby",
      hogar: "Home",
      bolsos: "Bags",
    },
  } as const;

  return labels[locale][category];
}

const editorialSelection = ["vb-1", "vn-1", "dc-2", "mc-2"]
  .map((id) => products.find((product) => product.id === id))
  .filter((product): product is (typeof products)[number] => Boolean(product));

function StepIcon({ icon }: { icon: "palette" | "fit" | "gift" }) {
  if (icon === "palette") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.5c-4.97 0-9 3.57-9 7.97 0 2.9 2.14 5.03 5.09 5.03h1.23c.6 0 1.08.48 1.08 1.08 0 1.6 1.3 2.92 2.92 2.92 4.75 0 8.68-3.52 8.68-8.5 0-4.72-4.29-8.5-10-8.5Z" />
        <circle cx="7.4" cy="11" r="1.1" />
        <circle cx="10.2" cy="8.2" r="1.1" />
        <circle cx="14" cy="8.1" r="1.1" />
        <circle cx="16.5" cy="11" r="1.1" />
      </svg>
    );
  }

  if (icon === "fit") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3.5H3.5V7" />
        <path d="M17 3.5h3.5V7" />
        <path d="M7 20.5H3.5V17" />
        <path d="M17 20.5h3.5V17" />
        <path d="M8.5 8.5h7v7h-7z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4.5 6.5 7.2v4.3c0 4.1 2.74 7.9 5.5 8.99 2.76-1.09 5.5-4.89 5.5-8.99V7.2L12 4.5Z" />
      <path d="m9.4 12.2 1.7 1.7 3.5-3.7" />
    </svg>
  );
}

export default function HomePage() {
  const { locale } = useAppPreferences();
  const copy = HOME_COPY[locale];

  const collectionTeasers = [
    {
      key: "mujer",
      href: "/catalogo?cat=mujer",
      title: copy.womenTitle,
      subtitle: copy.womenSubtitle,
      image: "/img/blusa-rosada-sin-fondo.png",
    },
    {
      key: "nina",
      href: "/catalogo?cat=nina",
      title: copy.girlsTitle,
      subtitle: copy.girlsSubtitle,
      image: "/img/vestido-blanco-rojo-nina-sin-fondo.png",
    },
    {
      key: "bolsos",
      href: "/catalogo?cat=bolsos",
      title: copy.bagsTitle,
      subtitle: copy.bagsSubtitle,
      image: "/img/bolso-girasol-sin-fondo.png",
    },
  ] as const;

  const customMoments = [
    {
      icon: "palette" as const,
      title: copy.custom1Title,
      body: copy.custom1Copy,
    },
    {
      icon: "fit" as const,
      title: copy.custom2Title,
      body: copy.custom2Copy,
    },
    {
      icon: "gift" as const,
      title: copy.custom3Title,
      body: copy.custom3Copy,
    },
  ];

  return (
    <>
      <TopNav />
      <ThreadScene />

      <header id="hero" className="hero">
        <div className="hero-video-container">
          <HeroVideoLoop />
          <div className="hero-video-overlay" />
        </div>

        <div className="hero-content">
          <p className="hero-kicker">{copy.heroKicker}</p>
          <h1 className="hero-tagline">{copy.heroTagline}</h1>
        </div>

        <div className="hero-sphere-anchor">
          <div id="yarn-sphere" className="yarn-sphere" aria-label="Esfera de lana">
            <img id="yarn-overlay-img" src="/img/icono bola lana.svg" alt="" aria-hidden />
            <span id="thread-origin" />
          </div>
        </div>

        <div className="scroll-indicator">
          <span>{copy.slideHint}</span>
          <div className="scroll-chevrons" aria-hidden>
            <span />
            <span />
          </div>
        </div>
      </header>

      <main className="page-content">
        <section id="intro" className="section story-section mother-section">
          <img
            className="mother-flower-decor"
            src="/img/flor-lateral-derecha.svg"
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
          />
          <div className="container mother-layout">
            <figure id="mother-photo" className="mother-photo">
              <div className="mother-frame-shell">
                <div className="mother-frame-mask">
                  <img
                    className="mother-portrait"
                    src="/img/persona-amada.png"
                    alt={copy.artisanAlt}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <img
                  className="mother-frame-art"
                  src="/img/marco-foto-artesana.svg"
                  alt=""
                  aria-hidden
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </figure>

            <div id="mother-copy" className="mother-copy">
              <p className="story-kicker">{copy.storyKicker}</p>
              <h2>
                {copy.storyTitleA}
                <span className="mother-title-brand">{copy.storyTitleB}</span>
              </h2>
              <p className="story-lead">{copy.storyLead1}</p>
              <p className="story-lead">{copy.storyLead2}</p>

              <div id="story-process" className="story-process">
                <article>
                  <span>01</span>
                  <h3>{copy.process1Title}</h3>
                  <p>{copy.process1Copy}</p>
                </article>
                <article>
                  <span>02</span>
                  <h3>{copy.process2Title}</h3>
                  <p>{copy.process2Copy}</p>
                </article>
                <article>
                  <span>03</span>
                  <h3>{copy.process3Title}</h3>
                  <p>{copy.process3Copy}</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="categories" className="section collection-section compact-collection">
          <div className="container">
            <div id="collection-heading" className="section-headline">
              <p>{copy.collections}</p>
              <h2>{copy.collectionsTitle}</h2>
            </div>
            <div id="craft-grid" className="craft-grid">
              {collectionTeasers.map((item) => (
                <Link
                  key={item.key}
                  id={`craft-${item.key}`}
                  href={item.href}
                  className={`craft-item craft-item-${item.key}`}
                >
                  <div className="craft-figure">
                    <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section
          id="promo"
          className="section promo-band"
          style={{ backgroundImage: "url('/img/Mochila blanca y plateado.jpeg')" }}
        >
          <div className="promo-band-overlay" />
          <div id="promo-content" className="container promo-band-content">
            <p>{copy.promoKicker}</p>
            <h2>{copy.promoTitle}</h2>
            <span>{copy.promoBody}</span>
            <Link href="/catalogo" className="promo-link">
              {copy.promoAction}
            </Link>
          </div>
        </section>

        <section className="section-divider" aria-hidden>
          <span />
          <strong>{"\u2726"}</strong>
          <span />
        </section>

        <section id="editorial" className="section editorial-section">
          <div className="container editorial-shell">
            <div className="editorial-copy">
              <p id="editorial-heading" className="story-kicker">
                {copy.editorialKicker}
              </p>
              <h2>{copy.editorialTitle}</h2>
              <p id="editorial-lead" className="editorial-lead">
                {copy.editorialBody}
              </p>
              <div className="editorial-notes" aria-label="Criterios de seleccion">
                <span>{copy.noteA}</span>
                <span>{copy.noteB}</span>
                <span>{copy.noteC}</span>
              </div>
            </div>

            <div className="editorial-grid" aria-label="Piezas destacadas">
              {editorialSelection[0] ? (
                <Link
                  href={`/catalogo?cat=${editorialSelection[0].category}`}
                  className="editorial-card editorial-card-featured"
                >
                  <div className="editorial-card-media">
                    <img src={editorialSelection[0].image} alt={editorialSelection[0].name} loading="lazy" decoding="async" />
                  </div>
                  <div className="editorial-card-body">
                    <p>{categoryLabel(editorialSelection[0].category, locale)}</p>
                    <h3>{editorialSelection[0].name}</h3>
                    <span>{copy.seeCatalog}</span>
                  </div>
                </Link>
              ) : null}

              <div className="editorial-stack">
                {editorialSelection.slice(1).map((item) => (
                  <Link key={item.id} href={`/catalogo?cat=${item.category}`} className="editorial-card editorial-card-inline">
                    <div className="editorial-card-media">
                      <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
                    </div>
                    <div className="editorial-card-body">
                      <p>{categoryLabel(item.category, locale)}</p>
                      <h3>{item.name}</h3>
                      <span>{copy.seeCatalog}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="custom-order" className="section bespoke-section">
          <div className="container bespoke-layout">
            <div id="custom-card" className="bespoke-card">
              <p className="story-kicker">{copy.customKicker}</p>
              <h2>{copy.customTitle}</h2>
              <p className="bespoke-lead">{copy.customLead}</p>

              <div className="bespoke-steps">
                {customMoments.map((item) => (
                  <article key={item.title}>
                    <span className="bespoke-step-icon">
                      <StepIcon icon={item.icon} />
                    </span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="bespoke-actions">
                <a href="/?auth=open" className="bespoke-secondary">
                  {copy.subscribe}
                </a>
              </div>
            </div>

            <div id="custom-visual" className="bespoke-visual" aria-hidden>
              <div className="bespoke-visual-panel">
                <div className="bespoke-polaroid bespoke-polaroid-main">
                  <img src="/img/Mochila crema.jpeg" alt="" loading="lazy" decoding="async" />
                  <span>{copy.visualMain}</span>
                </div>

                <div className="bespoke-polaroid bespoke-polaroid-small">
                  <img src="/img/Blusa Blanca Flores amarillas.jpeg" alt="" loading="lazy" decoding="async" />
                  <span>{copy.visualSmall}</span>
                </div>

                <div className="bespoke-floating-note">
                  <strong>{copy.visualNoteTitle}</strong>
                  <p>{copy.visualNoteBody}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="cta" className="section section-cta">
          <div className="container cta-shell">
            <h2>{copy.ctaTitle}</h2>
            <p>{copy.ctaBody}</p>
            <Link id="cta-button" className="cta-button" href="/catalogo">
              {copy.ctaAction}
            </Link>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <h3>Amada Crochet</h3>
            <p>{copy.footerBody}</p>
            <div className="footer-social">
              <a href="https://wa.me/573000000000" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3.2a8.8 8.8 0 0 0-7.5 13.4L3.4 21l4.5-1.2A8.8 8.8 0 1 0 12 3.2Z" />
                  <path d="M8.5 9.3c.2-.5.3-.5.6-.5h.6c.2 0 .4 0 .5.3l.8 1.9c.1.2.1.4 0 .6l-.4.6c-.1.1-.2.2-.1.4.2.4.7 1.1 1.5 1.7.9.8 1.6 1.1 2 .9l.7-.4c.2-.1.4-.1.5.1l1.6.9c.2.1.3.3.2.5l-.2.8c-.1.2-.3.4-.4.5-.5.2-1.3.4-2.2.1-1-.3-2.3-.9-3.6-2.1-1.2-1.1-2.1-2.6-2.3-3.5-.2-.9 0-1.6.2-2Z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                  <circle cx="12" cy="12" r="3.8" />
                  <circle cx="17.2" cy="6.8" r="1.1" />
                </svg>
              </a>
              <a href="mailto:amada@crochet.com" aria-label="Correo">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3.2" y="5.5" width="17.6" height="13" rx="2" />
                  <path d="M4 7l8 6 8-6" />
                </svg>
              </a>
            </div>
          </div>

          <nav className="footer-links">
            <a href="#intro">{copy.footerStory}</a>
            <a href="#categories">{copy.footerCollections}</a>
            <a href="#promo">{copy.footerOffers}</a>
            <a href="/catalogo">{copy.footerCatalog}</a>
            <a href="/terminos">{copy.footerTerms}</a>
          </nav>

          <div className="footer-contact">
            <p>{copy.footerSupport}</p>
            <a className="footer-whatsapp" href="https://wa.me/573000000000" target="_blank" rel="noreferrer">
              {copy.footerWhatsApp}
            </a>

            <div className="footer-payments" aria-label={copy.footerPayments}>
              <span>VISA</span>
              <span>Mastercard</span>
              <span>PSE</span>
              <span>Nequi</span>
            </div>
          </div>
        </div>

        <div className="container footer-bottom">
          <small>{copy.footerRights}</small>
        </div>
      </footer>
    </>
  );
}
