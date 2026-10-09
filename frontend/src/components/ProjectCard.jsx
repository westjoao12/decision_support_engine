import React from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, CheckCircle } from 'lucide-react';
import { cn } from '../utils/cn';

export default function ProjectCard({ project, isSelected, onToggle }) {
  return (
    <motion.div
      // Efeito de entrada suave
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // Efeito de flutuação ao passar o rato
      whileHover={{ y: -5, scale: 1.02 }}
      // Transição fluida (Spring physics)
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative flex flex-col p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer shadow-sm",
        "bg-bnb-light_surface dark:bg-bnb-dark_surface",
        // Lógica visual: Se selecionado, ganha a borda vermelha e sombra maior
        isSelected 
          ? "border-bnb-red shadow-md dark:shadow-bnb-red/20" 
          : "border-bnb-light_border dark:border-bnb-dark_border hover:border-bnb-orange hover:shadow-float dark:hover:shadow-float-dark"
      )}
      onClick={() => onToggle(project.id)}
      role="button"
      aria-pressed={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle(project.id);
        }
      }}
    >
      {/* Checkbox Acessível (Visível e interativa) */}
      <div className="absolute top-4 right-4">
        <div className={cn(
          "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors",
          isSelected 
            ? "bg-bnb-red border-bnb-red text-white" 
            : "border-gray-400 dark:border-gray-500 bg-transparent"
        )}>
          {isSelected && <CheckCircle size={16} strokeWidth={3} />}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className={cn(
          "p-2 rounded-lg",
          isSelected ? "bg-bnb-red/10 text-bnb-red" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
        )}>
          <FolderOpen size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-bnb-text_main_light dark:text-bnb-text_main_dark">
            {project.name}
          </h3>
          <p className="text-sm text-bnb-text_muted_light dark:text-bnb-text_muted_dark font-medium">
            Pronto para análise
          </p>
        </div>
      </div>
    </motion.div>
  );
}