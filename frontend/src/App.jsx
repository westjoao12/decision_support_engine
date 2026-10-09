import React, { useState, useEffect } from 'react';
import { Sun, Moon, ShieldCheck } from 'lucide-react';
import DragDropZone from './components/DragDropZone';
import AnalysisDashboard from './components/AnalysisDashboard';
import DecisionPanel from './components/DecisionPanel';
// Importação do nosso novo utilitário de geração de PDF
import { exportDecisionToPDF } from './utils/pdfExport';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  
  // Controle da máquina de estados do nosso Frontend
  // SELECTION -> ANALYZING -> DECISION
  const [appState, setAppState] = useState('SELECTION'); 
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [activeProjectToReview, setActiveProjectToReview] = useState(null);

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

  // Ações de Transição de Estado
  const startAnalysisPipeline = (ids) => {
    setSelectedProjectIds(ids);
    setAppState('ANALYZING'); // Troca a tela para o Dashboard
  };

  const openDecisionPanel = (projectData) => {
    setActiveProjectToReview(projectData);
    setAppState('DECISION'); // Troca a tela para o Split-Screen
  };

  const goBackToDashboard = () => {
    setAppState('ANALYZING');
  };

  const resetToStart = () => {
    setSelectedProjectIds([]);
    setActiveProjectToReview(null);
    setAppState('SELECTION');
  };

  // FUNÇÃO ATUALIZADA: Agora gera e baixa o PDF oficial
  const saveFinalDecision = (finalData) => {
    console.log("DECISÃO ASSINADA E IMUTÁVEL SALVA NO BANCO DE DADOS:", finalData);
    
    // Dispara a criação do PDF passando os dados estruturados
    try {
      exportDecisionToPDF(activeProjectToReview, finalData.finalDecision);
      alert(`Sucesso! O Parecer do ${finalData.projeto_id} foi assinado e o Dossiê em PDF foi salvo no seu computador.`);
    } catch (error) {
      console.error("Erro ao gerar o PDF:", error);
      alert("Houve um erro ao gerar o documento PDF, mas a decisão foi registada no sistema.");
    }

    // Após assinar e baixar, volta para a lista de lote processado
    goBackToDashboard();
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* HEADER INSTITUCIONAL */}
      <header className="bg-bnb-white dark:bg-bnb-dark_surface shadow-sm border-b border-bnb-light_border dark:border-bnb-dark_border transition-colors duration-300 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={resetToStart}
            role="button"
            tabIndex={0}
            aria-label="Voltar à tela inicial"
          >
            <div className="bg-bnb-red text-white p-2 rounded-lg flex items-center justify-center">
              <ShieldCheck size={24} aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold text-bnb-red dark:text-bnb-white tracking-tight">
              Motor Determinístico Focado em Governança
            </h1>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-visible:ring-2 focus-visible:ring-bnb-orange outline-none"
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

      {/* ROTEAMENTO CONDICIONAL DAS TELAS */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        
        {appState === 'SELECTION' && (
          <DragDropZone onStartAnalysis={startAnalysisPipeline} />
        )}

        {appState === 'ANALYZING' && (
          <AnalysisDashboard 
            projectIds={selectedProjectIds} 
            onReviewProject={openDecisionPanel}
            onCancel={resetToStart}
          />
        )}

        {appState === 'DECISION' && activeProjectToReview && (
          <DecisionPanel 
            projectData={activeProjectToReview}
            onBack={goBackToDashboard}
            onSaveDecision={saveFinalDecision}
          />
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