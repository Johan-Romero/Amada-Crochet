import TopNav from "@/components/TopNav";

export default function LoginPage() {
  return (
    <>
      <TopNav solid />
      <main className="login-page">
        <section className="login-card">
          <p className="login-kicker">Cuenta Amada</p>
          <h1>Ingresar</h1>
          <p>Guarda favoritos, consulta tu carrito y gestiona pedidos.</p>

          <form className="login-form">
            <label>
              Correo
              <input type="email" placeholder="tu@email.com" />
            </label>
            <label>
              Contrasena
              <input type="password" placeholder="********" />
            </label>
            <button type="button">Continuar</button>
          </form>

          <small>Esta es una vista inicial de login para activar en una siguiente fase.</small>
        </section>
      </main>
    </>
  );
}
