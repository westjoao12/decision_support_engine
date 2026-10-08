from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Decision Support Engine - Lei do Bem"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Configurações do LLM (A serem preenchidas no ambiente real)
    LLM_API_KEY: str = "sua_chave_api_aqui"
    LLM_MODEL_NAME: str = "gpt-4-turbo" 
    
    # Tolerâncias e timeouts do motor
    BATCH_PROCESS_TIMEOUT_SECONDS: int = 300

    # NOVA ABORDAGEM PYDANTIC V2+ (Substitui a antiga 'class Config:')
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()