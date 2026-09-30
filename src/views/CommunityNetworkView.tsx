import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Search, 
  UserPlus, 
  Check, 
  Sparkles,
  Award
} from 'lucide-react';

export const CommunityNetworkView: React.FC = () => {
  const { communityProfiles, candidates, connections, connectToUser, activePersona } = useApp();
  const [filterDegree, setFilterDegree] = useState<'TODOS' | '1º grau' | '2º grau' | '3º grau'>('TODOS');
  const [searchTerm, setSearchTerm] = useState('');

  const currentUserId =
    activePersona === 'comunidade-rafael'
      ? 'user-rafael-externo'
      : activePersona === 'candidato-marina'
      ? 'user-marina'
      : 'user-lucas';

  const myCommProfile = communityProfiles[currentUserId] || communityProfiles['user-lucas'];
  const mySkillsLower = (myCommProfile?.skills || []).map(s => s.toLowerCase());
  const myInterestsLower = (myCommProfile?.interests || []).map(i => i.toLowerCase());

  // Obter perfis que não são o próprio usuário logado
  const otherProfiles = Object.values(communityProfiles).filter(p => p.userId !== currentUserId);

  // Calcula grau de conexão e % de afinidade por sobreposição de habilidades, interesses e senioridade
  const networkMembers = otherProfiles.map(profile => {
    const directConn = connections.find(c => 
      (c.userAId === currentUserId && c.userBId === profile.userId) ||
      (c.userAId === profile.userId && c.userBId === currentUserId)
    );

    // Verifica se há amigo em comum (2º grau) ou 3º grau
    let degree: '1º grau' | '2º grau' | '3º grau' = '3º grau';
    if (directConn) {
      degree = directConn.degree;
    } else {
      const myNeighbors = connections
        .filter(c => c.userAId === currentUserId || c.userBId === currentUserId)
        .map(c => (c.userAId === currentUserId ? c.userBId : c.userAId));
      const hasMutual = connections.some(c =>
        (myNeighbors.includes(c.userAId) && c.userBId === profile.userId) ||
        (myNeighbors.includes(c.userBId) && c.userAId === profile.userId)
      );
      degree = hasMutual ? '2º grau' : '3º grau';
    }

    const isConnected = directConn?.status === 'conectado' && degree === '1º grau';

    // Habilidades em comum
    const sharedSkills = profile.skills.filter(sk =>
      mySkillsLower.includes(sk.toLowerCase())
    );
    const sharedInterests = profile.interests.filter(int =>
      myInterestsLower.includes(int.toLowerCase())
    );

    const unionSkills = new Set([...mySkillsLower, ...profile.skills.map(s => s.toLowerCase())]).size || 1;
    const affinityScore = Math.min(
      96,
      Math.max(
        64,
        Math.round(58 + (sharedSkills.length / unionSkills) * 45 + sharedInterests.length * 6)
      )
    );

    // Localiza dados de domínio técnico se for candidato cadastrado
    const candMatch = Object.values(candidates).find(c => c.userId === profile.userId);

    return {
      ...profile,
      degree,
      isConnected,
      sharedSkills,
      sharedInterests,
      affinityScore,
      seniorityLabel: candMatch?.seniority || 'Especialista Comunidade'
    };
  });

  // Ordenar por maior afinidade técnica (RFS19 / RM05)
  const sortedMembers = [...networkMembers].sort((a, b) => b.affinityScore - a.affinityScore);

  // Filtragem
  const filtered = sortedMembers.filter(m => {
    const matchesDegree = filterDegree === 'TODOS' || m.degree === filterDegree;
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term || (
      m.name.toLowerCase().includes(term) ||
      m.headline.toLowerCase().includes(term) ||
      m.skills.some(s => s.toLowerCase().includes(term))
    );
    return matchesDegree && matchesSearch;
  });

  const firstDegreeCount = networkMembers.filter(m => m.degree === '1º grau').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Cabeçalho da Rede */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="font-heading font-bold text-base text-foreground">Minha Rede & Grau de Afinidade</h2>
            <span className="text-xs bg-secondary text-primary font-bold px-2 py-0.5 rounded">
              {firstDegreeCount} conexão(ões) de 1º grau
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Conexões recomendadas por sobreposição de habilidades e grau de proximidade.
          </p>
        </div>

        {/* Filtros por Grau de Conexão */}
        <div className="flex items-center gap-1.5 p-1 bg-background border border-border rounded-base text-xs font-semibold shrink-0">
          {(['TODOS', '1º grau', '2º grau', '3º grau'] as const).map(deg => (
            <button
              key={deg}
              onClick={() => setFilterDegree(deg)}
              className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                filterDegree === deg 
                  ? 'bg-primary text-white font-bold' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {deg}
            </button>
          ))}
        </div>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filtrar profissionais por nome, tecnologia ou especialidade..."
          className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-border rounded-base focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Lista de Conexões com Grau de Habilidade e Afinidade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 p-8 text-center bg-white rounded-base border border-border text-xs text-muted-foreground">
            Nenhum profissional encontrado com o filtro selecionado.
          </div>
        ) : (
          filtered.map(person => (
            <div key={person.id} className="bg-white p-5 rounded-base border border-border shadow-xs space-y-3.5 flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={person.avatar} 
                      alt={person.name} 
                      className="w-12 h-12 rounded-full object-cover border border-border"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <strong className="text-sm font-bold text-foreground leading-tight">
                          {person.name}
                        </strong>
                        <span className="text-[10px] bg-secondary text-primary font-bold px-1.5 py-0.5 rounded">
                          {person.seniorityLabel}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground block mt-0.5">
                        {person.headline}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {person.city}/{person.state}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-1">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                      person.degree === '1º grau' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : person.degree === '2º grau'
                        ? 'bg-secondary text-primary'
                        : 'bg-background text-muted-foreground border border-border'
                    }`}>
                      {person.degree}
                    </span>
                    <div className="text-xs font-heading font-bold text-brandOrange block">
                      {person.affinityScore}% Afinidade
                    </div>
                  </div>
                </div>

                <p className="text-xs text-foreground leading-relaxed line-clamp-2">
                  "{person.bio}"
                </p>

                {/* Habilidades e destaque para stacks em comum */}
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-semibold block">
                    Habilidades declaradas (destaque em laranja para stacks em comum com você):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {person.skills.map((sk, idx) => {
                      const isShared = person.sharedSkills.includes(sk);
                      return (
                        <span
                          key={idx}
                          className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                            isShared
                              ? 'bg-brandOrange/15 border border-brandOrange/40 text-brandOrange font-bold'
                              : 'bg-background border border-border text-foreground'
                          }`}
                        >
                          {isShared ? `★ ${sk}` : sk}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Rodapé do Card */}
              <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-brandOrange" />
                  {person.sharedSkills.length > 0
                    ? `${person.sharedSkills.length} tecnologia(s) em comum`
                    : 'Interesses complementares de engenharia'}
                </span>

                {person.isConnected ? (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Conectado (1º grau)
                  </span>
                ) : (
                  <button
                    onClick={() => connectToUser(person.userId)}
                    className="px-3.5 py-1.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-base text-xs flex items-center gap-1 shadow-xs transition-all"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Conectar Agora
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};