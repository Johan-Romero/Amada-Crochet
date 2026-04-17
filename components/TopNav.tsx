"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import AuthDrawer from "@/components/AuthDrawer";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { createClient } from "@/lib/supabase/client";

type TopNavProps = {
  solid?: boolean;
  showCart?: boolean;
};

const NAV_COPY = {
  es: {
    menu: "Men\u00fa",
    ingresar: "Ingresar",
    miCuenta: "Mi cuenta",
    hola: "Hola",
    inicio: "Inicio",
    historia: "Historia",
    colecciones: "Colecciones",
    ofertas: "Ofertas",
    seleccion: "Selecci\u00f3n",
    creamos: "Creamos contigo",
    catalogo: "Cat\u00e1logo",
    favoritos: "Favoritos",
    carrito: "Carrito",
    sesionOk: "Has iniciado sesi\u00f3n correctamente.",
    settingsTitle: "Configuraci\u00f3n",
    language: "Idioma",
    appearance: "Apariencia",
    claro: "Claro",
    oscuro: "Oscuro",
  },
  en: {
    menu: "Menu",
    ingresar: "Sign in",
    miCuenta: "My account",
    hola: "Hi",
    inicio: "Home",
    historia: "Story",
    colecciones: "Collections",
    ofertas: "Offers",
    seleccion: "Selection",
    creamos: "Custom orders",
    catalogo: "Catalog",
    favoritos: "Favorites",
    carrito: "Cart",
    sesionOk: "You have signed in successfully.",
    settingsTitle: "Settings",
    language: "Language",
    appearance: "Appearance",
    claro: "Light",
    oscuro: "Dark",
  },
} as const;

function displayNameFor(user: User | null, locale: "es" | "en") {
  const copy = NAV_COPY[locale];
  if (!user) return copy.ingresar;
  const metadata = user.user_metadata ?? {};
  if (typeof metadata.full_name === "string" && metadata.full_name.trim()) {
    return `${copy.hola}, ${metadata.full_name.trim()}`;
  }
  if (user.email) {
    return `${copy.hola}, ${user.email.split("@")[0]}`;
  }
  return copy.miCuenta;
}

export default function TopNav({ solid = false, showCart = false }: TopNavProps) {
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);
  const { locale, theme, setLocale, setTheme } = useAppPreferences();
  const copy = NAV_COPY[locale];
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const menuWrapRef = useRef<HTMLDivElement | null>(null);
  const settingsWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (solid) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [solid]);

  useEffect(() => {
    const syncUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
    };

    void syncUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    setMenuOpen(false);
    setSettingsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleOutside = (event: globalThis.MouseEvent | globalThis.TouchEvent) => {
      const target = event.target as Node | null;
      if (menuWrapRef.current?.contains(target)) return;
      if (settingsWrapRef.current?.contains(target)) return;
      setMenuOpen(false);
      setSettingsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSettingsOpen(false);
      }
    };

    window.addEventListener("mousedown", handleOutside as EventListener);
    window.addEventListener("touchstart", handleOutside as EventListener, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handleOutside as EventListener);
      window.removeEventListener("touchstart", handleOutside as EventListener);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const authAction = url.searchParams.get("auth");
    const flashCookie = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith("amada-auth-flash="))
      ?.split("=")[1];

    if (flashCookie === "success") {
      setAuthOpen(false);
      setFlashMessage(copy.sesionOk);
      window.setTimeout(() => setFlashMessage(""), 4200);
      document.cookie = "amada-auth-flash=; Max-Age=0; path=/";
    }

    if (authAction === "open") {
      setAuthOpen(true);
    }

    if (authAction) {
      url.searchParams.delete("auth");
      const nextUrl = `${url.pathname}${url.search}${url.hash}`;
      window.history.replaceState({}, "", nextUrl);
    }
  }, [pathname, copy.sesionOk]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent(authOpen ? "amada:auth-open" : "amada:auth-close"));
    return () => {
      window.dispatchEvent(new CustomEvent("amada:auth-close"));
    };
  }, [authOpen]);

  const isSolid = solid || scrolled;
  const logoSrc = isSolid
    ? "/Logo/isologo amada crochet negro sin fondo.svg"
    : "/Logo/isologo amada crochet blanco sin fondo.svg";
  const favoriteHref = "/catalogo?favoritos=1";
  const menuLinks = [
    { href: "/", label: copy.inicio },
    { href: "/#intro", label: copy.historia },
    { href: "/#categories", label: copy.colecciones },
    { href: "/#promo", label: copy.ofertas },
    { href: "/#editorial", label: copy.seleccion },
    { href: "/#custom-order", label: copy.creamos },
    { href: "/catalogo", label: copy.catalogo },
  ];

  const handleFavoritesClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (showCart && pathname === "/catalogo") {
      event.preventDefault();
      window.dispatchEvent(new CustomEvent("amada:show-favorites"));
    }
  };

  const handleOpenCart = () => {
    if (!showCart || pathname !== "/catalogo") return;
    window.dispatchEvent(new CustomEvent("amada:open-cart"));
  };

  return (
    <>
      <header className={`top-nav ${isSolid ? "is-solid" : "is-overlay"}`}>
        <div className="top-nav-inner">
          <div className="top-nav-left">
            <div className="nav-menu-wrap" ref={menuWrapRef}>
              <button
                type="button"
                className="nav-ghost nav-menu-toggle"
                aria-expanded={menuOpen}
                aria-controls="site-menu"
                onClick={() => setMenuOpen((current) => !current)}
              >
                {copy.menu}
              </button>

              <div id="site-menu" className={`nav-menu-panel ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
                <div className="nav-menu-card">
                  <nav className="nav-menu-list">
                    {menuLinks.map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>

          <Link href="/" className="top-nav-logo" aria-label={locale === "es" ? "Amada Crochet inicio" : "Amada Crochet home"}>
            <img src={logoSrc} alt="Amada Crochet" />
          </Link>

          <div className="top-nav-right">
            <div className="nav-settings-wrap" ref={settingsWrapRef}>
              <button
                type="button"
                className="nav-ghost nav-settings-toggle"
                aria-expanded={settingsOpen}
                onClick={() => setSettingsOpen((current) => !current)}
                aria-label={copy.settingsTitle}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="m19.4 13 .1-2-1.8-.4a6 6 0 0 0-.6-1.4l1-1.6-1.4-1.4-1.6 1a6 6 0 0 0-1.4-.6L13 3h-2l-.4 1.8a6 6 0 0 0-1.4.6l-1.6-1-1.4 1.4 1 1.6a6 6 0 0 0-.6 1.4L3 11v2l1.8.4a6 6 0 0 0 .6 1.4l-1 1.6 1.4 1.4 1.6-1a6 6 0 0 0 1.4.6L11 21h2l.4-1.8a6 6 0 0 0 1.4-.6l1.6 1 1.4-1.4-1-1.6a6 6 0 0 0 .6-1.4L19.4 13Z" />
                  <circle cx="12" cy="12" r="2.6" />
                </svg>
              </button>

              <div className={`nav-settings-panel ${settingsOpen ? "open" : ""}`} aria-hidden={!settingsOpen}>
                <p>{copy.settingsTitle}</p>
                <div className="nav-settings-group">
                  <span>{copy.language}</span>
                  <div>
                    <button
                      type="button"
                      className={`pref-chip ${locale === "es" ? "active" : ""}`}
                      onClick={() => setLocale("es")}
                    >
                      ES
                    </button>
                    <button
                      type="button"
                      className={`pref-chip ${locale === "en" ? "active" : ""}`}
                      onClick={() => setLocale("en")}
                    >
                      EN
                    </button>
                  </div>
                </div>
                <div className="nav-settings-group">
                  <span>{copy.appearance}</span>
                  <div>
                    <button
                      type="button"
                      className={`pref-chip ${theme === "light" ? "active" : ""}`}
                      onClick={() => setTheme("light")}
                    >
                      {copy.claro}
                    </button>
                    <button
                      type="button"
                      className={`pref-chip ${theme === "dark" ? "active" : ""}`}
                      onClick={() => setTheme("dark")}
                    >
                      {copy.oscuro}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button type="button" className="nav-ghost nav-user" onClick={() => setAuthOpen(true)}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="8" r="3.2" />
                <path d="M5.8 18.2c1.4-3 3.7-4.5 6.2-4.5s4.8 1.5 6.2 4.5" />
              </svg>
              <span className="nav-user-label">{displayNameFor(user, locale)}</span>
            </button>

            <Link href={favoriteHref} className="nav-ghost nav-favorites" onClick={handleFavoritesClick}>
              {copy.favoritos}
            </Link>

            {showCart ? (
              <button
                type="button"
                className="nav-ghost nav-cart nav-cart-desktop"
                onClick={handleOpenCart}
                aria-label={copy.carrito}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M4.5 6.2h2.1l1.6 8.1h8.8l1.5-5.8H7.4" />
                  <circle cx="10.2" cy="18.1" r="1.4" />
                  <circle cx="16.5" cy="18.1" r="1.4" />
                </svg>
                <span className="nav-user-label">{copy.carrito}</span>
              </button>
            ) : null}
          </div>
        </div>

        {flashMessage ? <p className="auth-flash">{flashMessage}</p> : null}
      </header>

      <AuthDrawer open={authOpen} user={user} onClose={() => setAuthOpen(false)} onUserUpdated={setUser} />
    </>
  );
}
