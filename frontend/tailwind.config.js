/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Habilita a alternância manual do modo escuro usando a classe 'dark' no elemento HTML root
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        // Paleta Institucional Mapeada do Banco do Nordeste (BNB)
        bnb: {
          white: "#FFFFFF",
          red: "#B80032",
          hover: "#F7004D",
          orange: "#FF8400",
          
          // Cores semânticas de apoio para o Dark Mode e superfícies
          dark_bg: "#121212",        // Fundo principal escuro
          dark_surface: "#1E1E1E",   // Fundo de cards no modo escuro
          dark_border: "#2D2D2D",    // Bordas no modo escuro
          light_bg: "#F9FAFB",       // Fundo principal claro (gray-50)
          light_surface: "#FFFFFF",  // Fundo de cards no modo claro
          light_border: "#E5E7EB",   // Bordas no modo claro
          
          // Cores de tipografia para alto contraste (Acessibilidade)
          text_main_light: "#111827", // Texto principal no modo claro (quase preto)
          text_muted_light: "#4B5563",// Texto secundário no modo claro
          text_main_dark: "#F9FAFB",  // Texto principal no modo escuro (quase branco)
          text_muted_dark: "#9CA3AF"  // Texto secundário no modo escuro
        }
      },
      fontFamily: {
        // Garantindo fontes sem serifa de alta legibilidade para projetores
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        // Sombra suave para o efeito de flutuação que pediu nos cards
        'float': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'float-dark': '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}