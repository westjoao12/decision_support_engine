import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertTriangle, ArrowRight, Activity } from 'lucide-react';
import { cn } from '../utils/cn';

export default function AnalysisDashboard({ projectIds, onReviewProject, onCancel }) {
  const [status, setStatus] = useState('PROCESSING'); // PROCESSING, COMPLETED
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [currentAction, setCurrentAction] = useState("Inicializando motor de extração...");

  // SIMULAÇÃO DO POLLING DO BACKEND (O Mágico de Oz Técnico para a Demo)
  // Num ambiente real, aqui faríamos chamadas fetch() para a nossa API FastAPI (GET /jobs/{job_id}/status)
  useEffect(() => {
    let currentProgress = 0;
    const total = projectIds.length;
    const interval = setInterval(() => {
      currentProgress += 1;
      
      const percentage = Math.floor((currentProgress / total) * 100);
      setProgress(percentage);

      // Feedback visual do que o motor está a fazer (Terminologia de Governança)
      const actions = [
        "Extraindo metadados relacionais...",
        "Cruzando planilhas de resultados...",
        "Consolidando textos de dossiês...",
        "Validando critérios do Manual de Frascati...",
        "Aferindo rastreabilidade estrutural...",
      ];
      setCurrentAction(actions[currentProgress % actions.length]);

      if (currentProgress >= total) {
        clearInterval(interval);
        setStatus('COMPLETED');
        
        // Simulação do JSON de resposta (O "Gabarito" que o Backend retorna)
        const mockResults = projectIds.map((id, index) => ({
          projeto_id: id,
          titulo: id === "PRJ01" ? "Reprocessamento seguro de mensagens" : `Projeto de Integração ${id}`,
          classificacao: index % 2 === 0 ? "Não elegível" : "Elegível",
          justificativa: "A adequação de configuração não caracteriza incerteza tecnológica segundo o Manual de Frascati. Os desvios registrados são resolvidos por configuração existente.",
          fontes_decisivas: "evidencias/metodo.md | evidencias/medicoes.csv",
          limite: "Aceite limitado aos conectores e à janela configurada."
        }));
        
        setResults(mockResults);
      }
    }, 1500); // 1.5 segundos por projeto para dar aquele efeito de "Processamento Pesado"

    return () => clearInterval(interval);
  }, [projectIds]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-500 min-h-[500px]">
      
      {/* ESTADO 1: PROCESSANDO */}
      {status === 'PROCESSING' && (
        <div className="flex flex-col items-center max-w-lg w-full bg-bnb-white dark:bg-bnb-dark_surface p-10 rounded-2xl shadow-sm border border-bnb-light_border dark:border-bnb-dark_border">
          
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-bnb-orange/20 rounded-full blur-xl animate-pulse"></div>
            <Activity size={64} className="text-bnb-orange relative z-10 animate-bounce" strokeWidth={1.5} />
          </div>
          
          <h2 className="text-2xl font-bold text-bnb-text_main_light dark:text-bnb-text_main_dark mb-2 text-center">
            Processando {projectIds.length} projeto(s)...
          </h2>
          
          <p className="text-bnb-text_muted_light dark:text-bnb-text_muted_dark mb-8 text-center h-6 italic">
            {currentAction}
          </p>

          {/* Barra de Progresso Acessível */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
            <motion.div 
              className="bg-bnb-red h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between w-full text-sm font-bold text-gray-500">
            <span>{progress}% Concluído</span>
            <span>Rastreabilidade Ativa</span>
          </div>
          
          <button 
            onClick={onCancel}
            className="mt-8 text-sm text-gray-500 hover:text-bnb-red transition-colors font-medium focus-visible:ring-2 p-2 rounded-md"
          >
            Cancelar Processamento Lote
          </button>
        </div>
      )}

      {/* ESTADO 2: CONCLUÍDO (Lista de Projetos para Revisão) */}
      {status === 'COMPLETED' && (
        <div className="w-full flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-bnb-text_main_light dark:text-bnb-text_main_dark mb-1 flex items-center gap-3">
                <CheckCircle className="text-green-500" size={32} />
                Lote Processado com Sucesso
              </h2>
              {/* ATUALIZAÇÃO CIRÚRGICA: Remoção do estigma de IA */}
              <p className="text-lg text-bnb-text_muted_light dark:text-bnb-text_muted_dark">
                O Motor de Extração consolidou as evidências. Aguardando decisão e assinatura humana.
              </p>
            </div>
            <button 
              onClick={onCancel}
              className="text-bnb-text_muted_light hover:text-bnb-text_main_light dark:hover:text-bnb-white transition-colors"
            >
              Voltar ao Início
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((proj, idx) => (
              <motion.div 
                key={proj.projeto_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-bnb-white dark:bg-bnb-dark_surface rounded-xl border border-bnb-light_border dark:border-bnb-dark_border p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-bnb-text_main_light dark:text-bnb-text_main_dark">
                      {proj.projeto_id}
                    </h3>
                    
                    {/* Badge Visual */}
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                      proj.classificacao === 'Elegível' 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                      Sugestão: {proj.classificacao}
                    </span>
                  </div>
                  <p className="text-sm text-bnb-text_muted_light dark:text-bnb-text_muted_dark mb-4 line-clamp-2">
                    {proj.titulo}
                  </p>
                </div>
                
                <button
                  onClick={() => onReviewProject(proj)}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-bnb-red hover:text-white dark:bg-gray-800 dark:hover:bg-bnb-red text-bnb-text_main_light dark:text-white rounded-lg transition-all font-semibold focus-visible:ring-2 focus-visible:ring-bnb-orange outline-none group border border-gray-200 dark:border-gray-700 hover:border-transparent"
                >
                  Revisar e Decidir
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}