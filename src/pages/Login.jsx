import { useState } from "react";
import "../css/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // הודעת שגיאה
  const [success, setSuccess] = useState(""); // הודעת הצלחה
  const [loading, setLoading] = useState(false); // מצב טעינה

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // בדיקה בסיסית של אימייל וסיסמה
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // סימולציה של התחברות
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess("Logged in successfully (demo)");
      console.log("Email:", email, "Password:", password);
      setEmail("");
      setPassword("");
    }, 1500);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        {error && <p className="login-error">{error}</p>}
        {success && <p className="login-success">{success}</p>}

        <button type="submit" className="login-btn-submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
