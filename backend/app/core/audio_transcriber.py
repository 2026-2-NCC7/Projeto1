import os
import logging
from typing import Dict, Any, List, Optional
from app.config import settings

logger = logging.getLogger(__name__)

class AudioTranscriber:
    """
    Audio transcriber using faster-whisper with int8 quantization on CPU.
    """

    def __init__(self, model_size: Optional[str] = None, device: Optional[str] = None, compute_type: Optional[str] = None):
        self.model_size = model_size or settings.WHISPER_MODEL_SIZE
        self.device = device or settings.WHISPER_DEVICE
        self.compute_type = compute_type or settings.WHISPER_COMPUTE_TYPE
        self._model = None
        self._initialization_error = None

    def _get_model(self):
        if self._model is None and self._initialization_error is None:
            try:
                from faster_whisper import WhisperModel
                logger.info(f"Loading faster-whisper model '{self.model_size}' on {self.device} ({self.compute_type})...")
                try:
                    self._model = WhisperModel(
                        self.model_size,
                        device=self.device,
                        compute_type=self.compute_type,
                        local_files_only=True
                    )
                except Exception:
                    self._model = WhisperModel(
                        self.model_size,
                        device=self.device,
                        compute_type=self.compute_type
                    )
                logger.info("faster-whisper loaded successfully.")
            except Exception as e:
                self._initialization_error = str(e)
                logger.warning(f"Could not load faster-whisper: {e}")
        return self._model

    def is_available(self) -> bool:
        return self._get_model() is not None

    def transcribe(self, audio_file_path: str, language: str = "pt") -> Dict[str, Any]:
        """
        Transcribes the given audio file, returning raw transcript, segments, and metadata.
        """
        if not os.path.exists(audio_file_path):
            raise FileNotFoundError(f"Audio file not found: {audio_file_path}")

        model = self._get_model()

        if model is None:
            # Fallback for demonstration / local testing when faster-whisper model cannot be loaded
            logger.warning(f"Transcriber model unavailable ({self._initialization_error}). Using fallback simulation.")
            return {
                "raw_transcript": "[Transcriber Model Offline] Áudio recebido e registrado para processamento posterior.",
                "segments": [{"start": 0.0, "end": 1.0, "text": "[Transcriber Model Offline]"}],
                "language": language,
                "model_name": f"fallback-offline-{self.model_size}",
                "compute_type": self.compute_type
            }

        try:
            segments, info = model.transcribe(
                audio_file_path,
                language=language,
                beam_size=5,
                vad_filter=True,
                vad_parameters=dict(min_silence_duration_ms=500)
            )

            segment_list: List[Dict[str, Any]] = []
            full_text_parts: List[str] = []

            for seg in segments:
                text = seg.text.strip()
                if text:
                    segment_list.append({
                        "start": round(seg.start, 2),
                        "end": round(seg.end, 2),
                        "text": text
                    })
                    full_text_parts.append(text)

            raw_transcript = " ".join(full_text_parts)

            return {
                "raw_transcript": raw_transcript,
                "segments": segment_list,
                "language": info.language,
                "duration": round(info.duration, 2),
                "model_name": f"faster-whisper-{self.model_size}",
                "compute_type": self.compute_type
            }

        except Exception as e:
            logger.error(f"Error during audio transcription: {e}")
            raise RuntimeError(f"Transcription failed: {e}")

# Global singleton instance
transcriber_service = AudioTranscriber()
