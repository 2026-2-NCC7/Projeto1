import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, UserPlus, Check, Sparkles, Award } from 'lucide-react';

const QUICK_TOPICS = ['React', 'TypeScript', 'Python', 'AWS', 'Docker', 'Spark', 'SQL'];

export const CommunityHelperView: React.FC = () => {
  const { communityProfiles, candidates, connections, connectToUser, activePersona, currentUser } = useApp();
  const [searchSkill, setSearchSkill] = useState('');

  const currentUserId =
    currentUser?.id ||
    (activePersona === 'comunidade-rafael'
      ? 'user-rafael-externo'
      : activePersona === 'candidato-marina'
      ? 'user-marina'
      : 'user-lucas');

  const myProfile = communityProfiles[currentUserId] || communityProfiles['user-lucas'];
  const mySkillsLower = (myProfile?.skills || []).map(s => s.toLowerCase());

  const allProfiles = Object.values(communityProfiles).filter(p => p.userId !== currentUserId);

  const filtered = allProfiles.filter(p => {
    if (!searchSkill.trim()) return true;
    const term = searchSkill.toLowerCase();
    return (
      p.skills.some(s => s.toLowerCase().includes(term)) ||
      p.interests.some(i => i.toLowerCase().includes(term)) ||
      p.name.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      
      <div className="bg-white p-5 rounded-base border border-border shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brandOrange" />
          <h2 className="font-heading font-bold text-base text-foreground">Mentoria & Descoberta por Habilidade</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Localize especialistas da comunidade por domínio técnico e grau de conexão na sua rede.
        </p>

        {/* Campo de Busca por Habilidade + Filtros Rápidos */}
        <div className="space-y-2.5">
          <div className="relative max-w-lg">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              value={searchSkill}
              onChange={(e) => setSearchSkill(e.target.value)}
              placeholder="Digite uma tecnologia (ex: React, AWS, Python, Spark, Docker)..."
              className="w-full h-10 pl-9 pr-3 text-xs bg-background border border-border rounded-base focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[11px] text-muted-foreground font-semibold">Busca rápida:</span>
            <button
              onClick={() => setSearchSkill('')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                !searchSkill ? 'bg-primary text-white border-primary' : 'bg-background text-muted-foreground border-border'
              }`}
            >
              Todas
            </button>
            {QUICK_TOPICS.map(topic => (
              <button
                key={topic}
                onClick={() => setSearchSkill(topic)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                  searchSkill.toLowerCase() === topic.toLowerCase()
                    ? 'bg-brandOrange text-white border-brandOrange'
                    : 'bg-background text-foreground border-border hover:bg-secondary'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULTADO DA BUSCA DE MEMBROS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 p-8 text-center bg-white rounded-base border border-border text-xs text-muted-foreground">
            Nenhum especialista encontrado com a habilidade "{searchSkill}".
          </div>
        ) : (
          filtered.map((person) => {
            const directConn = connections.find(c => 
              (c.userAId === currentUserId && c.userBId === person.userId) ||
              (c.userAId === person.userId && c.userBId === currentUserId)
            );
            const isConnected = directConn?.status === 'conectado' && directConn.degree === '1º grau';
            const degreeLabel = directConn ? directConn.degree : '2º grau';

            const candProfile = Object.values(candidates).find(c => c.userId === person.userId);
            const sharedCount = person.skills.filter(s => mySkillsLower.includes(s.toLowerCase())).length;

            return (
              <div key={person.id} className="bg-white p-5 rounded-base border border-border shadow-xs space-y-3.5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={person.avatar} alt={person.name} className="w-12 h-12 rounded-full object-cover border border-border" />
                      <div>
                        <h4 className="font-heading font-bold text-sm text-foreground">{person.name}</h4>
                        <p className="text-xs text-muted-foreground">{person.headline}</p>
                        <span className="text-[10px] text-muted-foreground">{person.city}/{person.state}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 space-y-1">
                      <span className="text-[10px] bg-secondary text-primary font-bold px-2 py-0.5 rounded block">
                        {degreeLabel} de conexão
                      </span>
                      <span className="text-[10px] text-brandOrange font-bold block">
                        {candProfile ? `Nível ${candProfile.seniority}` : 'Especialista Cloud'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-foreground leading-relaxed line-clamp-2">
                    "{person.bio}"
                  </p>

                  {/* Habilidades Públicas com Grau de Domínio */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-muted-foreground block font-semibold">
                      Habilidades e Grau de Domínio Prático:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {person.skills.map((sk, idx) => {
                        const candSkill = candProfile?.skills.find(cs => cs.name.toLowerCase() === sk.toLowerCase());
                        const mastery = candSkill?.mastery || 'Avançado';
                        const years = candSkill?.years ?? 3;
                        const isHighlighted = searchSkill && sk.toLowerCase().includes(searchSkill.toLowerCase());

                        return (
                          <span
                            key={idx}
                            className={`text-[10px] px-2 py-0.5 rounded border flex items-center gap-1 ${
                              isHighlighted
                                ? 'bg-brandOrange text-white border-brandOrange font-bold'
                                : 'bg-background border-border text-foreground font-medium'
                            }`}
                          >
                            <span>{sk}</span>
                            <span className={`text-[9px] px-1 rounded ${isHighlighted ? 'bg-black/20 text-white' : 'bg-secondary text-primary font-bold'}`}>
                              {mastery} ({years}a)
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-primary" />
                    {sharedCount > 0 ? `${sharedCount} habilidade(s) afins com seu perfil` : 'Mentoria técnica disponível'}
                  </span>

                  {isConnected ? (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Conectado na Rede
                    </span>
                  ) : (
                    <button
                      onClick={() => connectToUser(person.userId)}
                      className="px-3.5 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-base flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Conectar e Pedir Ajuda
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};