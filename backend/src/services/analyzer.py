import json
import logging
from pathlib import Path
from pydantic import ValidationError
from backend.src.services.parsers.dossier_assembler import DossierAssembler
from backend.src.services.llm_client import LLMClient
from backend.src.models.schemas import AnalysisResult
from backend.src.core.exceptions import EngineProcessingError, LLMValidationError

logger = logging.getLogger(__name__)

class FrascatiEngine:
    """
    O Motor Principal do Sistema. 
    Orquestra a extração (ETL), a análise semântica (LLM) e a validação de Governança (Pydantic).
    """
    
    def __init__(self):
        self.assembler = DossierAssembler()
        self.llm_client = LLMClient()

    def _build_system_prompt(self) -> str:
        """Gera as regras estritas que a IA deve seguir. É o 'Cão de Guarda'."""
        schema = AnalysisResult.model_json_schema()
        return f"""
        És um auditor técnico especializado no Manual de Frascati e na Lei do Bem (Lei nº 11.196/2005).
        A tua função é apoiar a decisão humana. A tua análise deve ser estritamente baseada nos dados fornecidos.
        
        REGRAS DE GOVERNANÇA CRÍTICAS:
        1. A classificação deve ser APENAS uma de: "Elegível", "Com ressalvas", "Não elegível", "Evidência insuficiente".
        2. A lógica é relacional. Deves cruzar as afirmações dos PDFs (Dossiê, Entrevista) com as provas matemáticas nos CSVs (medicoes.csv, resultados.csv).
        3. Nunca inventes dados. Cita explicitamente a fonte através do identificador do arquivo (ex: evidencias/medicoes.csv#PRJ21-S01).
        4. O 'limite' é obrigatório se a classificação for 'Com ressalvas'.
        
        FORMATO DE SAÍDA EXIGIDO:
        Deves devolver APENAS um objeto JSON rigorosamente aderente a este schema (sem markdown):
        {json.dumps(schema, ensure_ascii=False)}
        """

    async def analyze_project_async(self, folder_path: Path, project_id: str) -> AnalysisResult:
        """Processa um único projeto de ponta a ponta de forma assíncrona."""
        try:
            # 1. ETL: Extração e Montagem do Dossiê Relacional
            context_data = self.assembler.assemble_from_folder(folder_path, project_id)
            
            # Se a pasta estiver vazia ou não tiver os ficheiros críticos, rejeitamos logo.
            if not context_data.get("inventario"):
                raise EngineProcessingError(f"O projeto {project_id} não possui ficheiros válidos para análise.")

            # Converte o contexto Python para JSON string para o LLM
            data_context = json.dumps(context_data, ensure_ascii=False)
            system_prompt = self._build_system_prompt()

            # 2. IA: Avaliação Semântica
            llm_response_dict = await self.llm_client.analyze_with_governance(system_prompt, data_context)
            
            # 3. Governança: Validação do Contrato Pydantic
            # Tenta converter o dicionário cru da IA no nosso Schema rígido.
            try:
                validated_result = AnalysisResult(**llm_response_dict)
                logger.info(f"Projeto {project_id} processado e validado com sucesso!")
                return validated_result
            except ValidationError as ve:
                logger.error(f"Erro de Governança! IA desrespeitou o contrato no projeto {project_id}: {ve.errors()}")
                raise LLMValidationError(f"IA falhou no esquema de validação: {str(ve)}")

        except Exception as e:
            logger.error(f"Falha terminal no processamento do projeto {project_id}: {str(e)}")
            raise EngineProcessingError(str(e))