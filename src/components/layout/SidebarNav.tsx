import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Briefcase, 
  Sparkles, 
  Layers, 
  Share2, 
  ShieldCheck, 
  Users, 
  Search
} from 'lucide-react';

interface SidebarNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ currentTab, setCurrentTab }) => {
  const { activePersona, rewardBalance, companyCredits } = useApp();

  const isCandidate = activePersona === 'candidato-lucas' || activePersona === 'candidato-marina';
  const isCompany = activePersona === 'empresa-orion';
  const isCommunityExternal = activePersona === 'comunidade-rafael';
  const isAdmin = activePersona === 'admin-qitech';

  return (
    <aside className="w-full lg:w-[230px] shrink-0 space-y-4">
      <div className="bg-white p-3.5 rounded-base border border-border shadow-xs space-y-1">
        
        {/* NAVEGAÇÃO CANDIDATO */}
        {isCandidate && (
          <>
            <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Carreira & Vagas
            </div>
            
            <button
              onClick={() => setCurrentTab('candidato-perfil')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'candidato-perfil' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <User className="w-4 h-4" /> Meu Perfil Técnico
            </button>

            <button
              onClick={() => setCurrentTab('candidato-entrevista')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'candidato-entrevista' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <Sparkles className="w-4 h-4 text-brandOrange" /> Entrevista IA
            </button>

            <button
              onClick={() => setCurrentTab('candidato-vagas')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'candidato-vagas' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <Briefcase className="w-4 h-4" /> Vagas Compatíveis
            </button>

            <button
              onClick={() => setCurrentTab('candidato-processos')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'candidato-processos' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" /> Processos & Estalecas
              </span>
              <span className="text-[10px] bg-brandOrange/15 text-brandOrange font-bold px-1.5 py-0.5 rounded">
                {rewardBalance} 🪙
              </span>
            </button>

            <div className="pt-3 mt-3 border-t border-border px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Comunidade Q.I.
            </div>

            <button
              onClick={() => setCurrentTab('comunidade-feed')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'comunidade-feed' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <Share2 className="w-4 h-4" /> Feed Técnico
            </button>

            <button
              onClick={() => setCurrentTab('comunidade-rede')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'comunidade-rede' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <Users className="w-4 h-4" /> Minha Rede
            </button>

            <button
              onClick={() => setCurrentTab('comunidade-ajuda')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'comunidade-ajuda' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <Search className="w-4 h-4" /> Mentoria & Ajuda
            </button>
          </>
        )}

        {/* NAVEGAÇÃO EMPRESA CLIENTE */}
        {isCompany && (
          <>
            <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Portal Corporativo
            </div>

            <button
              onClick={() => setCurrentTab('empresa-vagas')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'empresa-vagas' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4" /> Vagas & Faturamento
              </span>
              <span className="text-[10px] bg-secondary text-primary font-bold px-1.5 py-0.5 rounded">
                {companyCredits} créd.
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('empresa-shortlist')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'empresa-shortlist' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <Users className="w-4 h-4 text-brandOrange" /> Match Express
            </button>
          </>
        )}

        {/* NAVEGAÇÃO MEMBRO DA COMUNIDADE */}
        {isCommunityExternal && (
          <>
            <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Comunidade Q.I.
            </div>

            <button
              onClick={() => setCurrentTab('comunidade-feed')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'comunidade-feed' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <Share2 className="w-4 h-4" /> Feed Técnico
            </button>

            <button
              onClick={() => setCurrentTab('comunidade-rede')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'comunidade-rede' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <Users className="w-4 h-4" /> Minha Rede
            </button>

            <button
              onClick={() => setCurrentTab('comunidade-ajuda')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'comunidade-ajuda' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <Search className="w-4 h-4" /> Mentoria & Ajuda
            </button>
          </>
        )}

        {/* NAVEGAÇÃO ADMIN */}
        {isAdmin && (
          <>
            <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Administração
            </div>

            <button
              onClick={() => setCurrentTab('admin-dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-base text-xs font-semibold transition-all ${
                currentTab === 'admin-dashboard' ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Governança & Preços
            </button>
          </>
        )}

      </div>
    </aside>
  );
};