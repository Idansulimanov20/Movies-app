import { useState } from "react";

export function useNavBar() {
  const [profileOpen, setProfileOpen] = useState(false);

  return { profileOpen, setProfileOpen };
}
