import { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { useAuth } from "../context/useAuth";
import "../css/UserProfileModal.css";

function UserProfileModal({ open, onClose }) {
  const { saveProfile, user } = useAuth();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(user?.name || "");
    setAvatar(user?.avatar || "");
    setError("");
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
      onClose();
    } catch (profileError) {
      setError(profileError.message);
    } finally {
      setSaving(false);
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
          <span className="profile-modal-close-symbol" aria-hidden="true">
            ×
          </span>
        </button>

        <h2 id="profile-modal-title">Profile</h2>
        <p className="profile-modal-subtitle">{user?.username}</p>

        <form onSubmit={handleSubmit} className="profile-form">
          <label className="profile-avatar-picker">
            <span className="profile-avatar-preview">
              {avatar ? <img src={avatar} alt="" /> : initials}
            </span>
            <span className="profile-avatar-action">
              <FaCamera />
              Change photo
            </span>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </label>

          <label className="profile-field">
            Display name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={40}
            />
          </label>

          {error && <p className="profile-error">{error}</p>}

          <div className="profile-actions">
            <button type="button" className="profile-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="profile-primary" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default UserProfileModal;
