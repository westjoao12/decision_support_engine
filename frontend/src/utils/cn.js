import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utilitário profissional para mesclar classes do Tailwind CSS sem conflitos.
 * Essencial para componentes dinâmicos (ex: mudar a borda quando o card está selecionado).
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}