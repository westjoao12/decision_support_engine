from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Decision Support Engine - Lei do Bem"
    VERSION: str = "2.0.0" # Atualizado para refletir a nova arquitetura
    API_V1_STR: str = "/api/v1"
    
    # Configurações do LLM (A serem preenchidas no ambiente real)
    LLM_API_KEY: str = "sua_chave_api_aqui"
    LLM_MODEL_NAME: str = "gpt-4-turbo" # Ou claude-3, gemini-1.5, etc.
    
    # Tolerâncias e timeouts do motor
    BATCH_PROCESS_TIMEOUT_SECONDS: int = 300

    class Config:
        case_sensitive = True
        env_file = ".env" # Lê as variáveis de um ficheiro .env se existir

settings = Settings()