import React, { useState, useEffect } from 'react';
import { Sun, Moon, ShieldCheck } from 'lucide-react';
import DragDropZone from './components/DragDropZone';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [appState, setAppState] = useState('SELECTION'); // Estados: SELECTION, ANALYZING, RESULTS

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  // Função que recebe a lista de IDs quando clicamos no Botão Vermelho Gigante
  const startAnalysisPipeline = (selectedProjectIds) => {
    console.log("Iniciando análise (Batch) para:", selectedProjectIds);
    // Mudaremos a tela para o Dashboard de Análise na Etapa 3!
    alert(`Iniciando análise para: ${selectedProjectIds.join(', ')}. \nA tela de processamento será implementada na Etapa 3!`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* HEADER INSTITUCIONAL */}
      <header className="bg-bnb-white dark:bg-bnb-dark_surface shadow-sm border-b border-bnb-light_border dark:border-bnb-dark_border transition-colors duration-300 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-bnb-red text-white p-2 rounded-lg flex items-center justify-center">
              <ShieldCheck size={24} aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold text-bnb-red dark:text-bnb-white tracking-tight">
              Decision Support Engine
            </h1>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-visible:ring-2 focus-visible:ring-bnb-orange"
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

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {/* Usamos renderização condicional baseada no estado da aplicação */}
        {appState === 'SELECTION' && (
          <DragDropZone onStartAnalysis={startAnalysisPipeline} />
        )}
      </main>

      {/* FOOTER */}
      <footer className="py-6 text-center text-sm text-bnb-text_muted_light dark:text-bnb-text_muted_dark transition-colors duration-300">
        <p>Governança e Rastreabilidade | Banco do Nordeste &copy; 2026</p>
      </footer>

    </div>
  );
}

export default App;