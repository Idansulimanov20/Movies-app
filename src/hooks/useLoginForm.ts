import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export function useLoginForm() {
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
        setSuccess(await requestPasswordRecovery(email));
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
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
