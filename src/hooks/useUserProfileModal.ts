import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useAuth } from "../contexts/useAuth";

export function computeOtpDigitResult(prev, index, digit) {
  if (index > prev.length) {
    return { next: prev, focusIndex: Math.min(prev.length, 5) };
  }
  const chars = prev.split("");
  if (index < chars.length) {
    chars[index] = digit;
    const next = chars.join("").slice(0, 6);
    return { next, focusIndex: index < 5 ? index + 1 : null };
  }
  if (index === chars.length && chars.length < 6) {
    const next = (prev + digit).slice(0, 6);
    return { next, focusIndex: index < 5 ? index + 1 : null };
  }
  return { next: prev, focusIndex: null };
}

export function useUserProfileModal(open) {
  const { changePassword, saveProfile, sendPasswordChangeCode, user } = useAuth();
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
  const otpInputRefs = useRef([]);

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

  useEffect(() => {
    if (!verificationSent) return;
    const id = requestAnimationFrame(() => otpInputRefs.current[0]?.focus());
    return () => cancelAnimationFrame(id);
  }, [verificationSent]);

  const handleOtpChange = (index, event) => {
    const rawDigits = event.target.value.replace(/\D/g, "");
    if (!rawDigits) {
      flushSync(() => setVerificationCode((prev) => prev.slice(0, index) + prev.slice(index + 1)));
      return;
    }

    let focusIndex = null;
    flushSync(() => {
      setVerificationCode((prev) => {
        if (rawDigits.length > 1) {
          const chunk = rawDigits.slice(0, 6);
          const prefix = prev.slice(0, index);
          const merged = (prefix + chunk).slice(0, 6);
          focusIndex = Math.min(merged.length, 5);
          return merged;
        }
        const digit = rawDigits.slice(-1);
        const result = computeOtpDigitResult(prev, index, digit);
        focusIndex = result.focusIndex;
        return result.next;
      });
    });

    if (typeof focusIndex === "number") {
      otpInputRefs.current[focusIndex]?.focus({ preventScroll: true });
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key !== "Backspace") return;
    if (verificationCode[index]) return;
    event.preventDefault();
    if (index === 0) return;
    otpInputRefs.current[index - 1]?.focus();
    setVerificationCode((prev) => prev.slice(0, index - 1) + prev.slice(index));
  };

  const handleOtpPaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    flushSync(() => setVerificationCode(pasted));
    const nextFocus = Math.min(Math.max(pasted.length - 1, 0), 5);
    otpInputRefs.current[nextFocus]?.focus({ preventScroll: true });
  };

  return {
    user,
    changePassword,
    saveProfile,
    sendPasswordChangeCode,
    name,
    setName,
    avatar,
    setAvatar,
    error,
    setError,
    securityError,
    setSecurityError,
    securityMessage,
    setSecurityMessage,
    verificationSent,
    setVerificationSent,
    verificationCode,
    setVerificationCode,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    saving,
    setSaving,
    requestingCode,
    setRequestingCode,
    changingPassword,
    setChangingPassword,
    otpInputRefs,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,
  };
}
