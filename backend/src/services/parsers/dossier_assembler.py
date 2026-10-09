from pathlib import Path
from typing import Dict, Any
import logging
from src.services.parsers.document_parser import DocumentParser
from src.services.parsers.spreadsheet_parser import SpreadsheetParser

logger = logging.getLogger(__name__)

class DossierAssembler:
    """Mapeia e consolida os ficheiros físicos de uma pasta num único contexto de dados."""
    
    def __init__(self):
        self.doc_parser = DocumentParser()
        self.sheet_parser = SpreadsheetParser()

    def assemble_from_folder(self, folder_path: Path, project_id: str) -> Dict[str, Any]:
        logger.info(f"Iniciando montagem do dossiê para: {project_id}")
        
        context = {
            "project_id": project_id,
            "inventario": [],
            "atividades": [],
            "medicoes": [],
            "resultados": [],
            "textos_pdf": {}
        }
        
        # 1. Ler Metadados Relacionais da Raiz
        inv_path = folder_path / "inventario_evidencias.csv"
        context["inventario"] = self.sheet_parser.read_csv(inv_path)
        
        ativ_path = folder_path / "atividades.xlsx"
        context["atividades"] = self.sheet_parser.read_excel(ativ_path, header=4) # Cabeçalho na linha 5
        
        # 2. Ler Ficheiros de Prova Matemática (Pasta 'evidencias')
        evidencias_dir = folder_path / "evidencias"
        if evidencias_dir.exists():
            med_path = evidencias_dir / "medicoes.csv"
            context["medicoes"] = self.sheet_parser.read_csv(med_path)
            
            res_path = evidencias_dir / "resultados.csv"
            context["resultados"] = self.sheet_parser.read_csv(res_path)

        # 3. Ler PDFs Essenciais (Dossiê e Entrevista)
        dossie_path = folder_path / "dossie_projeto.pdf"
        if dossie_path.exists():
            context["textos_pdf"]["dossie"] = self.doc_parser.extract_text(dossie_path)
            
        entrevista_path = folder_path / "transcricao_entrevista_tecnica.pdf"
        if entrevista_path.exists():
            context["textos_pdf"]["entrevista"] = self.doc_parser.extract_text(entrevista_path)

        return context