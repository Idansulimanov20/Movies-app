import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaCamera, FaCheckCircle, FaEnvelope, FaLock, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/useAuth";
import "../css/UserProfileModal.css";

function UserProfileModal({ open, onClose }) {
  const {
    changePassword,
    saveProfile,
    sendPasswordChangeCode,
    user,
  } = useAuth();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const [securityError, setSecurityError] = useState("");
  const [securityMessage, setSecurityMessage] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [requestingCode, setRequestingCode] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(user?.name || "");
    setAvatar(user?.avatar || "");
    setError("");
    setSecurityError("");
    setSecurityMessage("");
    setVerificationSent(false);
    setVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
  }, [open, user]);

  if (!open) return null;

  const initials = (user?.name || user?.username || "U").slice(0, 1).toUpperCase();

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    if (file.size > 500000) {
      setError("Please choose an image under 500KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await saveProfile({ name, avatar });
      toast.success("Profile updated successfully.", {
        toastId: "profile-update-success",
      });
      onClose();
    } catch (profileError) {
      setError(profileError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRequestPasswordCode = async () => {
    setRequestingCode(true);
    setSecurityError("");
    setSecurityMessage("");

    try {
      const response = await sendPasswordChangeCode();
      setVerificationSent(true);
      setSecurityMessage(
        `We sent a 6-digit verification code to ${response.email}.`
      );
      toast.success("Verification code sent.", {
        toastId: "password-code-sent",
      });
    } catch (passwordError) {
      setSecurityError(passwordError.message);
    } finally {
      setRequestingCode(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setSecurityError("");
    setSecurityMessage("");

    if (!/^\d{6}$/.test(verificationCode)) {
      setSecurityError("Enter the 6-digit verification code.");
      return;
    }

    if (newPassword.length < 6) {
      setSecurityError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityError("Passwords do not match.");
      return;
    }

    setChangingPassword(true);

    try {
      await changePassword({ code: verificationCode, newPassword });
      setVerificationCode("");
      setNewPassword("");
      setConfirmPassword("");
      setVerificationSent(false);
      setSecurityMessage("Password updated successfully.");
      toast.success("Password updated successfully.", {
        toastId: "password-change-success",
      });
    } catch (passwordError) {
      setSecurityError(passwordError.message);
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="profile-modal-backdrop" onMouseDown={onClose}>
      <section
        className="profile-modal"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        <button
          type="button"
          className="profile-modal-close"
          onClick={onClose}
          aria-label="Close profile settings"
        >
          <FaTimes aria-hidden="true" />
        </button>

        <div className="profile-modal-header">
          <span className="profile-modal-kicker">Account settings</span>
          <h2 id="profile-modal-title">Profile & security</h2>
          <p className="profile-modal-subtitle">
            Manage how you appear in Watch & Chill and keep your account secure.
          </p>
        </div>

        <div className="profile-modal-content">
          <form onSubmit={handleSubmit} className="profile-card profile-form">
            <div className="profile-section-heading">
              <span className="profile-section-icon">
                <FaCamera aria-hidden="true" />
              </span>
              <div>
                <h3>Public profile</h3>
                <p>Update your display name and profile photo.</p>
              </div>
            </div>

            <label className="profile-avatar-picker">
              <span className="profile-avatar-preview">
                {avatar ? <img src={avatar} alt="" /> : initials}
              </span>
              <span className="profile-avatar-copy">
                <span className="profile-avatar-title">
                  {user?.name || user?.username}
                </span>
                <span className="profile-avatar-subtitle">{user?.email}</span>
                <span className="profile-avatar-action">
                  <FaCamera aria-hidden="true" />
                  Change photo
                </span>
              </span>
              <input type="file" accept="image/*" onChange={handleAvatarChange} />
            </label>

            <label className="profile-field">
              <span>Display name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={40}
                placeholder="Enter your display name"
              />
            </label>

            {error && <p className="profile-error">{error}</p>}

            <div className="profile-actions">
              <button type="button" className="profile-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="profile-primary" disabled={saving}>
                {saving ? "Saving..." : "Save profile"}
              </button>
            </div>
          </form>

          <section className="profile-card profile-security">
            <div className="profile-section-heading">
              <span className="profile-section-icon">
                <FaLock aria-hidden="true" />
              </span>
              <div>
                <h3>Password</h3>
                <p>Verify your email before changing your password.</p>
              </div>
            </div>

            <div className="profile-verification-panel">
              <span className="profile-verification-icon">
                <FaEnvelope aria-hidden="true" />
              </span>
              <div>
                <strong>Email verification</strong>
                <p>
                  We will send a 6-digit code to {user?.email}. Codes expire
                  after 10 minutes.
                </p>
              </div>
              <button
                type="button"
                className="profile-secondary profile-code-button"
                onClick={handleRequestPasswordCode}
                disabled={requestingCode}
              >
                {requestingCode
                  ? "Sending..."
                  : verificationSent
                    ? "Resend code"
                    : "Send code"}
              </button>
            </div>

            {verificationSent && (
              <form className="profile-password-form" onSubmit={handlePasswordChange}>
                <label className="profile-field">
                  <span>Verification code</span>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(event) =>
                      setVerificationCode(
                        event.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="6-digit code"
                  />
                </label>

                <div className="profile-password-grid">
                  <label className="profile-field">
                    <span>New password</span>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      minLength={6}
                      autoComplete="new-password"
                      placeholder="At least 6 characters"
                    />
                  </label>
                  <label className="profile-field">
                    <span>Confirm password</span>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      minLength={6}
                      autoComplete="new-password"
                      placeholder="Repeat new password"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="profile-primary"
                  disabled={changingPassword}
                >
                  {changingPassword ? "Updating..." : "Update password"}
                </button>
              </form>
            )}

            {securityMessage && (
              <p className="profile-success">
                <FaCheckCircle aria-hidden="true" />
                {securityMessage}
              </p>
            )}
            {securityError && <p className="profile-error">{securityError}</p>}
          </section>
        </div>
      </section>
    </div>
  );
}

export default UserProfileModal;
