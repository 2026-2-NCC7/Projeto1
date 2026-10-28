import logging
import numpy as np
from typing import List, Dict, Any, Optional
from app.config import settings

logger = logging.getLogger(__name__)

class SemanticEmbedder:
    """
    Semantic embeddings using intfloat/multilingual-e5-small via sentence-transformers.
    Follows e5 specification:
    - "query: " for queries / job requirements
    - "passage: " for documents / candidate text / skill descriptions
    """

    def __init__(self, model_name: Optional[str] = None, device: Optional[str] = None):
        self.model_name = model_name or settings.EMBEDDING_MODEL_NAME
        self.device = device or settings.EMBEDDING_DEVICE
        self._model = None
        self._initialization_error = None

    def _get_model(self):
        if self._model is None and self._initialization_error is None:
            try:
                import os
                from sentence_transformers import SentenceTransformer
                logger.info(f"Loading SentenceTransformer '{self.model_name}' on {self.device}...")
                try:
                    # Attempt loading from local cache first to prevent SSL issues or network delays
                    self._model = SentenceTransformer(self.model_name, device=self.device, local_files_only=True)
                except Exception as local_err:
                    logger.info(f"Local cache load attempt ({local_err}), trying standard download...")
                    self._model = SentenceTransformer(self.model_name, device=self.device)
                logger.info("SentenceTransformer loaded successfully.")
            except Exception as e:
                self._initialization_error = str(e)
                logger.warning(f"Could not load SentenceTransformer '{self.model_name}': {e}")
        return self._model

    def is_available(self) -> bool:
        return self._get_model() is not None

    def encode_queries(self, queries: List[str]) -> np.ndarray:
        """Encodes search queries / job requirements using 'query: ' prefix."""
        prefixed = [f"query: {q.strip()}" for q in queries]
        return self._encode(prefixed)

    def encode_passages(self, passages: List[str]) -> np.ndarray:
        """Encodes candidate text / competencies using 'passage: ' prefix."""
        prefixed = [f"passage: {p.strip()}" for p in passages]
        return self._encode(prefixed)

    def _encode(self, texts: List[str]) -> np.ndarray:
        model = self._get_model()
        if model is None:
            # Deterministic fallback embedding representation based on character hashes for offline testing
            logger.info("Using deterministic fallback vector embedding.")
            vectors = []
            dim = 384
            for t in texts:
                np.random.seed(abs(hash(t)) % (2**32))
                vec = np.random.randn(dim)
                vec = vec / np.linalg.norm(vec)
                vectors.append(vec)
            return np.array(vectors)

        embeddings = model.encode(texts, normalize_embeddings=True, show_progress_bar=False)
        return np.array(embeddings)

    @staticmethod
    def cosine_similarity(vec_a: np.ndarray, vec_b: np.ndarray) -> float:
        """Computes cosine similarity between two normalized vectors."""
        norm_a = np.linalg.norm(vec_a)
        norm_b = np.linalg.norm(vec_b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(np.dot(vec_a, vec_b) / (norm_a * norm_b))

class VectorStoreRepository:
    """
    Vector store abstraction: Currently in-memory, designed with modular interface
    to allow plugging in pgvector / PostgreSQL later without modifying business logic.
    """

    def __init__(self, embedder: SemanticEmbedder):
        self.embedder = embedder
        self.catalog_index: Dict[str, Dict[str, Any]] = {}

    def index_skill_catalog(self, skills: List[Dict[str, Any]]):
        """Indexes skill descriptions and aliases into memory."""
        self.catalog_index.clear()
        texts = []
        skill_ids = []

        for s in skills:
            # Combine skill name, description, and aliases into a descriptive passage
            alias_str = ", ".join(s.get("aliases", []))
            passage = f"{s['name']}. {s.get('description', '')}. Sinônimos: {alias_str}"
            texts.append(passage)
            skill_ids.append(s["id"])

        if texts:
            embeddings = self.embedder.encode_passages(texts)
            for i, skill_id in enumerate(skill_ids):
                self.catalog_index[skill_id] = {
                    "embedding": embeddings[i],
                    "metadata": skills[i]
                }
        logger.info(f"Indexed {len(self.catalog_index)} skills in vector store.")

    def search_similar_skills(self, query: str, top_k: int = 5, threshold: float = 0.65) -> List[Dict[str, Any]]:
        """Searches skills most semantically similar to a given query string."""
        if not self.catalog_index:
            return []

        query_emb = self.embedder.encode_queries([query])[0]
        results = []

        for skill_id, data in self.catalog_index.items():
            sim = self.embedder.cosine_similarity(query_emb, data["embedding"])
            if sim >= threshold:
                results.append({
                    "skill_id": skill_id,
                    "similarity": round(sim, 4),
                    "metadata": data["metadata"]
                })

        results.sort(key=lambda x: x["similarity"], reverse=True)
        return results[:top_k]

# Global singleton instance
embedder_service = SemanticEmbedder()
vector_store = VectorStoreRepository(embedder_service)
