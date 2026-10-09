import React, { useState, useEffect } from 'react';
import { Sun, Moon, ShieldCheck } from 'lucide-react';

function App() {
  // Estado para controlar o Dark Mode. Começa como falso até checarmos o sistema.
  const [darkMode, setDarkMode] = useState(false);

  // useEffect que roda ao carregar: verifica se o PC do projetor/usuário prefere modo escuro
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // useEffect que aplica ou remove a classe 'dark' na raiz do HTML (necessário pro Tailwind)
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Função disparada ao clicar no botão de tema
  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* 1. HEADER INSTITUCIONAL */}
      <header className="bg-bnb-white dark:bg-bnb-dark_surface shadow-sm border-b border-bnb-light_border dark:border-bnb-dark_border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo e Nome do Sistema */}
          <div className="flex items-center gap-3">
            <div className="bg-bnb-red text-white p-2 rounded-lg flex items-center justify-center">
              {/* O ShieldCheck transmite a ideia de auditoria, governança e segurança */}
              <ShieldCheck size={24} aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold text-bnb-red dark:text-bnb-white tracking-tight">
              Decision Support Engine
            </h1>
          </div>

          {/* Botão de Acessibilidade: Modo Claro/Escuro */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-visible:ring-2"
            aria-label={darkMode ? "Alternar para modo claro" : "Alternar para modo escuro"}
            title={darkMode ? "Modo Claro" : "Modo Escuro"}
          >
            {darkMode ? (
              <Sun className="text-bnb-orange" size={24} aria-hidden="true" />
            ) : (
              <Moon className="text-bnb-text_muted_light" size={24} aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {/* 2. CONTEÚDO PRINCIPAL (Área dinâmica onde a mágica vai acontecer) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        
        {/* Placeholder: Aqui chamaremos o componente da Etapa 2 (Drag & Drop Zone) */}
        <div className="flex-1 border-2 border-dashed border-bnb-light_border dark:border-bnb-dark_border rounded-2xl flex flex-col items-center justify-center text-bnb-text_muted_light dark:text-bnb-text_muted_dark p-8 text-center bg-bnb-white dark:bg-bnb-dark_surface transition-colors duration-300 shadow-sm">
          <h2 className="text-2xl font-bold text-bnb-text_main_light dark:text-bnb-text_main_dark mb-4">
            A área de Drag & Drop e os Cards Flutuantes serão renderizados aqui.
          </h2>
          <p className="text-lg max-w-2xl">
            Esta é a fundação. O Header, o Modo Escuro e o Layout Responsivo já estão a funcionar. No próximo passo, vamos criar o ecossistema vivo de projetos.
          </p>
        </div>
        
      </main>

      {/* 3. FOOTER */}
      <footer className="py-6 text-center text-sm text-bnb-text_muted_light dark:text-bnb-text_muted_dark transition-colors duration-300">
        <p>Governança e Rastreabilidade | Banco do Nordeste &copy; 2026</p>
      </footer>

    </div>
  );
}

export default App;