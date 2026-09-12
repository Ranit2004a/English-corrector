import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables or .env file."""
    
    # App Info
    APP_NAME: str = "AI English Speaking Coach Backend"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Gemini AI & Token Optimization
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"
    GEMINI_MAX_OUTPUT_TOKENS: int = 350
    GEMINI_TEMPERATURE: float = 0.4
    MAX_HISTORY_TURNS: int = 4
    ENABLE_RESPONSE_CACHE: bool = True
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]
    
    # Request limits
    MAX_MESSAGE_LENGTH: int = 2000
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
