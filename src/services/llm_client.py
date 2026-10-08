import json
import httpx
import logging
from typing import Dict, Any
from src.core.config import settings
from src.core.exceptions import LLMValidationError, EngineProcessingError

logger = logging.getLogger(__name__)

class LLMClient:
    """Cliente assíncrono para comunicação com a API do Modelo de Linguagem."""
    
    def __init__(self):
        # Utiliza uma base URL padrão (OpenAI compatível), ajustável via env vars
        self.api_key = settings.LLM_API_KEY
        self.model = settings.LLM_MODEL_NAME
        self.base_url = "https://api.openai.com/v1/chat/completions" # Pode ser trocado para Groq, etc.

    async def analyze_with_governance(self, system_prompt: str, data_context: str) -> Dict[str, Any]:
        """Envia o contexto para o LLM e força uma saída JSON rigorosa."""
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": data_context}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.0 # Temperatura ZERO para máxima consistência determinística (zero criatividade)
        }

        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                logger.info(f"Enviando dados para o modelo {self.model}...")
                response = await client.post(self.base_url, headers=headers, json=payload)
                
                if response.status_code != 200:
                    error_detail = response.text
                    logger.error(f"Erro na API do LLM: {error_detail}")
                    raise EngineProcessingError(f"O provedor de IA falhou com status {response.status_code}")
                
                result_data = response.json()
                raw_json_content = result_data["choices"][0]["message"]["content"]
                
                # Transforma a string JSON de volta num dicionário Python
                return json.loads(raw_json_content)
                
        except json.JSONDecodeError as e:
            logger.error(f"LLM devolveu um JSON inválido: {str(e)}")
            raise LLMValidationError("A resposta da IA não é um JSON válido.")
        except httpx.RequestError as e:
            logger.error(f"Erro de rede ao contactar LLM: {str(e)}")
            raise EngineProcessingError("Falha de rede ao contactar a API de IA.")