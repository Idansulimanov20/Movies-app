import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/Login.css";
import { useAuth } from "../context/useAuth";

function LoginForm() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, requestPasswordRecovery } = useAuth();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isSignUp = mode === "signup";
  const isRecover = mode === "recover";
  const authCopy = {
    signin: {
      title: "Welcome Back!",
      subtitle: location.state?.authRequired
        ? "Please sign in before opening your favorites."
        : "Sign in to save movies and manage your favorites.",
    },
    signup: {
      title: "Create Account",
      subtitle: "Create your profile with a username, then start building your movie list.",
    },
    recover: {
      title: "Recover Password",
      subtitle: "Enter your email and we will send recovery instructions.",
    },
  };

  const resetAuthState = () => {
    setEmail("");
    setUsername("");
    setPassword("");
    setError("");
    setSuccess("");
    setShowPassword(false);
  };

  const changeMode = (nextMode) => {
    if (nextMode === mode) return;
    resetAuthState();
    setMode(nextMode);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if ((isSignUp || isRecover) && !emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!isRecover && !/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
      setError("Username must be 3-24 characters.");
      return;
    }

    if (!isRecover && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isRecover) {
        const message = await requestPasswordRecovery(email);
        setSuccess(message);
      } else if (isSignUp) {
        await register({ email, username, password });
        setSuccess("Account created successfully.");
        navigate("/home");
      } else {
        await login({ username, password });
        setSuccess("Logged in successfully.");
        navigate("/home");
      }

      setEmail("");
      setUsername("");
      setPassword("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
