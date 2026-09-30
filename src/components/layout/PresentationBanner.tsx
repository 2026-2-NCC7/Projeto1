import React from 'react';
import { useApp, ActivePersona } from '../../context/AppContext';
import { Users, RefreshCw, Info } from 'lucide-react';

export const PresentationBanner: React.FC = () => {
  const { activePersona, setActivePersona, resetAllData } = useApp();

  const personas: Array<{ id: ActivePersona; label: string; roleDesc: string }> = [
    { id: 'candidato-lucas', label: 'Lucas Almeida (Candidato 1)', roleDesc: 'Front-end Pleno' },
    { id: 'candidato-marina', label: 'Marina Costa (Candidato 2)', roleDesc: 'Eng. Dados Sênior' },
    { id: 'empresa-orion', label: 'Orion Tech (Empresa)', roleDesc: 'Recrutador / Gestor' },
    { id: 'comunidade-rafael', label: 'Rafael Mendes (Comunidade)', roleDesc: 'Membro Externo (Não Candidato)' },
    { id: 'admin-qitech', label: 'Admin Q.I. Tech', roleDesc: 'Governança & Auditoria' }
  ];

  return (
    <div className="bg-brandNavy text-brandNavyText px-4 py-2 border-b border-[#003E48] text-xs">
      <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-heading font-bold text-brandOrange tracking-wide uppercase px-2 py-0.5 rounded bg-black/30">
            Modo Apresentação (MVP)
          </span>
          <span className="hidden sm:inline text-brandNavySub">
            Alterne entre personas para testar a sincronização entre candidato e empresa em tempo real:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {personas.map((p) => {
            const isActive = activePersona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePersona(p.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                  isActive 
                    ? 'bg-primary text-white font-bold shadow-xs' 
                    : 'bg-white/10 text-brandNavySub hover:bg-white/20 hover:text-white'
                }`}
                title={p.roleDesc}
              >
                {p.label}
              </button>
            );
          })}

          <button
            onClick={resetAllData}
            title="Restaurar dados originais de demonstração"
            className="ml-2 text-brandNavySub hover:text-white flex items-center gap-1 px-2 py-1 rounded border border-white/20 hover:bg-white/10"
          >
            <RefreshCw className="w-3 h-3" /> Reiniciar Dados
          </button>
        </div>
      </div>
    </div>
  );
};