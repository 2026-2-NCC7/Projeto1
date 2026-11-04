import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  MessageSquare, 
  Bookmark, 
  Send, 
  Tag, 
  UserPlus, 
  Check, 
  Flag,
  Sparkles,
  Briefcase
} from 'lucide-react';

export const CommunityFeedView: React.FC = () => {
  const { 
    posts, 
    comments, 
    createPost, 
    createComment, 
    toggleLikePost, 
    toggleSavePost, 
    communityProfiles, 
    candidates,
    connectToUser, 
    connections, 
    activePersona,
    currentUser,
    reportPost,
    migrateExternalToCandidate
  } = useApp();
  
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<'post' | 'pergunta'>('post');
  const [newPostTags, setNewPostTags] = useState('React, TypeScript');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [reportedPostId, setReportedPostId] = useState<string | null>(null);

  const currentUserId =
    currentUser?.id ||
    (activePersona === 'comunidade-rafael'
      ? 'user-rafael-externo'
      : activePersona === 'candidato-marina'
      ? 'user-marina'
      : 'user-lucas');

  const myProfile = communityProfiles[currentUserId] || communityProfiles['user-lucas'];
  const mySkillsLower = (myProfile?.skills || []).map(s => s.toLowerCase());
  const isRafaelCandidateAlready = Boolean(candidates['cand-rafael']);

  const handlePublish = () => {
    if (!newPostContent.trim()) return;
    const tagsArray = newPostTags.split(',').map(t => t.trim()).filter(Boolean);
    createPost(newPostContent, newPostType, tagsArray);
    setNewPostContent('');
  };

  const handleSendComment = (postId: string) => {
    if (!commentText.trim()) return;
    createComment(postId, commentText);
    setCommentText('');
  };

  const handleReport = (postId: string) => {
    reportPost(postId, 'Conteúdo inadequado ou fora do escopo técnico');
    setReportedPostId(postId);
    setTimeout(() => setReportedPostId(null), 3500);
  };

  // Sugestões de conexão para o painel direito (baseadas em afinidade técnica)
  const suggestions = Object.values(communityProfiles).filter(p => p.userId !== currentUserId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* COLUNA PRINCIPAL: COMPOSITOR E FEED */}
      <div className="lg:col-span-8 space-y-4">

        {/* CARD DE ATIVAÇÃO DE CARREIRA PARA MEMBRO DA COMUNIDADE */}
        {activePersona === 'comunidade-rafael' && (
          <div className="bg-white p-4 rounded-base border border-primary/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary font-heading font-bold text-xs">
                <Briefcase className="w-4 h-4 text-brandOrange" />
                {isRafaelCandidateAlready
                  ? '✓ Perfil de Carreira Ativo!'
                  : 'Deseja receber convites de vagas compatíveis?'}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {isRafaelCandidateAlready
                  ? 'Seu perfil DevOps & AWS está ativo para empresas parceiras com proteção Double Opt-In.'
                  : 'Ative seu perfil profissional com 1 clique aproveitando suas habilidades da comunidade.'}
              </p>
            </div>

            {!isRafaelCandidateAlready && (
              <button
                onClick={() => migrateExternalToCandidate(14000, 18000, 'Sênior', 'Remoto', ['PJ', 'CLT'])}
                className="px-3.5 py-2 bg-brandOrange hover:opacity-95 text-white text-xs font-bold rounded-base shrink-0 shadow-xs transition-all"
              >
                Ativar Perfil de Candidato
              </button>
            )}
          </div>
        )}
        
        {/* COMPOSITOR DE PUBLICAÇÃO */}
        <div className="bg-white p-4 rounded-base border border-border shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="font-heading font-bold text-xs text-foreground">Nova Publicação na Comunidade</span>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setNewPostType('post')}
                className={`px-2.5 py-1 rounded-base font-semibold ${newPostType === 'post' ? 'bg-secondary text-primary' : 'text-muted-foreground'}`}
              >
                Artigo / Dica
              </button>
              <button
                onClick={() => setNewPostType('pergunta')}
                className={`px-2.5 py-1 rounded-base font-semibold ${newPostType === 'pergunta' ? 'bg-secondary text-primary' : 'text-muted-foreground'}`}
              >
                Dúvida Técnica
              </button>
            </div>
          </div>

          <textarea
            rows={3}
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder={newPostType === 'pergunta' ? "Qual sua dúvida técnica sobre código ou arquitetura?" : "Compartilhe uma solução técnica, benchmark ou aprendizado..."}
            className="w-full bg-background border border-border rounded-base p-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 w-full sm:w-72">
              <Tag className="w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                value={newPostTags}
                onChange={(e) => setNewPostTags(e.target.value)}
                placeholder="Tags separadas por vírgula..."
                className="w-full h-8 text-[11px] bg-background border border-border rounded-base px-2 text-foreground"
              />
            </div>

            <button
              onClick={handlePublish}
              className="px-4 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-base flex items-center justify-center gap-1 shadow-xs"
            >
              <Send className="w-3 h-3" /> Publicar
            </button>
          </div>
        </div>

        {reportedPostId && (
          <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-base text-xs font-medium">
            🛡️ Publicação sinalizada e enviada para a equipe de moderação.
          </div>
        )}

        {/* FEED DE POSTS */}
        <div className="space-y-4">
          {posts.map((post) => {
            const hasLiked = post.likedBy.includes(currentUserId);
            const hasSaved = post.savedBy.includes(currentUserId);
            const postComments = comments.filter(c => c.postId === post.id);

            return (
              <div key={post.id} className="bg-white p-5 rounded-base border border-border shadow-xs space-y-3">
                
                {/* Autor */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.authorAvatar} 
                      alt={post.authorName} 
                      className="w-10 h-10 rounded-full object-cover border border-border"
                    />
                    <div>
                      <strong className="text-xs font-bold text-foreground block">{post.authorName}</strong>
                      <span className="text-[11px] text-muted-foreground block">{post.authorHeadline}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    post.type === 'pergunta' ? 'bg-amber-100 text-amber-800' : 'bg-secondary text-primary'
                  }`}>
                    {post.type === 'pergunta' ? 'Dúvida' : 'Publicação'}
                  </span>
                </div>

                {/* Conteúdo */}
                <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] bg-background border border-border text-primary px-2 py-0.5 rounded-full font-medium">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Ações: Curtir, Comentar, Salvar e Denunciar */}
                <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleLikePost(post.id)}
                      className={`flex items-center gap-1 hover:text-primary transition-colors ${hasLiked ? 'text-brandOrange font-bold' : ''}`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.commentsCount} comentários</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleReport(post.id)}
                      className="hover:text-destructive transition-colors flex items-center gap-1 text-[11px]"
                      title="Reportar conteúdo para a moderação (RFS20)"
                    >
                      <Flag className="w-3.5 h-3.5" /> Denunciar
                    </button>

                    <button
                      onClick={() => toggleSavePost(post.id)}
                      className={`hover:text-primary transition-colors ${hasSaved ? 'text-primary font-bold' : ''}`}
                      title="Salvar publicação"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${hasSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* ÁREA DE COMENTÁRIOS EXPANSÍVEL */}
                {activeCommentPostId === post.id && (
                  <div className="pt-3 border-t border-border space-y-3 bg-background p-3 rounded-base">
                    <div className="space-y-2">
                      {postComments.map((c) => (
                        <div key={c.id} className="text-xs bg-white p-2.5 rounded-base border border-border">
                          <strong className="text-[11px] text-primary block">{c.authorName}</strong>
                          <p className="text-foreground text-[11px] mt-0.5">{c.content}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Escreva sua resposta técnica..."
                        className="flex-1 h-8 bg-white border border-border rounded-base px-2.5 text-xs text-foreground"
                      />
                      <button
                        onClick={() => handleSendComment(post.id)}
                        className="px-3 h-8 bg-primary text-white text-xs font-bold rounded-base hover:bg-primary-dark"
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>

      {/* PAINEL DIREITO: CONEXÕES POR GRAU DE AFINIDADE E TENDÊNCIAS (~280px) */}
      <div className="lg:col-span-4 space-y-4">
        
        {/* Sugestões de Conexão */}
        <div className="bg-white p-4 rounded-base border border-border shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h4 className="font-heading font-bold text-xs text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brandOrange" /> Conexões por Grau de Afinidade
            </h4>
            <span className="text-[10px] text-muted-foreground">Skills</span>
          </div>

          <div className="space-y-3">
            {suggestions.map((sug) => {
              const directConn = connections.find(c => 
                (c.userAId === currentUserId && c.userBId === sug.userId) ||
                (c.userAId === sug.userId && c.userBId === currentUserId)
              );
              const isConnected = directConn?.status === 'conectado' && directConn.degree === '1º grau';
              const degreeLabel = directConn ? directConn.degree : '2º grau';

              const shared = sug.skills.filter(s => mySkillsLower.includes(s.toLowerCase()));
              const affinity = Math.min(95, 72 + shared.length * 8);

              return (
                <div key={sug.id} className="p-2.5 rounded-base bg-background border border-border space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <img src={sug.avatar} alt={sug.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <strong className="text-[11px] text-foreground block leading-tight">{sug.name}</strong>
                        <span className="text-[10px] text-muted-foreground block truncate max-w-[140px]">{sug.headline}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-heading font-bold text-brandOrange shrink-0">
                      {affinity}% afim
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {sug.skills.slice(0, 4).map((sk, idx) => {
                      const isCommon = mySkillsLower.includes(sk.toLowerCase());
                      return (
                        <span
                          key={idx}
                          className={`text-[9px] px-1.5 py-0.2 rounded border ${
                            isCommon
                              ? 'bg-brandOrange/15 border-brandOrange/40 text-brandOrange font-bold'
                              : 'bg-white border-border text-foreground'
                          }`}
                        >
                          {sk}
                        </span>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[9px] text-primary font-semibold">{degreeLabel} de conexão</span>
                    {isConnected ? (
                      <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Conectado
                      </span>
                    ) : (
                      <button
                        onClick={() => connectToUser(sug.userId)}
                        className="px-2.5 py-1 bg-white hover:bg-secondary text-primary border border-border text-[10px] font-bold rounded flex items-center gap-1"
                      >
                        <UserPlus className="w-3 h-3" /> Conectar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tópicos em Alta */}
        <div className="bg-white p-4 rounded-base border border-border shadow-xs space-y-2">
          <h4 className="font-heading font-bold text-xs text-foreground border-b border-border pb-2">Assuntos Técnicos em Alta</h4>
          <ul className="text-xs space-y-1.5 text-muted-foreground">
            <li className="flex justify-between items-center hover:text-primary cursor-pointer">
              <span>#NextJS & React Architecture</span>
              <span className="text-[10px] font-bold">14 discussões</span>
            </li>
            <li className="flex justify-between items-center hover:text-primary cursor-pointer">
              <span>#AWS Serverless vs Containers</span>
              <span className="text-[10px] font-bold">9 discussões</span>
            </li>
            <li className="flex justify-between items-center hover:text-primary cursor-pointer">
              <span>#Databricks & PySpark</span>
              <span className="text-[10px] font-bold">7 discussões</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
};