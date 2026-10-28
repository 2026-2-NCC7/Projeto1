import re
import unicodedata
from enum import Enum
from typing import Tuple, Optional, List, Dict
from dataclasses import dataclass

class MatchType(str, Enum):
    """Classification of how the evidence was verified against the transcript."""
    EXACT = "EXACT"
    CASE_INSENSITIVE = "CASE_INSENSITIVE"
    NORMALIZED_LENIENT = "NORMALIZED_LENIENT"
    REJECTED = "REJECTED"

@dataclass(frozen=True)
class VerificationResult:
    """
    Immutable result object for evidence quote verification.
    Implements sequence unpacking (__iter__) for 100% backward compatibility
    with legacy calls expecting `is_valid, reason_or_match = verify_quote(...)`.
    """
    is_valid: bool
    detail: str
    match_type: MatchType
    confidence_score: float

    def __iter__(self):
        """Allows tuple unpacking: `is_valid, detail = result`."""
        yield self.is_valid
        yield self.detail

    def __getitem__(self, index: int):
        """Allows index access: `result[0]`, `result[1]`."""
        if index == 0:
            return self.is_valid
        elif index == 1:
            return self.detail
        raise IndexError("VerificationResult only supports indices 0 (is_valid) and 1 (detail).")

def clean_text(text: str) -> str:
    """Normalize whitespace and standard NFKC unicode strip."""
    if not text:
        return ""
    normalized = unicodedata.normalize("NFKC", text)
    return re.sub(r"\s+", " ", normalized).strip()

def clean_text_lenient(text: str) -> str:
    """Lowercase and remove accents/punctuation for lenient matching fallback."""
    cleaned = clean_text(text).lower()
    cleaned = "".join(
        c for c in unicodedata.normalize("NFD", cleaned)
        if unicodedata.category(c) != "Mn"
    )
    return re.sub(r"[^\w\s]", "", cleaned)

class EvidenceVerifier:
    """
    Extreme Programming Refactored Module:
    Verifies programmatically that an extracted evidence quote exists verbatim
    (or with normalized whitespace/case) in the candidate's actual interview transcript.
    Guarantees no LLM hallucinations of quotes and provides confidence scoring.
    """

    @classmethod
    def verify_quote(cls, quote: str, transcript_or_answer: str) -> VerificationResult:
        """
        Verifies if an extracted quote is legitimately present in the transcript.
        Returns a VerificationResult object that can be queried or unpacked as a (bool, str) tuple.
        """
        if not quote or not quote.strip():
            return VerificationResult(
                is_valid=False,
                detail="Citação de evidência vazia.",
                match_type=MatchType.REJECTED,
                confidence_score=0.0
            )

        if not transcript_or_answer or not transcript_or_answer.strip():
            return VerificationResult(
                is_valid=False,
                detail="Transcrição ou texto da resposta está vazio.",
                match_type=MatchType.REJECTED,
                confidence_score=0.0
            )

        quote_clean = clean_text(quote)
        transcript_clean = clean_text(transcript_or_answer)

        # Stage 1: Exact verbatim match (whitespace normalized)
        if quote_clean in transcript_clean:
            return VerificationResult(
                is_valid=True,
                detail=quote_clean,
                match_type=MatchType.EXACT,
                confidence_score=1.0
            )

        # Stage 2: Case-insensitive match (extracting the verbatim casing from transcript)
        if quote_clean.lower() in transcript_clean.lower():
            start_idx = transcript_clean.lower().find(quote_clean.lower())
            verbatim_in_text = transcript_clean[start_idx:start_idx + len(quote_clean)]
            return VerificationResult(
                is_valid=True,
                detail=verbatim_in_text,
                match_type=MatchType.CASE_INSENSITIVE,
                confidence_score=0.95
            )

        # Stage 3: Lenient match without accents and punctuation
        quote_lenient = clean_text_lenient(quote)
        transcript_lenient = clean_text_lenient(transcript_or_answer)

        if len(quote_lenient) >= 15 and quote_lenient in transcript_lenient:
            return VerificationResult(
                is_valid=True,
                detail=f"Correspondência normalizada: '{quote_clean}'",
                match_type=MatchType.NORMALIZED_LENIENT,
                confidence_score=0.85
            )

        # Stage 4: Rejection
        return VerificationResult(
            is_valid=False,
            detail="A citação não foi localizada verbatim na transcrição original da resposta.",
            match_type=MatchType.REJECTED,
            confidence_score=0.0
        )

    @classmethod
    def verify_multiple_quotes(
        cls,
        quotes: List[str],
        transcript_or_answer: str
    ) -> List[VerificationResult]:
        """Convenience method for batch quote verification."""
        return [cls.verify_quote(q, transcript_or_answer) for q in quotes]

