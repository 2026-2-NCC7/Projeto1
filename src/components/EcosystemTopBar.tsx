import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, Cpu, Database, ShieldCheck, Mic, Brain, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { HealthResponse } from '../types';
import { useApp } from '../portal/context/AppContext';

export const EcosystemTopBar: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const { activePersona, session, isAuthenticated, setActivePersona } = useApp();

  useEffect(() => {
    api.getHealth()
      .then(setHealth)
      .catch(() => setHealth(null));

    const interval = setInterval(() => {
      api.getHealth()
        .then(setHealth)
        .catch(() => setHealth(null));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const role = session?.role;
  const activeRoleBadge = !isAuthenticated
    ? 'Visitante / Autenticação'
    : role === 'empresa' || activePersona === 'empresa-orion'
      ? 'Perfil: Empresa Contratante (B2B)'
      : role === 'admin' || activePersona === 'admin-qitech'
        ? 'Perfil: Governança, Admin & Banca TCC'
        : activePersona === 'comunidade-rafael'
          ? 'Perfil: Membro da Comunidade Técnica'
          : 'Perfil: Candidato / Profissional';

  return (
    <div
      style={{
        background: '#040814',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '0.4rem 1.25rem',
        fontSize: '0.75rem',
        color: '#94A3B8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.65rem',
        zIndex: 60,
        position: 'relative'
      }}
    >
      {/* IDENTIFICAÇÃO DO ECOSSISTEMA UNIFICADO */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
        <span
          style={{
            background: 'linear-gradient(135deg, #00E8C6, #0284C7)',
            color: '#040814',
            borderRadius: '4px',
            padding: '0.15rem 0.45rem',
            fontSize: '0.68rem',
            fontWeight: 800,
            letterSpacing: '0.04em'
          }}
        >
          Q.I. TECH — SISTEMA UNIFICADO
        </span>
        <span style={{ fontSize: '0.72rem', color: '#E2E8F0', fontWeight: 600 }}>
          Recrutamento Invertido, Comunidade & Motor de IA Explicável
        </span>
        <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
          • FECAP 2026 (TCC Ciência da Computação)
        </span>
      </div>

      {/* SELETOR RÁPIDO DE PERFIL (CANDIDATO | EMPRESA | COMUNIDADE | ADMIN) */}
      {isAuthenticated && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '0.2rem 0.4rem',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <span style={{ fontSize: '0.68rem', color: '#94A3B8', marginRight: '0.25rem', fontWeight: 600 }}>
            Alternar Visão:
          </span>
          <button
            type="button"
            onClick={() => setActivePersona('candidato-lucas')}
            style={{
              padding: '0.2rem 0.55rem',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: (activePersona === 'candidato-lucas' || activePersona === 'candidato-marina') ? '#00E8C6' : 'transparent',
              color: (activePersona === 'candidato-lucas' || activePersona === 'candidato-marina') ? '#040814' : '#CBD5E1'
            }}
          >
            Candidato
          </button>
          <button
            type="button"
            onClick={() => setActivePersona('empresa-orion')}
            style={{
              padding: '0.2rem 0.55rem',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: activePersona === 'empresa-orion' ? '#FF6B35' : 'transparent',
              color: activePersona === 'empresa-orion' ? '#FFFFFF' : '#CBD5E1'
            }}
          >
            Empresa B2B
          </button>
          <button
            type="button"
            onClick={() => setActivePersona('comunidade-rafael')}
            style={{
              padding: '0.2rem 0.55rem',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: activePersona === 'comunidade-rafael' ? '#38BDF8' : 'transparent',
              color: activePersona === 'comunidade-rafael' ? '#040814' : '#CBD5E1'
            }}
          >
            Comunidade
          </button>
          <button
            type="button"
            onClick={() => setActivePersona('admin-qitech')}
            style={{
              padding: '0.2rem 0.55rem',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: activePersona === 'admin-qitech' ? '#A855F7' : 'transparent',
              color: activePersona === 'admin-qitech' ? '#FFFFFF' : '#CBD5E1'
            }}
          >
            Admin & TCC
          </button>
        </div>
      )}

      {/* STATUS DO BACKEND & MODELOS DE IA EM TEMPO REAL */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            color: '#E2E8F0',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '0.18rem 0.55rem',
            borderRadius: '9999px',
            fontSize: '0.68rem',
            fontWeight: 600
          }}
        >
          <ShieldCheck size={11} color="#00E8C6" /> {activeRoleBadge}
        </span>

        {health?.status === 'healthy' ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: '#34D399',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '0.18rem 0.55rem',
              borderRadius: '9999px',
              fontSize: '0.68rem',
              fontWeight: 600
            }}
            title="FastAPI REST API Operacional na porta 8000"
          >
            <CheckCircle size={11} /> API FastAPI Online (v{health.version})
          </span>
        ) : (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: '#FBBF24',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '0.18rem 0.55rem',
              borderRadius: '9999px',
              fontSize: '0.68rem',
              fontWeight: 600
            }}
            title="Operando em contingência local caso o backend FastAPI na porta 8000 não esteja iniciado"
          >
            <AlertTriangle size={11} /> API Local (Contingência)
          </span>
        )}

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            color: '#00E8C6',
            background: 'rgba(0, 232, 198, 0.12)',
            border: '1px solid rgba(0, 232, 198, 0.3)',
            padding: '0.18rem 0.55rem',
            borderRadius: '9999px',
            fontSize: '0.68rem',
            fontWeight: 600
          }}
          title="Faster-Whisper int8 (Áudio pt-BR) + Qwen3/EvidenceVerifier + Multilingual-E5 (384d)"
        >
          <Cpu size={11} /> Whisper + Qwen3 + E5
        </span>
      </div>
    </div>
  );
};
