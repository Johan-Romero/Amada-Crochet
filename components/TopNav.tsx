"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type TopNavProps = {
  solid?: boolean;
  showCart?: boolean;
};

export default function TopNav({ solid = false, showCart = false }: TopNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (solid) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [solid]);

  useEffect(() => {
    if (!showCart) return;

    const readCartCount = () => {
      try {
        const raw = localStorage.getItem("amada-next-cart");
        if (!raw) {
          setCartCount(0);
          return;
        }
        const parsed = JSON.parse(raw) as Array<{ quantity?: number }>;
        const total = parsed.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
        setCartCount(total);
      } catch {
        setCartCount(0);
      }
    };

    const onCartUpdated = () => readCartCount();
    readCartCount();
    window.addEventListener("storage", onCartUpdated);
    window.addEventListener("amada:cart-updated", onCartUpdated as EventListener);

    return () => {
      window.removeEventListener("storage", onCartUpdated);
      window.removeEventListener("amada:cart-updated", onCartUpdated as EventListener);
    };
  }, [showCart]);

  const isSolid = solid || scrolled;
  const logoSrc = isSolid
    ? "/Logo/isologo amada crochet negro sin fondo.svg"
    : "/Logo/isologo amada crochet blanco sin fondo.svg";

  return (
    <header className={`top-nav ${isSolid ? "is-solid" : "is-overlay"}`}>
      <div className="top-nav-inner">
        <div className="top-nav-left">
          <button type="button" className="nav-ghost">
            Menu
          </button>
          <button type="button" className="nav-ghost nav-search">
            Buscar
          </button>
        </div>

        <Link href="/" className="top-nav-logo" aria-label="Amada Crochet inicio">
          <img src={logoSrc} alt="Amada Crochet" />
        </Link>

        <div className="top-nav-right">
          <Link href="/ingresar" className="nav-ghost nav-user" aria-label="Ingresar">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <circle cx="12" cy="8" r="3.2" />
              <path d="M5.8 18.2c1.4-3 3.7-4.5 6.2-4.5s4.8 1.5 6.2 4.5" />
            </svg>
          </Link>

          {showCart ? (
            <button
              type="button"
              className="nav-ghost nav-cart"
              aria-label={cartCount > 0 ? `Abrir carrito (${cartCount})` : "Abrir carrito"}
              onClick={() => window.dispatchEvent(new CustomEvent("amada:open-cart"))}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4.5 6.2h2.1l1.6 8.1h8.8l1.5-5.8H7.4" />
                <circle cx="10.2" cy="18.1" r="1.4" />
                <circle cx="16.5" cy="18.1" r="1.4" />
              </svg>
              {cartCount > 0 ? <span className="nav-icon-badge">{cartCount > 99 ? "99+" : cartCount}</span> : null}
            </button>
          ) : null}

          <button type="button" className="nav-ghost nav-favorites">
            Favoritos
          </button>
        </div>
      </div>
    </header>
  );
}
