"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { createClient } from "@/lib/supabase/client";

type AuthDrawerProps = {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onUserUpdated: (user: User | null) => void;
};

const DRAWER_COPY = {
  es: {
    accountKicker: "Cuenta Amada",
    accessTitle: "Accede a tu cuenta",
    welcome: "Bienvenido",
    profileIntro:
      "Ya entraste con {email}. Completa o actualiza tus datos para que la experiencia de compra sea m\u00e1s personal y \u00e1gil.",
    name: "Nombre",
    namePlaceholder: "C\u00f3mo quieres que te llamemos",
    phone: "Tel\u00e9fono",
    city: "Ciudad de residencia",
    citySelect: "Selecciona tu ciudad",
    save: "Guardar perfil",
    update: "Actualizar perfil",
    saving: "Guardando...",
    signOut: "Cerrar sesi\u00f3n",
    loginIntro:
      "Escribe tu correo y te enviaremos un correo de acceso seguro. Solo tendr\u00e1s que pulsar el bot\u00f3n del mensaje para entrar a Amada Crochet.",
    email: "Correo electr\u00f3nico",
    send: "Enviar correo de acceso",
    sending: "Enviando correo...",
    whatHappens: "\u00bfQu\u00e9 va a pasar?",
    whatHappensBody: "Recibir\u00e1s un correo de acceso. Si no lo ves en unos minutos, revisa promociones o spam.",
    sendError: "No pudimos enviar el correo de acceso. Revisa el email e int\u00e9ntalo nuevamente.",
    sendRateLimit:
      "Ya se enviaron varios correos en poco tiempo. Espera un momento e intenta de nuevo para evitar el bloqueo temporal.",
    sendOk: "Te enviamos un correo de acceso. Abre el bot\u00f3n del mensaje para entrar de forma segura a Amada Crochet.",
    saveError: "No fue posible guardar tus datos ahora mismo. Int\u00e9ntalo otra vez.",
    saveOkNew: "Tu perfil se guard\u00f3 correctamente.",
    saveOkUpdated: "Tu perfil se actualiz\u00f3 correctamente.",
    yourEmail: "tu correo",
    closePanel: "Cerrar panel",
    emailPlaceholder: "tu@email.com",
    fallbackName: "artesana",
  },
  en: {
    accountKicker: "Amada Account",
    accessTitle: "Access your account",
    welcome: "Welcome",
    profileIntro:
      "You are signed in with {email}. Complete or update your details for a more personal and faster shopping experience.",
    name: "Name",
    namePlaceholder: "How should we call you?",
    phone: "Phone",
    city: "City",
    citySelect: "Select your city",
    save: "Save profile",
    update: "Update profile",
    saving: "Saving...",
    signOut: "Sign out",
    loginIntro:
      "Enter your email and we will send a secure access email. You only need to click the button in that message to enter Amada Crochet.",
    email: "Email",
    send: "Send access email",
    sending: "Sending email...",
    whatHappens: "What happens next?",
    whatHappensBody: "You will receive an access email. If you do not see it in a few minutes, check promotions or spam.",
    sendError: "We could not send the access email. Check the address and try again.",
    sendRateLimit: "Too many access emails were requested. Please wait a moment and try again.",
    sendOk: "We sent your access email. Open the button in that message to securely enter Amada Crochet.",
    saveError: "We could not save your profile right now. Please try again.",
    saveOkNew: "Your profile was saved successfully.",
    saveOkUpdated: "Your profile was updated successfully.",
    yourEmail: "your email",
    closePanel: "Close panel",
    emailPlaceholder: "you@email.com",
    fallbackName: "artisan",
  },
} as const;

const COLOMBIA_CITIES = [
  "Arauca",
  "Armenia",
  "Barrancabermeja",
  "Barranquilla",
  "Bogot\u00e1",
  "Bucaramanga",
  "Buenaventura",
  "Cali",
  "Cartagena",
  "C\u00facuta",
  "Dosquebradas",
  "Florencia",
  "Girardot",
  "Ibagu\u00e9",
  "In\u00edrida",
  "Leticia",
  "Manizales",
  "Medell\u00edn",
  "Mit\u00fa",
  "Mocoa",
  "Monter\u00eda",
  "Neiva",
  "Pasto",
  "Pereira",
  "Popay\u00e1n",
  "Puerto Carre\u00f1o",
  "Quibd\u00f3",
  "Riohacha",
  "San Andr\u00e9s",
  "San Jos\u00e9 del Guaviare",
  "Santa Marta",
  "Sincelejo",
  "Soacha",
  "Tunja",
  "Valledupar",
  "Villavicencio",
  "Yopal",
];

function displayNameFor(user: User | null, fallbackName: string) {
  if (!user) return "";
  const metadata = user.user_metadata ?? {};
  if (typeof metadata.full_name === "string" && metadata.full_name.trim()) {
    return metadata.full_name.trim();
  }
  if (user.email) {
    return user.email.split("@")[0].replace(/[._-]+/g, " ");
  }
  return fallbackName;
}

function ActionIcon({ kind }: { kind: "save" | "logout" }) {
  if (kind === "logout") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M15 7.5V5.8c0-1-.8-1.8-1.8-1.8H6.8C5.8 4 5 4.8 5 5.8v12.4c0 1 .8 1.8 1.8 1.8h6.4c1 0 1.8-.8 1.8-1.8v-1.7" />
        <path d="M10.5 12h8.2" />
        <path d="m15.8 8.2 3.7 3.8-3.7 3.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 4.8h10.4L20 8.4V19a1.8 1.8 0 0 1-1.8 1.8H7.8A1.8 1.8 0 0 1 6 19Z" />
      <path d="M8.2 4.8v4.6h6.7V4.8" />
      <path d="M8.7 20.8v-5.3h6.6v5.3" />
    </svg>
  );
}

function isRateLimitError(errorMessage: string | undefined) {
  if (!errorMessage) return false;
  const normalized = errorMessage.toLowerCase();
  return normalized.includes("rate") || normalized.includes("too many") || normalized.includes("retry");
}

export default function AuthDrawer({ open, user, onClose, onUserUpdated }: AuthDrawerProps) {
  const supabase = useMemo(() => createClient(), []);
  const { locale } = useAppPreferences();
  const copy = DRAWER_COPY[locale];
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [sendingLink, setSendingLink] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      setName("");
      setPhone("");
      setCity("");
      return;
    }

    const metadata = user.user_metadata ?? {};
    setName(typeof metadata.full_name === "string" ? metadata.full_name : "");
    setPhone(typeof metadata.phone === "string" ? metadata.phone : "");
    setCity(typeof metadata.city === "string" ? metadata.city : "");
  }, [user]);

  const profileCompleted = Boolean(name.trim() || phone.trim() || city.trim());

  const sendMagicLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSendingLink(true);
    setStatus("idle");
    setMessage("");

    const redirectUrl = new URL("/auth/confirm", process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin);
    redirectUrl.searchParams.set("next", "/");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl.toString(),
        shouldCreateUser: true,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(isRateLimitError(error.message) ? copy.sendRateLimit : copy.sendError);
      setSendingLink(false);
      return;
    }

    setStatus("success");
    setMessage(copy.sendOk);
    setSendingLink(false);
  };

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingProfile(true);
    setStatus("idle");
    setMessage("");

    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: name.trim(),
        phone: phone.trim(),
        city,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(copy.saveError);
      setSavingProfile(false);
      return;
    }

    onUserUpdated(data.user ?? user);
    setStatus("success");
    setMessage(profileCompleted ? copy.saveOkUpdated : copy.saveOkNew);
    setSavingProfile(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    onUserUpdated(null);
    onClose();
  };

  const profileIntro = copy.profileIntro.replace("{email}", user?.email ?? copy.yourEmail);

  return (
    <>
      <div className={`auth-panel-overlay ${open ? "open" : ""}`} onClick={onClose} aria-hidden={!open} />
      <aside className={`auth-panel ${open ? "open" : ""}`} aria-hidden={!open}>
        <header className="auth-panel-header">
          <div>
            <p className="auth-panel-kicker">{copy.accountKicker}</p>
            <h2>{user ? `${copy.welcome}, ${displayNameFor(user, copy.fallbackName)}` : copy.accessTitle}</h2>
          </div>
          <button type="button" className="auth-panel-close close-x-btn" onClick={onClose} aria-label={copy.closePanel}>
            <span aria-hidden>{"\u00D7"}</span>
          </button>
        </header>

        <div className="auth-panel-body">
          {user ? (
            <>
              <p className="auth-panel-copy">{profileIntro}</p>

              <form className="auth-profile-form" onSubmit={saveProfile}>
                <label htmlFor="profile-name">
                  {copy.name}
                  <input
                    id="profile-name"
                    type="text"
                    placeholder={copy.namePlaceholder}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </label>

                <label htmlFor="profile-phone">
                  {copy.phone}
                  <input
                    id="profile-phone"
                    type="tel"
                    placeholder="300 000 0000"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                </label>

                <label htmlFor="profile-city">
                  {copy.city}
                  <select id="profile-city" value={city} onChange={(event) => setCity(event.target.value)}>
                    <option value="">{copy.citySelect}</option>
                    {COLOMBIA_CITIES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="auth-inline-actions">
                  <button type="submit" disabled={savingProfile}>
                    <ActionIcon kind="save" />
                    <span>{savingProfile ? copy.saving : profileCompleted ? copy.update : copy.save}</span>
                  </button>
                  <button type="button" className="auth-secondary" onClick={signOut}>
                    <ActionIcon kind="logout" />
                    <span>{copy.signOut}</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <p className="auth-panel-copy">{copy.loginIntro}</p>

              <form className="auth-profile-form" onSubmit={sendMagicLink}>
                <label htmlFor="auth-email">
                  {copy.email}
                  <input
                    id="auth-email"
                    type="email"
                    placeholder={copy.emailPlaceholder}
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </label>

                <div className="auth-inline-actions">
                  <button type="submit" disabled={sendingLink}>
                    <span>{sendingLink ? copy.sending : copy.send}</span>
                  </button>
                </div>
              </form>

              <div className="auth-delivery-note">
                <strong>{copy.whatHappens}</strong>
                <p>{copy.whatHappensBody}</p>
              </div>
            </>
          )}

          {status !== "idle" ? (
            <p className={`login-note ${status === "success" ? "is-success" : "is-error"}`}>{message}</p>
          ) : null}
        </div>
      </aside>
    </>
  );
}
