import React, { useEffect, useState } from 'react';
import { Layers, Brain, CheckCircle, AlertTriangle, Cpu, Database, ExternalLink, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { HealthResponse } from '../types';

interface EcosystemTopBarProps {
  activeModule: 'portal' | 'engine';
  setActiveModule: (module: 'portal' | 'engine') => void;
}

export const EcosystemTopBar: React.FC<EcosystemTopBarProps> = ({
  activeModule,
  setActiveModule
}) => {
  const [health, setHealth] = useState<HealthResponse | null>(null);

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

  const whisperAvailable = health?.models?.some(m => m.name.toLowerCase().includes('whisper') && m.available);
  const e5Available = health?.models?.some(m => m.name.toLowerCase().includes('e5') && m.available);

  return (
    <div
      style={{
        background: '#040814',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '0.45rem 1.25rem',
        fontSize: '0.78rem',
        color: '#94A3B8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        zIndex: 60,
        position: 'relative'
      }}
    >
      {/* IDENTIFICAÇÃO DO ECOSSISTEMA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#F8FAFC', fontWeight: 700 }}>
          <span
            style={{
              background: 'linear-gradient(135deg, #00E8C6, #0284C7)',
              color: '#040814',
              borderRadius: '4px',
              padding: '0.15rem 0.4rem',
              fontSize: '0.7rem',
              fontWeight: 800,
              letterSpacing: '0.04em'
            }}
          >
            ECOSSISTEMA Q.I. TECH
          </span>
          <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
            FECAP 2026 • Bacharelado em Ciência da Computação
          </span>
        </div>
      </div>

      {/* SELETOR DE MÓDULO UNIFICADO */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          padding: '2px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <button
          onClick={() => setActiveModule('portal')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: activeModule === 'portal' ? 700 : 500,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: activeModule === 'portal' ? '#007585' : 'transparent',
            color: activeModule === 'portal' ? '#FFFFFF' : '#94A3B8'
          }}
        >
          <Layers size={14} />
          <span>Plataforma Q.I. Tech (Portal & Comunidade)</span>
        </button>

        <button
          onClick={() => setActiveModule('engine')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: activeModule === 'engine' ? 700 : 500,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: activeModule === 'engine' ? 'linear-gradient(135deg, #00E8C6, #0284C7)' : 'transparent',
            color: activeModule === 'engine' ? '#040814' : '#94A3B8'
          }}
        >
          <Brain size={14} />
          <span>Matchmaker Engine (Motor IA & TCC)</span>
        </button>
      </div>

      {/* STATUS DO BACKEND & SERVIÇOS EM TEMPO REAL */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {health?.status === 'healthy' ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: '#34D399',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '0.2rem 0.55rem',
              borderRadius: '9999px',
              fontSize: '0.7rem',
              fontWeight: 600
            }}
            title="FastAPI REST API Operacional na porta 8000"
          >
            <CheckCircle size={11} /> Backend Online (v{health.version})
          </span>
        ) : (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: '#F87171',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '0.2rem 0.55rem',
              borderRadius: '9999px',
              fontSize: '0.7rem',
              fontWeight: 600
            }}
            title="FastAPI Offline ou inicializando na porta 8000"
          >
            <AlertTriangle size={11} /> Backend Conectando...
          </span>
        )}

        {health?.database_connected && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: '#38BDF8',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '0.2rem 0.55rem',
              borderRadius: '9999px',
              fontSize: '0.7rem',
              fontWeight: 600
            }}
            title="SQLite relacional conectado com tabelas e seeds"
          >
            <Database size={11} /> SQLite DB
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
            padding: '0.2rem 0.55rem',
            borderRadius: '9999px',
            fontSize: '0.7rem',
            fontWeight: 600
          }}
          title="Whisper int8 para áudio e Multilingual-E5 para similaridade vetorial"
        >
          <Cpu size={11} /> IA Local
        </span>
      </div>
    </div>
  );
};
