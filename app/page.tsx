import Link from "next/link";
import ThreadScene from "@/components/ThreadScene";
import HeroVideoLoop from "@/components/HeroVideoLoop";
import TopNav from "@/components/TopNav";

const collectionTeasers = [
  {
    key: "mujer",
    href: "/catalogo?cat=mujer",
    title: "Mujer",
    subtitle: "Vestidos de bano y conjuntos hechos a mano",
    image: "/img/blusa-rosada-sin-fondo.png",
  },
  {
    key: "nina",
    href: "/catalogo?cat=nina",
    title: "Ninas y Bebe",
    subtitle: "Prendas suaves para ocasiones especiales",
    image: "/img/vestido-blanco-rojo-nina-sin-fondo.png",
  },
  {
    key: "bolsos",
    href: "/catalogo?cat=bolsos",
    title: "Bolsos",
    subtitle: "Accesorios tejidos con identidad propia",
    image: "/img/bolso-girasol-sin-fondo.png",
  },
];

export default function HomePage() {
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
          <p className="hero-tagline">Textura, color y detalle en piezas tejidas para quedarse contigo.</p>
        </div>

        <div className="hero-sphere-anchor">
          <div id="yarn-sphere" className="yarn-sphere" aria-label="Esfera de lana">
            <img id="yarn-overlay-img" src="/img/icono bola lana.svg" alt="" aria-hidden />
            <span id="thread-origin" />
          </div>
        </div>

        <div className="scroll-indicator">
          <span>Desliza para descubrir</span>
          <div className="scroll-chevrons" aria-hidden>
            <span />
            <span />
          </div>
        </div>
      </header>

      <main className="page-content">
        <section id="intro" className="section story-section mother-section">
          <img className="mother-flower-decor" src="/img/flor-lateral-derecha.svg" alt="" aria-hidden />
          <div className="container mother-layout">
            <figure id="mother-photo" className="mother-photo">
              <div className="mother-frame-shell">
                <div className="mother-frame-mask">
                  <img className="mother-portrait" src="/img/persona-amada.png" alt="Artesana de Amada Crochet" />
                </div>
                <img className="mother-frame-art" src="/img/marco-foto-artesana.svg" alt="" aria-hidden />
              </div>
            </figure>

            <div id="mother-copy" className="mother-copy">
              <p className="story-kicker">Historia de la artesana</p>
              <h2>
                Ella es el alma de
                <span className="mother-title-brand">Amada Crochet</span>
              </h2>
              <p className="story-lead">
                Detras de cada pieza esta una mujer apasionada por el tejido, paciente con cada puntada y fiel a los
                detalles que hacen unica cada creacion.
              </p>
              <p className="story-lead">
                Su historia empieza en casa, entre hilos, ideas y amor por lo hecho a mano. Hoy convierte esa pasion
                en prendas y accesorios que cuentan una historia real.
              </p>

              <div id="story-process" className="story-process">
                <article>
                  <span>01</span>
                  <h3>Inspiracion</h3>
                  <p>Observa color, forma y textura antes de iniciar cada pieza.</p>
                </article>
                <article>
                  <span>02</span>
                  <h3>Tejido Manual</h3>
                  <p>Cada detalle se construye con calma, tecnica y precision.</p>
                </article>
                <article>
                  <span>03</span>
                  <h3>Acabado Fino</h3>
                  <p>Revisa, ajusta y entrega una prenda lista para durar.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="categories" className="section collection-section compact-collection">
          <div className="container">
            <div id="collection-heading" className="section-headline">
              <p>Colecciones</p>
              <h2>Lo que ella ama crear</h2>
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
                    <img src={item.image} alt={item.title} />
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
            <p>Oferta de temporada</p>
            <h2>Hasta 50% OFF en piezas seleccionadas</h2>
            <span>Stock limitado en referencias elegidas.</span>
            <Link href="/catalogo" className="promo-link">
              Ver promociones
            </Link>
          </div>
        </section>

        <section className="section-divider" aria-hidden>
          <span />
          <strong>{"\u2726"}</strong>
          <span />
        </section>

        <section id="cta" className="section section-cta">
          <div className="container cta-shell">
            <h2>Lista para crear algo hermoso</h2>
            <p>Explora nuestro catalogo y encuentra la pieza perfecta.</p>
            <Link id="cta-button" className="cta-button" href="/catalogo">
              Ver Catalogo
            </Link>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <h3>Amada Crochet</h3>
            <p>Piezas artesanales con identidad, hechas a mano con tecnica y amor.</p>
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
            <a href="#intro">Nuestra historia</a>
            <a href="#categories">Colecciones</a>
            <a href="#promo">Ofertas</a>
            <a href="/catalogo">Catalogo</a>
            <a href="#">Terminos y condiciones</a>
          </nav>

          <div className="footer-contact">
            <p>Atencion personalizada</p>
            <a className="footer-whatsapp" href="https://wa.me/573000000000" target="_blank" rel="noreferrer">
              Escribir por WhatsApp
            </a>

            <div className="footer-payments" aria-label="Metodos de pago">
              <span>VISA</span>
              <span>Mastercard</span>
              <span>PSE</span>
              <span>Nequi</span>
            </div>
          </div>
        </div>

        <div className="container footer-bottom">
          <small>(c) 2026 Amada Crochet. Todos los derechos reservados.</small>
        </div>
      </footer>
    </>
  );
}
