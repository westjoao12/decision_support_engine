import React, { useState } from 'react';
import { FileText, CheckCircle, AlertTriangle, Save, ChevronLeft, Link as LinkIcon } from 'lucide-react';
import { cn } from '../utils/cn';

export default function DecisionPanel({ projectData, onBack, onSaveDecision }) {
  // O Estado é inicializado com a recomendação da IA, mas o Humano PODE e DEVE editar.
  const [decision, setDecision] = useState({
    classificacao: projectData.classificacao || "Pendente",
    justificativa: projectData.justificativa || "",
    fontes_decisivas: projectData.fontes_decisivas || "",
    limite: projectData.limite || ""
  });

  const handleChange = (field, value) => {
    setDecision(prev => ({ ...prev, [field]: value }));
  };

  const handleSign = () => {
    onSaveDecision({ ...projectData, finalDecision: decision });
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Barra Superior de Navegação */}
      <div className="flex items-center justify-between bg-bnb-white dark:bg-bnb-dark_surface p-4 rounded-xl border border-bnb-light_border dark:border-bnb-dark_border shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-bnb-orange"
            aria-label="Voltar para a lista de projetos"
          >
            <ChevronLeft size={24} className="text-bnb-text_main_light dark:text-bnb-text_main_dark" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-bnb-text_main_light dark:text-bnb-text_main_dark">
              {projectData.projeto_id} - Auditoria de Projeto
            </h2>
            <p className="text-sm text-bnb-text_muted_light dark:text-bnb-text_muted_dark">
              {projectData.titulo || "Título não extraído"}
            </p>
          </div>
        </div>
      </div>

      {/* O SPLIT-SCREEN (Ecrã Dividido) */}
      <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[600px]">
        
        {/* LADO ESQUERDO: Evidências e Dados Crus (O que o Motor encontrou) */}
        <div className="flex-1 bg-bnb-light_bg dark:bg-[#181818] rounded-xl border border-bnb-light_border dark:border-bnb-dark_border p-6 overflow-y-auto shadow-inner">
          <h3 className="text-xl font-bold text-bnb-text_main_light dark:text-bnb-text_main_dark mb-4 flex items-center gap-2">
            <FileText size={20} className="text-bnb-orange" />
            Rastreabilidade e Evidências
          </h3>
          
          <div className="space-y-6">
            <div className="p-4 bg-bnb-white dark:bg-bnb-dark_surface rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">Trecho do Dossiê</h4>
              <p className="text-bnb-text_main_light dark:text-bnb-text_main_dark text-sm leading-relaxed">
                "...Uma interrupção fazia a mesma confirmação chegar duas vezes ao conciliador. Como aplicar idempotência conhecida ao reenvio de mensagens sem bloquear pagamentos legítimos?..."
              </p>
            </div>

            <div className="p-4 bg-bnb-white dark:bg-bnb-dark_surface rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">Provas Matemáticas Encontradas</h4>
              <ul className="text-sm space-y-2 text-bnb-text_main_light dark:text-bnb-text_main_dark">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>resultados.csv (Ensaio PRJ01-S01):</strong> 8 duplicatas retidas. Base: 12. Taxa: 66.6%</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>atividades.xlsx (Linha 5):</strong> Fase de Caracterização concluída pela Engenharia de Mensageria.</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700/50">
              <h4 className="font-bold text-sm text-yellow-700 dark:text-yellow-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <AlertTriangle size={16} /> Ponto de Atenção da IA
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-400">
                O manual anterior já descrevia o recurso aplicado. A adequação de configuração não caracteriza incerteza tecnológica segundo o Manual de Frascati.
              </p>
            </div>
          </div>
        </div>

        {/* LADO DIREITO: O Formulário de Decisão (A Canetada do Humano) */}
        <div className="flex-1 bg-bnb-white dark:bg-bnb-dark_surface rounded-xl border-2 border-bnb-red/20 shadow-md p-6 flex flex-col">
          <h3 className="text-xl font-bold text-bnb-red dark:text-bnb-red mb-6">
            Parecer de Governança
          </h3>
          
          <div className="flex-1 space-y-5">
            {/* Campo 1: Classificação */}
            <div>
              <label className="block text-sm font-bold text-bnb-text_main_light dark:text-bnb-text_main_dark mb-2">
                Classificação Final (Revisão Humana)
              </label>
              <select 
                value={decision.classificacao}
                onChange={(e) => handleChange("classificacao", e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E1E1E] text-bnb-text_main_light dark:text-bnb-text_main_dark focus:ring-2 focus:ring-bnb-orange focus:border-transparent outline-none transition-shadow"
              >
                <option value="Elegível">Elegível</option>
                <option value="Com ressalvas">Com ressalvas</option>
                <option value="Não elegível">Não elegível</option>
                <option value="Evidência insuficiente">Evidência insuficiente</option>
              </select>
            </div>

            {/* Campo 2: Justificativa */}
            <div>
              <label className="block text-sm font-bold text-bnb-text_main_light dark:text-bnb-text_main_dark mb-2">
                Justificativa Técnica
              </label>
              <textarea 
                value={decision.justificativa}
                onChange={(e) => handleChange("justificativa", e.target.value)}
                rows={4}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E1E1E] text-bnb-text_main_light dark:text-bnb-text_main_dark focus:ring-2 focus:ring-bnb-orange focus:border-transparent outline-none resize-none transition-shadow"
                placeholder="Descreva o embasamento da decisão..."
              />
            </div>

            {/* Campo 3: Limites / Ressalvas */}
            <div>
              <label className="block text-sm font-bold text-bnb-text_main_light dark:text-bnb-text_main_dark mb-2">
                Limites e Ressalvas
              </label>
              <input 
                type="text"
                value={decision.limite}
                onChange={(e) => handleChange("limite", e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E1E1E] text-bnb-text_main_light dark:text-bnb-text_main_dark focus:ring-2 focus:ring-bnb-orange focus:border-transparent outline-none transition-shadow"
                placeholder="Ex: Aceite limitado aos conectores configurados..."
              />
            </div>

            {/* Campo 4: Fontes Decisivas */}
            <div>
              <label className="block text-sm font-bold text-bnb-text_main_light dark:text-bnb-text_main_dark mb-2 flex items-center gap-2">
                <LinkIcon size={16} /> Fontes Decisivas (Rastreabilidade)
              </label>
              <input 
                type="text"
                value={decision.fontes_decisivas}
                onChange={(e) => handleChange("fontes_decisivas", e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E1E1E] text-bnb-text_main_light dark:text-bnb-text_main_dark focus:ring-2 focus:ring-bnb-orange focus:border-transparent outline-none font-mono text-sm transition-shadow"
                placeholder="ex: evidencias/metodo.md | evidencias/medicoes.csv"
              />
            </div>
          </div>

          {/* O BOTÃO FINAL */}
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={handleSign}
              className="w-full flex items-center justify-center gap-2 py-4 bg-bnb-red hover:bg-bnb-hover text-white font-bold text-lg rounded-xl transition-transform hover:-translate-y-1 shadow-lg focus-visible:ring-4 focus-visible:ring-bnb-orange outline-none"
            >
              <Save size={24} />
              Assinar Parecer e Exportar
            </button>
            <p className="text-center text-xs text-gray-500 mt-3">
              Ao assinar, o sistema regista a sua matrícula e imutabiliza este registo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}