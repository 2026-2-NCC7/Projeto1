import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parent.parent / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    APP_NAME: str = "Q.I. Tech Matchmaker Engine"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
    HOST: str = "127.0.0.1"
    PORT: int = 8000

    DATABASE_URL: str = "sqlite:///./qi_matchmaker.db"

    # Whisper Settings
    WHISPER_MODEL_SIZE: str = "small"
    WHISPER_DEVICE: str = "cpu"
    WHISPER_COMPUTE_TYPE: str = "int8"
    WHISPER_LANGUAGE: str = "pt"

    # Ollama / Qwen3 Settings
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "qwen3:4b"
    OLLAMA_TIMEOUT_SECONDS: int = 60

    # Embeddings Settings
    EMBEDDING_MODEL_NAME: str = "intfloat/multilingual-e5-small"
    EMBEDDING_DEVICE: str = "cpu"

    # Matching Weights
    WEIGHT_HARD_SKILLS: float = 0.50
    WEIGHT_SOFT_SKILLS: float = 0.25
    WEIGHT_EXPERIENCE: float = 0.15
    WEIGHT_CONDITIONS: float = 0.10

    # Storage & Audio
    STORAGE_DIR: str = "./storage"
    AUDIO_RETENTION_DAYS: int = 30
    MAX_AUDIO_SIZE_MB: int = 25

    ALLOW_OFFLINE_FALLBACK: bool = True

settings = Settings()

# Ensure storage directory exists
storage_path = Path(settings.STORAGE_DIR)
storage_path.mkdir(parents=True, exist_ok=True)
audio_dir = storage_path / "audio"
audio_dir.mkdir(parents=True, exist_ok=True)
