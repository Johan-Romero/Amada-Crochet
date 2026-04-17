"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import type { Product, ProductCategory } from "@/lib/products";
import { useAppPreferences } from "@/components/AppPreferencesProvider";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
};

type Locale = "es" | "en";

const CATALOG_COPY = {
  es: {
    backHome: "Ir al inicio",
    title: "Nuestro cat\u00e1logo",
    subtitle: "Piezas \u00fanicas tejidas con amor.",
    all: "Todos",
    women: "Mujer",
    girls: "Ni\u00f1a",
    baby: "Beb\u00e9",
    home: "Hogar",
    bags: "Bolsos",
    favorites: "Favoritos",
    emptyTitle: "No hay piezas para este filtro.",
    emptyFavs: "Guarda tus productos favoritos y vuelve a encontrarlos aqu\u00ed.",
    emptyFilters: "Prueba otra categor\u00eda o vuelve a todos los productos.",
    favAdd: "Agregar a favoritos",
    favRemove: "Quitar de favoritos",
    details: "Ver detalles",
    detailsAria: "Ver m\u00e1s detalles de",
    closeDetails: "Cerrar detalles",
    prevView: "Vista anterior",
    nextView: "Vista siguiente",
    imageSelector: "Selector de imagen",
    viewImage: "Ver imagen",
    stockAvailable: "Stock disponible:",
    size: "Talla",
    oneSize: "Talla \u00fanica",
    measures: "Medidas aproximadas",
    added: "Agregado +1",
    addToCart: "A\u00f1adir al carrito",
    continueViewing: "Seguir viendo",
    openCart: "Abrir carrito",
    yourCart: "Tu carrito",
    closeCart: "Cerrar carrito",
    emptyCart: "Tu carrito est\u00e1 vac\u00edo.",
    sizeLabel: "Talla",
    subtotal: "Subtotal",
    orderWhatsApp: "Pedir por WhatsApp",
    payOnline: "Pagar online (pr\u00f3ximamente)",
    footerBody: "Piezas artesanales, atenci\u00f3n personalizada y acabados premium.",
    footerHome: "Inicio",
    footerCollections: "Colecciones",
    footerStory: "Historia",
    footerCatalog: "Cat\u00e1logo",
    footerSupport: "Atenci\u00f3n personalizada",
    whatsapp: "WhatsApp",
  },
  en: {
    backHome: "Back to home",
    title: "Our catalog",
    subtitle: "Unique handmade pieces made with care.",
    all: "All",
    women: "Women",
    girls: "Girls",
    baby: "Baby",
    home: "Home",
    bags: "Bags",
    favorites: "Favorites",
    emptyTitle: "No pieces available for this filter.",
    emptyFavs: "Save your favorite products and find them here again.",
    emptyFilters: "Try another category or return to all products.",
    favAdd: "Add to favorites",
    favRemove: "Remove from favorites",
    details: "View details",
    detailsAria: "View more details for",
    closeDetails: "Close details",
    prevView: "Previous view",
    nextView: "Next view",
    imageSelector: "Image selector",
    viewImage: "View image",
    stockAvailable: "Stock available:",
    size: "Size",
    oneSize: "One size",
    measures: "Approximate measurements",
    added: "Added +1",
    addToCart: "Add to cart",
    continueViewing: "Continue browsing",
    openCart: "Open cart",
    yourCart: "Your cart",
    closeCart: "Close cart",
    emptyCart: "Your cart is empty.",
    sizeLabel: "Size",
    subtotal: "Subtotal",
    orderWhatsApp: "Order on WhatsApp",
    payOnline: "Pay online (coming soon)",
    footerBody: "Handmade pieces, personal support and premium finishes.",
    footerHome: "Home",
    footerCollections: "Collections",
    footerStory: "Story",
    footerCatalog: "Catalog",
    footerSupport: "Personal support",
    whatsapp: "WhatsApp",
  },
} as const;

function parseCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        item &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        typeof item.image === "string" &&
        typeof item.quantity === "number"
    );
  } catch {
    return [];
  }
}

function parseFavs(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function filterOptions(locale: Locale) {
  const copy = CATALOG_COPY[locale];
  return [
    { value: "all" as const, label: copy.all },
    { value: "mujer" as const, label: copy.women },
    { value: "nina" as const, label: copy.girls },
    { value: "bebe" as const, label: copy.baby },
    { value: "hogar" as const, label: copy.home },
    { value: "bolsos" as const, label: copy.bags },
  ];
}

function categoryLabel(category: ProductCategory, locale: Locale) {
  const map = {
    es: { mujer: "Mujer", nina: "Ni\u00f1a", bebe: "Beb\u00e9", hogar: "Hogar", bolsos: "Bolsos" },
    en: { mujer: "Women", nina: "Girls", bebe: "Baby", hogar: "Home", bolsos: "Bags" },
  } as const;
  return map[locale][category];
}

function normalizeFilter(value?: string): "all" | ProductCategory {
  if (value === "mujer" || value === "nina" || value === "bebe" || value === "hogar" || value === "bolsos") {
    return value;
  }
  return "all";
}

function formatCOP(value: number, locale: Locale) {
  const localeId = locale === "es" ? "es-CO" : "en-US";
  return new Intl.NumberFormat(localeId, {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

function galleryFor(product: Product) {
  return Array.from(new Set([product.image, product.hoverImage].filter(Boolean) as string[]));
}

function stockFor(product: Product, size?: string) {
  if (!product.sizes.length) return 3;
  const sizeIndex = Math.max(product.sizes.indexOf(size || product.sizes[0]), 0);
  const stockMap = [5, 3, 7, 2, 4];
  return stockMap[sizeIndex % stockMap.length];
}

function measuresFor(product: Product, size: string | undefined, locale: Locale) {
  const selected = size || product.sizes[0] || (locale === "es" ? "Unica" : "One size");

  if (product.category === "mujer") {
    if (locale === "es") {
      return [`Busto aprox: ${selected === "S" ? "84-88 cm" : selected === "M" ? "89-94 cm" : "95-102 cm"}`, "Largo aprox: 82 cm"];
    }
    return [`Approx. bust: ${selected === "S" ? "84-88 cm" : selected === "M" ? "89-94 cm" : "95-102 cm"}`, "Approx. length: 82 cm"];
  }
  if (product.category === "nina") {
    if (locale === "es") {
      return [`Contorno aprox: ${selected === "2-4" ? "56-60 cm" : selected === "6-8" ? "61-68 cm" : "69-76 cm"}`, "Largo aprox: 58 cm"];
    }
    return [`Approx. chest: ${selected === "2-4" ? "56-60 cm" : selected === "6-8" ? "61-68 cm" : "69-76 cm"}`, "Approx. length: 58 cm"];
  }
  if (product.category === "bebe") {
    if (locale === "es") {
      return [`Contorno aprox: ${selected === "0-3m" ? "42-46 cm" : selected === "3-6m" ? "46-50 cm" : "50-56 cm"}`, "Largo aprox: 34 cm"];
    }
    return [`Approx. chest: ${selected === "0-3m" ? "42-46 cm" : selected === "3-6m" ? "46-50 cm" : "50-56 cm"}`, "Approx. length: 34 cm"];
  }
  if (product.category === "bolsos") {
    return locale === "es"
      ? ["Ancho aprox: 28 cm", "Alto aprox: 30 cm", "Base aprox: 10 cm"]
      : ["Approx. width: 28 cm", "Approx. height: 30 cm", "Approx. base: 10 cm"];
  }
  return locale === "es"
    ? ["Diametro aprox: 18 cm", "Altura aprox: 20 cm"]
    : ["Approx. diameter: 18 cm", "Approx. height: 20 cm"];
}

export default function CatalogClient({
  products,
  initialFilter,
  initialFavoritesOnly = false,
}: {
  products: Product[];
  initialFilter?: string;
  initialFavoritesOnly?: boolean;
}) {
  const { locale } = useAppPreferences();
  const copy = CATALOG_COPY[locale];
  const filters = filterOptions(locale);

  const [filter, setFilter] = useState<"all" | ProductCategory>(normalizeFilter(initialFilter));
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(initialFavoritesOnly);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [detailIndex, setDetailIndex] = useState(0);
  const [detailSize, setDetailSize] = useState("");
  const [authPanelOpen, setAuthPanelOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const rawCart = localStorage.getItem("amada-next-cart");
    const rawFavs = localStorage.getItem("amada-next-favs");
    setCart(parseCart(rawCart));
    setFavorites(parseFavs(rawFavs));
  }, []);

  useEffect(() => {
    localStorage.setItem("amada-next-cart", JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("amada:cart-updated"));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("amada-next-favs", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const onOpenCart = () => setPanelOpen(true);
    const onShowFavorites = () => {
      setFilter("all");
      setFavoritesOnly(true);
    };

    window.addEventListener("amada:open-cart", onOpenCart as EventListener);
    window.addEventListener("amada:show-favorites", onShowFavorites as EventListener);

    return () => {
      window.removeEventListener("amada:open-cart", onOpenCart as EventListener);
      window.removeEventListener("amada:show-favorites", onShowFavorites as EventListener);
    };
  }, []);

  useEffect(() => {
    const onAuthOpen = () => setAuthPanelOpen(true);
    const onAuthClose = () => setAuthPanelOpen(false);

    window.addEventListener("amada:auth-open", onAuthOpen as EventListener);
    window.addEventListener("amada:auth-close", onAuthClose as EventListener);

    return () => {
      window.removeEventListener("amada:auth-open", onAuthOpen as EventListener);
      window.removeEventListener("amada:auth-close", onAuthClose as EventListener);
    };
  }, []);

  const filtered = useMemo(() => {
    const byCategory = filter === "all" ? products : products.filter((item) => item.category === filter);
    if (!favoritesOnly) return byCategory;
    return byCategory.filter((item) => favorites.includes(item.id));
  }, [favorites, favoritesOnly, filter, products]);

  const cartItemsCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + item.quantity * item.price, 0), [cart]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (detailProduct) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
  }, [detailProduct]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const openDetail = (product: Product) => {
    setDetailProduct(product);
    setDetailIndex(0);
    setDetailSize(product.sizes[0] || "");
  };

  const closeDetail = () => {
    setDetailProduct(null);
    setDetailIndex(0);
    setDetailSize("");
  };

  const addItem = (product: Product, forcedSize?: string) => {
    const selectedSize = forcedSize || product.sizes[0] || undefined;
    const cartKey = `${product.id}::${selectedSize ?? "na"}`;

    setCart((prev) => {
      const idx = prev.findIndex((item) => `${item.id}::${item.size ?? "na"}` === cartKey);
      if (idx === -1) {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: 1,
            size: selectedSize,
          },
        ];
      }
      const next = [...prev];
      next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
      return next;
    });

    setAddedId(product.id);
    window.setTimeout(() => setAddedId((current) => (current === product.id ? null : current)), 900);
  };

  const removeItem = (id: string, size?: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  const updateQty = (id: string, size: string | undefined, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== id || item.size !== size) return item;
          return { ...item, quantity: Math.max(0, item.quantity + delta) };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const sendWhatsApp = () => {
    if (!cart.length) return;
    const lines = [locale === "es" ? "Hola, quiero hacer este pedido de Amada Crochet:" : "Hi, I want to place this order from Amada Crochet:", ""];
    cart.forEach((item) => {
      const sizeText = item.size ? ` (${item.size})` : "";
      lines.push(`- ${item.name}${sizeText} x${item.quantity} - ${formatCOP(item.price * item.quantity, locale)}`);
    });
    lines.push("", `${copy.subtotal}: ${formatCOP(totalPrice, locale)}`);
    const message = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/573000000000?text=${message}`, "_blank", "noopener");
  };

  const detailGallery = detailProduct ? galleryFor(detailProduct) : [];
  const detailStock = detailProduct ? stockFor(detailProduct, detailSize) : 0;
  const detailMeasures = detailProduct ? measuresFor(detailProduct, detailSize, locale) : [];

  const goPrevDetail = () => {
    if (!detailGallery.length) return;
    setDetailIndex((current) => (current - 1 + detailGallery.length) % detailGallery.length);
  };

  const goNextDetail = () => {
    if (!detailGallery.length) return;
    setDetailIndex((current) => (current + 1) % detailGallery.length);
  };

  const onDetailTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const onDetailTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current == null || detailGallery.length < 2) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const deltaX = endX - touchStartX.current;
    if (Math.abs(deltaX) < 34) return;
    if (deltaX > 0) {
      goPrevDetail();
      return;
    }
    goNextDetail();
  };

  return (
    <div className="catalog-layout">
      <header className="catalog-header container">
        <Link href="/" className="back-link">
          {copy.backHome}
        </Link>
        <h1>{copy.title}</h1>
        <p>{copy.subtitle}</p>
      </header>

      <section className="catalog-filters container">
        {filters.map((option) => (
          <button
            type="button"
            key={option.value}
            className={`filter-btn ${filter === option.value && !favoritesOnly ? "active" : ""}`}
            onClick={() => {
              setFilter(option.value);
              setFavoritesOnly(false);
            }}
          >
            {option.label}
          </button>
        ))}
        <button
          type="button"
          className={`filter-btn ${favoritesOnly ? "active" : ""}`}
          onClick={() => {
            setFilter("all");
            setFavoritesOnly((current) => !current);
          }}
          aria-pressed={favoritesOnly}
        >
          {copy.favorites}
        </button>
      </section>

      <section className="container products-grid">
        {!filtered.length ? (
          <article className="products-empty">
            <h2>{copy.emptyTitle}</h2>
            <p>{favoritesOnly ? copy.emptyFavs : copy.emptyFilters}</p>
          </article>
        ) : (
          filtered.map((item) => {
            const isFav = favorites.includes(item.id);

            return (
              <article className="product-card" key={item.id}>
                <div className="product-media">
                  <img src={item.image} alt={item.name} className="product-image main" loading="lazy" decoding="async" />
                  <img
                    src={item.hoverImage || item.image}
                    alt={item.name}
                    className="product-image hover"
                    loading="lazy"
                    decoding="async"
                  />

                  <button
                    type="button"
                    className={`fav-btn ${isFav ? "active" : ""}`}
                    onClick={() => toggleFavorite(item.id)}
                    aria-label={isFav ? copy.favRemove : copy.favAdd}
                  >
                    {isFav ? "\u2665" : "\u2661"}
                  </button>
                </div>

                <div className="product-body">
                  <span className="product-category">{categoryLabel(item.category, locale)}</span>
                  <h3>{item.name}</h3>
                  <div className="product-footer">
                    <strong className="product-price">{formatCOP(item.price, locale)}</strong>
                    <button
                      type="button"
                      className="detail-btn detail-btn-card"
                      onClick={() => openDetail(item)}
                      aria-label={`${copy.detailsAria} ${item.name}`}
                    >
                      {copy.details}
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>

      {detailProduct ? (
        <>
          <div className="product-modal-overlay open" onClick={closeDetail} />
          <aside className="product-modal" role="dialog" aria-modal="true" aria-label={`${copy.details}: ${detailProduct.name}`}>
            <button type="button" className="product-modal-close close-x-btn" onClick={closeDetail} aria-label={copy.closeDetails}>
              <span aria-hidden>{"\u00D7"}</span>
            </button>
            <div className="product-modal-media">
              <div className="product-modal-carousel" onTouchStart={onDetailTouchStart} onTouchEnd={onDetailTouchEnd}>
                {detailGallery.length > 1 ? (
                  <button type="button" className="product-carousel-nav prev" onClick={goPrevDetail} aria-label={copy.prevView}>
                    <span aria-hidden>{"\u2039"}</span>
                  </button>
                ) : null}
                <div className="product-modal-track" style={{ transform: `translateX(-${detailIndex * 100}%)` }}>
                  {detailGallery.map((image) => (
                    <img key={image} src={image} alt={detailProduct.name} />
                  ))}
                </div>
                {detailGallery.length > 1 ? (
                  <button type="button" className="product-carousel-nav next" onClick={goNextDetail} aria-label={copy.nextView}>
                    <span aria-hidden>{"\u203A"}</span>
                  </button>
                ) : null}
              </div>
              {detailGallery.length > 1 ? (
                <div className="product-modal-dots" aria-label={copy.imageSelector}>
                  {detailGallery.map((image, index) => (
                    <button
                      type="button"
                      key={image}
                      className={detailIndex === index ? "active" : ""}
                      onClick={() => setDetailIndex(index)}
                      aria-label={`${copy.viewImage} ${index + 1}`}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="product-modal-body">
              <p className="product-modal-category">{categoryLabel(detailProduct.category, locale)}</p>
              <h2>{detailProduct.name}</h2>
              <p className="product-modal-description">{detailProduct.description}</p>
              <strong className="product-modal-price">{formatCOP(detailProduct.price, locale)}</strong>
              <p className="product-modal-stock">
                {copy.stockAvailable} <b>{detailStock}</b>
              </p>

              {detailProduct.sizes.length ? (
                <div className="product-modal-sizes">
                  <span>{copy.size}</span>
                  <div>
                    {detailProduct.sizes.map((size) => (
                      <button
                        type="button"
                        key={size}
                        className={detailSize === size ? "active" : ""}
                        onClick={() => setDetailSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="product-modal-unique">{copy.oneSize}</p>
              )}

              <div className="product-modal-measures">
                <span>{copy.measures}</span>
                <ul>
                  {detailMeasures.map((measure) => (
                    <li key={measure}>{measure}</li>
                  ))}
                </ul>
              </div>

              <div className="product-modal-actions">
                <button
                  type="button"
                  className={`add-btn ${addedId === detailProduct.id ? "added" : ""}`}
                  onClick={() => addItem(detailProduct, detailSize || undefined)}
                >
                  {addedId === detailProduct.id ? copy.added : copy.addToCart}
                </button>
                <button type="button" className="detail-btn ghost" onClick={closeDetail}>
                  {copy.continueViewing}
                </button>
              </div>
            </div>
          </aside>
        </>
      ) : null}

      <button
        type="button"
        className={`mobile-cart-fab ${cartItemsCount > 0 ? "has-items" : ""} ${
          panelOpen || authPanelOpen || detailProduct ? "is-hidden" : ""
        }`}
        onClick={() => setPanelOpen(true)}
        aria-label={cartItemsCount > 0 ? `${copy.openCart} (${cartItemsCount})` : copy.openCart}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4.5 6.2h2.1l1.6 8.1h8.8l1.5-5.8H7.4" />
          <circle cx="10.2" cy="18.1" r="1.4" />
          <circle cx="16.5" cy="18.1" r="1.4" />
        </svg>
        {cartItemsCount > 0 ? <strong>{cartItemsCount > 99 ? "99+" : cartItemsCount}</strong> : null}
      </button>

      <div className={`cart-overlay ${panelOpen ? "open" : ""}`} onClick={() => setPanelOpen(false)} />
      <aside className={`cart-panel ${panelOpen ? "open" : ""}`}>
        <header>
          <h2>{copy.yourCart}</h2>
          <button type="button" className="cart-panel-close close-x-btn" onClick={() => setPanelOpen(false)} aria-label={copy.closeCart}>
            <span aria-hidden>{"\u00D7"}</span>
          </button>
        </header>
        <div className="cart-items">
          {!cart.length ? (
            <p className="cart-empty">{copy.emptyCart}</p>
          ) : (
            cart.map((item, idx) => (
              <article className="cart-item" key={`${item.id}-${item.size ?? "na"}-${idx}`}>
                <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
                <div>
                  <h4>{item.name}</h4>
                  <p>{formatCOP(item.price, locale)}</p>
                  {item.size ? <small>{copy.sizeLabel}: {item.size}</small> : null}
                  <div className="qty">
                    <button type="button" onClick={() => updateQty(item.id, item.size, -1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQty(item.id, item.size, 1)}>
                      +
                    </button>
                  </div>
                </div>
                <button type="button" className="remove" onClick={() => removeItem(item.id, item.size)}>
                  x
                </button>
              </article>
            ))
          )}
        </div>
        <footer>
          <div className="subtotal">
            <span>{copy.subtotal}</span>
            <strong>{formatCOP(totalPrice, locale)}</strong>
          </div>
          <div className="checkout-actions">
            <button type="button" disabled={!cart.length} onClick={sendWhatsApp} className="checkout">
              {copy.orderWhatsApp}
            </button>
            <button type="button" className="checkout checkout-secondary" disabled>
              {copy.payOnline}
            </button>
          </div>
        </footer>
      </aside>

      <footer className="footer catalog-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <h3>Amada Crochet</h3>
            <p>{copy.footerBody}</p>
          </div>
          <nav className="footer-links">
            <Link href="/">{copy.footerHome}</Link>
            <Link href="/#categories">{copy.footerCollections}</Link>
            <Link href="/#intro">{copy.footerStory}</Link>
            <Link href="/catalogo">{copy.footerCatalog}</Link>
          </nav>
          <div className="footer-contact">
            <p>{copy.footerSupport}</p>
            <a className="footer-whatsapp" href="https://wa.me/573000000000" target="_blank" rel="noreferrer">
              {copy.whatsapp}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
