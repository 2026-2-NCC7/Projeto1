import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { HealthResponse } from '../types';
import { useApp } from '../portal/context/AppContext';
import { RefreshCw, Activity, User, Building2, Users, Shield } from 'lucide-react';

export const EcosystemTopBar: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const { activePersona, session, isAuthenticated, setActivePersona, resetAllData } = useApp();

  useEffect(() => {
    api.getHealth()
      .then(setHealth)
      .catch(() => setHealth(null));

    const interval = setInterval(() => {
      api.getHealth()
        .then(setHealth)
        .catch(() => setHealth(null));
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const isOnline = Boolean(health?.status === 'ok');

  return (
    <div className="bg-[#040814] text-slate-300 border-b border-white/10 px-4 py-1.5 text-xs flex items-center justify-between gap-3 z-50 sticky top-0">
      {/* IDENTIFICAÇÃO ENXUTA */}
      <div className="flex items-center gap-2.5">
        <span className="font-heading font-black text-[11px] tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
          Q.I. TECH
        </span>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Ecossistema Unificado de Recrutamento & IA Explicável
        </span>
        <span className="flex items-center gap-1 text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
          <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          {isOnline ? 'Motor IA Online' : 'Modo Demonstrativo'}
        </span>
      </div>

      {/* SELETOR RÁPIDO DE VISÃO (ENXUTO E MINIMALISTA) */}
      {isAuthenticated && (
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider hidden md:inline font-semibold">
            Visão:
          </span>
          <div className="flex items-center bg-white/5 p-0.5 rounded-base border border-white/10 text-[11px]">
            <button
              type="button"
              onClick={() => setActivePersona('candidato-lucas')}
              className={`px-2.5 py-1 rounded font-semibold transition-all flex items-center gap-1 ${
                activePersona === 'candidato-lucas' || activePersona === 'candidato-marina'
                  ? 'bg-primary text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-3 h-3" /> Candidato
            </button>
            <button
              type="button"
              onClick={() => setActivePersona('empresa-orion')}
              className={`px-2.5 py-1 rounded font-semibold transition-all flex items-center gap-1 ${
                activePersona === 'empresa-orion'
                  ? 'bg-yellow-400 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Building2 className="w-3 h-3" /> Empresa
            </button>
            <button
              type="button"
              onClick={() => setActivePersona('comunidade-rafael')}
              className={`px-2.5 py-1 rounded font-semibold transition-all flex items-center gap-1 ${
                activePersona === 'comunidade-rafael'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-3 h-3" /> Comunidade
            </button>
            <button
              type="button"
              onClick={() => setActivePersona('admin-qitech')}
              className={`px-2.5 py-1 rounded font-semibold transition-all flex items-center gap-1 ${
                activePersona === 'admin-qitech'
                  ? 'bg-slate-700 text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Shield className="w-3 h-3" /> Admin
            </button>
          </div>

          <button
            type="button"
            onClick={resetAllData}
            title="Restaurar dados originais de demonstração"
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-all ml-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
