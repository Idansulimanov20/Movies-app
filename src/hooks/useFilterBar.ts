import { useMemo, useState } from "react";

export function useFilterBar() {
  const [yearMenuOpen, setYearMenuOpen] = useState(false);
  const years = useMemo(
    () => Array.from({ length: 50 }, (_, i) => String(2027 - i)),
    [],
  );

  return { yearMenuOpen, setYearMenuOpen, years };
}
