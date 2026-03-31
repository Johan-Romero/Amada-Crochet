"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product, ProductCategory } from "@/lib/products";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
};

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

const FILTERS: Array<{ value: "all" | ProductCategory; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "mujer", label: "Mujer" },
  { value: "nina", label: "Ninas" },
  { value: "bebe", label: "Bebe" },
  { value: "hogar", label: "Hogar" },
  { value: "bolsos", label: "Bolsos" },
];

function normalizeFilter(value?: string): "all" | ProductCategory {
  if (value === "mujer" || value === "nina" || value === "bebe" || value === "hogar" || value === "bolsos") {
    return value;
  }
  return "all";
}

function formatCOP(value: number) {
  return `$${value.toLocaleString("es-CO")}`;
}

export default function CatalogClient({
  products,
  initialFilter,
}: {
  products: Product[];
  initialFilter?: string;
}) {
  const [filter, setFilter] = useState<"all" | ProductCategory>(normalizeFilter(initialFilter));
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sizeById, setSizeById] = useState<Record<string, string>>({});
  const [panelOpen, setPanelOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

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
    window.addEventListener("amada:open-cart", onOpenCart as EventListener);
    return () => window.removeEventListener("amada:open-cart", onOpenCart as EventListener);
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return products;
    return products.filter((item) => item.category === filter);
  }, [filter, products]);

  const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + item.quantity * item.price, 0), [cart]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const setSize = (id: string, size: string) => {
    setSizeById((prev) => ({ ...prev, [id]: size }));
  };

  const addItem = (product: Product) => {
    const selectedSize = sizeById[product.id] || product.sizes[0] || undefined;
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
    const lines = ["Hola, quiero hacer este pedido de Amada Crochet:", ""];
    cart.forEach((item) => {
      const sizeText = item.size ? ` (${item.size})` : "";
      lines.push(`- ${item.name}${sizeText} x${item.quantity} - ${formatCOP(item.price * item.quantity)}`);
    });
    lines.push("", `Total: ${formatCOP(totalPrice)}`);
    const message = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/573000000000?text=${message}`, "_blank", "noopener");
  };

  return (
    <div className="catalog-layout">
      <header className="catalog-header container">
        <a href="/" className="back-link">
          Volver al inicio
        </a>
        <h1>Nuestro Catalogo</h1>
        <p>Piezas unicas tejidas con amor.</p>
      </header>

      <section className="catalog-filters container">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`filter-btn ${filter === f.value ? "active" : ""}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </section>

      <section className="container products-grid">
        {filtered.map((item) => {
          const selected = sizeById[item.id] || item.sizes[0] || "";
          const isFav = favorites.includes(item.id);
          return (
            <article className="product-card" key={item.id}>
              <div className="product-media">
                <img src={item.image} alt={item.name} className="product-image main" />
                <img src={item.hoverImage || item.image} alt={item.name} className="product-image hover" />

                <button
                  type="button"
                  className={`fav-btn ${isFav ? "active" : ""}`}
                  onClick={() => toggleFavorite(item.id)}
                  aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                  {isFav ? "♥" : "♡"}
                </button>

                <div className="quick-panel">
                  {!!item.sizes.length && (
                    <div className="size-picker">
                      {item.sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={selected === size ? "active" : ""}
                          onClick={() => setSize(item.id, size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                  <button className="quick-add" onClick={() => addItem(item)}>
                    {addedId === item.id ? "Agregado +1" : "Agregar al carrito"}
                  </button>
                </div>
              </div>

              <div className="product-body">
                <span className="product-category">{item.category}</span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="product-footer">
                  <strong>{formatCOP(item.price)}</strong>
                  <button
                    className={`add-btn ${addedId === item.id ? "added" : ""}`}
                    onClick={() => addItem(item)}
                    aria-label={`Agregar ${item.name}`}
                  >
                    {addedId === item.id ? "Agregado +1" : "Agregar"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <div className={`cart-overlay ${panelOpen ? "open" : ""}`} onClick={() => setPanelOpen(false)} />
      <aside className={`cart-panel ${panelOpen ? "open" : ""}`}>
        <header>
          <h2>Tu carrito</h2>
          <button onClick={() => setPanelOpen(false)}>Cerrar</button>
        </header>
        <div className="cart-items">
          {!cart.length ? (
            <p className="cart-empty">Tu carrito esta vacio.</p>
          ) : (
            cart.map((item, idx) => (
              <article className="cart-item" key={`${item.id}-${item.size ?? "na"}-${idx}`}>
                <img src={item.image} alt={item.name} />
                <div>
                  <h4>{item.name}</h4>
                  <p>{formatCOP(item.price)}</p>
                  {item.size ? <small>Talla: {item.size}</small> : null}
                  <div className="qty">
                    <button onClick={() => updateQty(item.id, item.size, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.size, 1)}>+</button>
                  </div>
                </div>
                <button className="remove" onClick={() => removeItem(item.id, item.size)}>
                  x
                </button>
              </article>
            ))
          )}
        </div>
        <footer>
          <div className="subtotal">
            <span>Subtotal</span>
            <strong>{formatCOP(totalPrice)}</strong>
          </div>
          <button disabled={!cart.length} onClick={sendWhatsApp} className="checkout">
            Pedir por WhatsApp
          </button>
        </footer>
      </aside>

      <footer className="footer catalog-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <h3>Amada Crochet</h3>
            <p>Piezas artesanales, atencion personalizada y acabados premium.</p>
          </div>
          <nav className="footer-links">
            <a href="/">Inicio</a>
            <a href="/#gallery">Coleccion</a>
            <a href="/#values">Valores</a>
            <a href="/catalogo">Catalogo</a>
          </nav>
          <div className="footer-contact">
            <p>Atencion personalizada</p>
            <a className="footer-whatsapp" href="https://wa.me/573000000000" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
