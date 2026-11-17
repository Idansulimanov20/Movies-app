import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../styles/Login.css";
import { useLoginForm } from "../../hooks/useLoginForm";

function LoginForm() {
  const {
    mode,
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    error,
    success,
    loading,
    showPassword,
    setShowPassword,
    isSignUp,
    isRecover,
    authCopy,
    changeMode,
    handleSubmit,
  } = useLoginForm();

  return (
    <>
      <h2>{authCopy[mode].title}</h2>
      <p className="login-subtitle">{authCopy[mode].subtitle}</p>

      {!isRecover && (
        <div className="auth-mode-toggle" aria-label="Authentication mode">
          <button
            type="button"
            className={!isSignUp ? "active" : ""}
            onClick={() => changeMode("signin")}
          >
            Sign in
          </button>
          <button
            type="button"
            className={isSignUp ? "active" : ""}
            onClick={() => changeMode("signup")}
          >
            Sign up
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="login-form">
        {(isSignUp || isRecover) && (
          <div className="input-group">
            <label>Email</label>
            <input
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
            />
            {error && error.includes("email") && (
              <p className="login-error">{error}</p>
            )}
          </div>
        )}

        {!isRecover && (
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
        )}

        {!isRecover && (
          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {error && error.includes("Password") && (
              <p className="login-error">{error}</p>
            )}
          </div>
        )}

        {error && !error.includes("email") && !error.includes("Password") && (
          <p className="login-error">{error}</p>
        )}

        {success && <p className="login-success">{success}</p>}

        <button type="submit" className="login-btn-submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : isRecover
              ? "Send recovery email"
              : isSignUp
                ? "Create account"
                : "Login"}
        </button>

        <button
          type="button"
          className="forgot-password-btn"
          onClick={() => changeMode(isRecover ? "signin" : "recover")}
        >
          {isRecover ? "Back to sign in" : "Forgot password?"}
        </button>
      </form>
    </>
  );
}

export default LoginForm;
