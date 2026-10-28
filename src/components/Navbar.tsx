import React, { useEffect, useState } from 'react';
import {
  Brain, Users, MessageSquare, Activity, FileText,
  Briefcase, Target, GitCompare, RotateCcw, CheckCircle, AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';
import { HealthResponse } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSwitchToPortal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onSwitchToPortal }) => {
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    api.getHealth()
      .then(setHealth)
      .catch(() => setHealth(null));
    const interval = setInterval(() => {
      api.getHealth().then(setHealth).catch(() => setHealth(null));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'candidates', label: 'Candidatos', icon: Users },
    { id: 'interview', label: 'Entrevista', icon: MessageSquare },
    { id: 'monitor', label: 'Processamento', icon: Brain },
    { id: 'reports', label: 'Relatórios & Evidências', icon: FileText },
    { id: 'replica', label: 'Réplica & Revisão', icon: RotateCcw },
    { id: 'jobs', label: 'Vagas & Critérios', icon: Briefcase },
    { id: 'matching', label: 'Matching & Ranking', icon: Target },
    { id: 'comparison', label: 'Comparação', icon: GitCompare },
  ];

  return (
    <header className="navbar">
      <div className="brand" onClick={() => setActiveTab('dashboard')}>
        <Brain size={26} color="#00E8C6" />
        <span>Q.I. Tech <span className="brand-badge">Matchmaker</span></span>
      </div>

      <nav className="nav-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {onSwitchToPortal && (
          <button
            onClick={onSwitchToPortal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: 'rgba(0, 117, 133, 0.25)',
              color: '#38BDF8',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title="Ir para o Portal de Recrutamento Invertido, Comunidade e Processo Seletivo"
          >
            <span>🌐 Ir ao Portal</span>
          </button>
        )}

        {health?.database_connected ? (
          <span className="badge badge-evidenciada" title="PostgreSQL / SQLite Operacional">
            <CheckCircle size={12} /> DB Ativo
          </span>
        ) : (
          <span className="badge badge-divergencia" title="DB Desconectado">
            <AlertTriangle size={12} /> DB Offline
          </span>
        )}

        <span className="badge badge-cyan" title="Whisper + Qwen3 + Multilingual-E5">
          <Brain size={12} /> Modelos IA
        </span>
      </div>
    </header>
  );
};
