import LoginForm from "../components/LoginForm";
import "../css/Login.css";

function Login() {
  return (
    <div className="login-page">
      <div className="login-container">
        <aside className="login-aside" aria-label="Watch and Chill">
          <h1 className="login-brand">Watch & Chill</h1>
          <p className="login-brand-copy">
            Keep your movie list personal and ready for the next night in.
          </p>
        </aside>
        <section className="login-panel">
          <LoginForm />
        </section>
      </div>
    </div>
  );
}

export default Login;
