import { createContext } from "react";
import type { MovieContextValue } from "../types";

export const MovieContext = createContext<MovieContextValue | null>(null);
