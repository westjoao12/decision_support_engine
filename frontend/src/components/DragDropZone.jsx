import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Play, Trash2 } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { cn } from '../utils/cn';

export default function DragDropZone({ onStartAnalysis }) {
  const [isDragging, setIsDragging] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  
  // Referência para o input de ficheiros escondido
  const fileInputRef = useRef(null);

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

  // 1. Processamento via DRAG AND DROP
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const items = e.dataTransfer.items;
    if (!items) return;

    const newProjects = [];
    let droppedFiles = false;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i].webkitGetAsEntry();
      if (item) {
        if (item.isDirectory) {
          newProjects.push({ id: item.name, name: item.name });
        } else {
          droppedFiles = true;
        }
      }
    }

    if (droppedFiles) {
      alert("⚠️ Ação inválida: Por favor, arraste a PASTA completa do projeto, e não ficheiros soltos.");
    }

    setProjects(prev => {
      const combined = [...prev, ...newProjects];
      return combined.filter((v, idx, a) => a.findIndex(t => t.id === v.id) === idx);
    });
  }, []);

  // 2. Processamento via EXPLORADOR DE ARQUIVOS (O clique)
  const handleFileInput = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const rootFolders = new Set();
    
    // Quando selecionamos diretórios, o browser lê todos os ficheiros internos.
    // O caminho vem como "PRJ21/evidencias/medicoes.csv". 
    // Nós só precisamos de extrair o nome da pasta raiz ("PRJ21").
    for (let i = 0; i < files.length; i++) {
      const pathParts = files[i].webkitRelativePath.split('/');
      if (pathParts.length > 1) {
        rootFolders.add(pathParts[0]); 
      }
    }

    const newProjects = Array.from(rootFolders).map(folderName => ({
      id: folderName,
      name: folderName
    }));

    setProjects(prev => {
      const combined = [...prev, ...newProjects];
      return combined.filter((v, idx, a) => a.findIndex(t => t.id === v.id) === idx);
    });

    // Limpa o input escondido para permitir recarregar a mesma pasta se necessário
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleZoneClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(projects.map(p => p.id)));
    }
  };

  const clearAll = () => {
    setProjects([]);
    setSelectedIds(new Set());
  };

  const handleAnalyzeClick = () => {
    if (selectedIds.size > 0) {
      onStartAnalysis(Array.from(selectedIds));
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      
      {/* Input de diretório escondido */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileInput} 
        style={{ display: 'none' }} 
        webkitdirectory="true" 
        directory="true" 
        multiple 
      />

      {/* SEÇÃO 1: A ZONA CLICÁVEL E DE ARRASTO */}
      <div
        onClick={handleZoneClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all duration-300 min-h-[250px] cursor-pointer",
          isDragging 
            ? "border-bnb-orange bg-bnb-orange/5" 
            : "border-gray-300 dark:border-gray-700 bg-bnb-white dark:bg-bnb-dark_surface hover:border-bnb-red dark:hover:border-bnb-red hover:bg-gray-50 dark:hover:bg-gray-800/50"
        )}
      >
        <div className="bg-bnb-red/10 p-4 rounded-full mb-4 text-bnb-red transition-transform duration-300 group-hover:scale-110">
          <UploadCloud size={48} strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-bnb-text_main_light dark:text-bnb-text_main_dark mb-2 text-center pointer-events-none">
          Arraste as pastas aqui ou Clique para selecionar
        </h2>
        <p className="text-lg text-bnb-text_muted_light dark:text-bnb-text_muted_dark text-center max-w-xl pointer-events-none">
          Selecione os projetos (Lei do Bem) do seu computador para iniciar o motor de rastreabilidade.
        </p>
      </div>

      {/* SEÇÃO 2: O ECOSSISTEMA VIVO */}
      {projects.length > 0 && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
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
            >
              <Trash2 size={16} /> Limpar
            </button>
          </div>

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