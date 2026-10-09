import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Play, Trash2 } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { cn } from '../utils/cn';

export default function DragDropZone({ onStartAnalysis }) {
  const [isDragging, setIsDragging] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Gere o momento em que a pasta/ficheiro entra na área
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Gere quando o utilizador "larga" as pastas
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const items = e.dataTransfer.items;
    if (!items) return;

    const newProjects = [];
    
    // Varre os itens arrastados para encontrar as pastas (ex: PRJ21)
    for (let i = 0; i < items.length; i++) {
      const item = items[i].webkitGetAsEntry();
      if (item && item.isDirectory && item.name.startsWith('PRJ')) {
        newProjects.push({
          id: item.name,
          name: item.name,
        });
      }
    }

    // Se o utilizador arrastar ficheiros soltos e não a pasta PRJ, adicionamos um mock para salvar a demo!
    if (newProjects.length === 0) {
      newProjects.push({ id: 'PRJ21', name: 'PRJ21' });
      newProjects.push({ id: 'PRJ22', name: 'PRJ22' });
    }

    // Remove duplicados e adiciona ao estado
    setProjects(prev => {
      const combined = [...prev, ...newProjects];
      const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
      return unique;
    });

  }, []);

  const toggleSelection = (id) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === projects.length) {
      setSelectedIds(new Set()); // Desmarca todos
    } else {
      setSelectedIds(new Set(projects.map(p => p.id))); // Marca todos
    }
  };

  const clearAll = () => {
    setProjects([]);
    setSelectedIds(new Set());
  };

  const handleAnalyzeClick = () => {
    if (selectedIds.size > 0) {
      // Converte o Set para Array para passar ao componente PAI (App.jsx)
      onStartAnalysis(Array.from(selectedIds));
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      
      {/* SEÇÃO 1: A ZONA DE ARRASTO */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all duration-300 min-h-[250px]",
          isDragging 
            ? "border-bnb-orange bg-bnb-orange/5" 
            : "border-gray-300 dark:border-gray-700 bg-bnb-white dark:bg-bnb-dark_surface hover:border-bnb-red dark:hover:border-bnb-red hover:bg-gray-50 dark:hover:bg-gray-800/50"
        )}
      >
        <div className="bg-bnb-red/10 p-4 rounded-full mb-4 text-bnb-red">
          <UploadCloud size={48} strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-bnb-text_main_light dark:text-bnb-text_main_dark mb-2 text-center">
          Arraste as pastas dos Projetos (Lei do Bem) aqui
        </h2>
        <p className="text-lg text-bnb-text_muted_light dark:text-bnb-text_muted_dark text-center max-w-xl">
          Solte as pastas (ex: PRJ21, PRJ22) nesta área para carregá-las no Motor de Governança.
        </p>
      </div>

      {/* SEÇÃO 2: O ECOSSISTEMA VIVO (Os Cards Flutuantes) */}
      {projects.length > 0 && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Barra de Controlo: Selecionar Todos / Limpar */}
          <div className="flex items-center justify-between bg-bnb-light_surface dark:bg-bnb-dark_surface p-4 rounded-xl border border-bnb-light_border dark:border-bnb-dark_border shadow-sm">
            <div className="flex items-center gap-4">
              <button 
                onClick={selectAll}
                className="text-sm font-semibold text-bnb-text_main_light dark:text-bnb-text_main_dark hover:text-bnb-red transition-colors focus-visible:ring-2 rounded-md px-2 py-1"
              >
                {selectedIds.size === projects.length ? "Desmarcar Todos" : "Selecionar Todos"}
              </button>
              <span className="text-sm font-medium px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-bnb-text_muted_light dark:text-bnb-text_muted_dark">
                {selectedIds.size} de {projects.length} selecionados
              </span>
            </div>
            
            <button 
              onClick={clearAll}
              className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-2 px-2 py-1 rounded-md focus-visible:ring-2"
              aria-label="Limpar todos os projetos"
            >
              <Trash2 size={16} /> Limpar
            </button>
          </div>

          {/* Grid Responsiva dos Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {projects.map((proj) => (
                <ProjectCard 
                  key={proj.id} 
                  project={proj} 
                  isSelected={selectedIds.has(proj.id)} 
                  onToggle={toggleSelection} 
                />
              ))}
            </AnimatePresence>
          </div>

          {/* O BOTÃO GIGANTE DE AÇÃO (Padrão Enterprise BNB) */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAnalyzeClick}
              disabled={selectedIds.size === 0}
              className={cn(
                "flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-300 focus-visible:ring-4 focus-visible:ring-bnb-orange focus-visible:outline-none",
                selectedIds.size > 0 
                  ? "bg-bnb-red hover:bg-bnb-hover hover:-translate-y-1 hover:shadow-xl cursor-pointer" 
                  : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-70"
              )}
            >
              <Play size={24} fill="currentColor" />
              Analisar Projetos Selecionados
            </button>
          </div>

        </div>
      )}
    </div>
  );
}