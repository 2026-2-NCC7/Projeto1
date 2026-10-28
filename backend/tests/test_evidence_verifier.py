import pytest
from app.core.evidence_verifier import EvidenceVerifier

def test_exact_verbatim_quote_verification():
    transcript = (
        "No meu projeto anterior, desenvolvi um pipeline de dados em Python "
        "utilizando Pandas e Fastparquet para processar 50 milhões de registros diários."
    )
    quote = "desenvolvi um pipeline de dados em Python utilizando Pandas"

    is_valid, match = EvidenceVerifier.verify_quote(quote, transcript)
    assert is_valid is True
    assert "desenvolvi um pipeline de dados em Python" in match

def test_whitespace_and_newline_normalization():
    transcript = "Estruturei   a ingestão automática \n e o particionamento em disco."
    quote = "Estruturei a ingestão automática e o particionamento em disco."

    is_valid, match = EvidenceVerifier.verify_quote(quote, transcript)
    assert is_valid is True

def test_case_insensitive_quote_verification():
    transcript = "Utilizei o comando EXPLAIN ANALYZE no PostgreSQL."
    quote = "utilizei o comando explain analyze no postgresql."

    is_valid, match = EvidenceVerifier.verify_quote(quote, transcript)
    assert is_valid is True

def test_rejection_of_hallucinated_quote():
    transcript = "Trabalhei com banco de dados MySQL e criei algumas tabelas simples."
    hallucinated_quote = "Arquitetei um cluster distribuído de alta disponibilidade com failover automático."

    is_valid, reason = EvidenceVerifier.verify_quote(hallucinated_quote, transcript)
    assert is_valid is False
    assert "não foi localizada" in reason

def test_empty_quote_or_transcript():
    is_valid, reason = EvidenceVerifier.verify_quote("", "algum texto")
    assert is_valid is False

    is_valid, reason = EvidenceVerifier.verify_quote("alguma citação", "")
    assert is_valid is False

def test_refactored_verification_result_rich_attributes():
    transcript = "Trabalhei 3 anos com arquitetura de microsserviços em Go."
    quote = "arquitetura de microsserviços em Go"

    # Test rich object access
    res = EvidenceVerifier.verify_quote(quote, transcript)
    assert res.is_valid is True
    assert res.match_type.value == "EXACT"
    assert res.confidence_score == 1.0
    assert "arquitetura de microsserviços" in res.detail

    # Test tuple unpacking backward compatibility
    is_valid, detail = res
    assert is_valid is True
    assert detail == res.detail

def test_case_insensitive_match_type_and_confidence():
    transcript = "Utilizei o Framework DJANGO para criar APIs RESTful."
    quote = "utilizei o framework django para criar apis restful."

    res = EvidenceVerifier.verify_quote(quote, transcript)
    assert res.is_valid is True
    assert res.match_type.value == "CASE_INSENSITIVE"
    assert res.confidence_score == 0.95
    # Preserves casing from original transcript
    assert "DJANGO" in res.detail

def test_lenient_match_type_accents_and_confidence():
    transcript = "Coordenei a migracao da infraestrutura para a nuvem AWS."
    quote = "Coordenei a migração da infraestrutura para a nuvem AWS."

    res = EvidenceVerifier.verify_quote(quote, transcript)
    assert res.is_valid is True
    assert res.match_type.value == "NORMALIZED_LENIENT"
    assert res.confidence_score == 0.85

def test_batch_verification():
    transcript = "Tenho experiência sólida com Docker e Kubernetes em produção."
    quotes = [
        "experiência sólida com Docker",
        "Kubernetes em produção",
        "programação em Rust de baixo nível" # hallucinated
    ]

    results = EvidenceVerifier.verify_multiple_quotes(quotes, transcript)
    assert len(results) == 3
    assert results[0].is_valid is True
    assert results[1].is_valid is True
    assert results[2].is_valid is False
    assert results[2].confidence_score == 0.0

