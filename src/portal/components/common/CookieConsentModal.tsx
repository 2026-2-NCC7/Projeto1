import React, { useState, useEffect } from 'react';
import { 
  Cookie, 
  ShieldCheck, 
  Check, 
  X, 
  Lock, 
  FileText, 
  Sliders, 
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { AnimatedIcon } from './AnimatedIcon';

const CONSENT_COOKIE_KEY = 'qitech_cookie_consent';

export interface CookiePreferences {
  essential: boolean;    // sempre true
  analytics: boolean;
  preferences: boolean;
}

export const CookieConsentModal: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  const [prefs, setPrefs] = useState<CookiePreferences>({
    essential: true,
    analytics: true,
    preferences: true
  });

  useEffect(() => {
    // Verifica se o usuário já forneceu consentimento
    const hasConsent = typeof document !== 'undefined' && document.cookie.includes(`${CONSENT_COOKIE_KEY}=`);
    if (!hasConsent) {
      // Exibe após 1 segundo de navegação
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (preferences: CookiePreferences) => {
    const val = encodeURIComponent(JSON.stringify(preferences));
    // Validade de 365 dias conforme boas práticas LGPD
    document.cookie = `${CONSENT_COOKIE_KEY}=${val}; max-age=${365 * 24 * 3600}; path=/; SameSite=Strict`;
    setShowBanner(false);
    setShowCustomizeModal(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ essential: true, analytics: true, preferences: true });
  };

  const handleRejectNonEssential = () => {
    saveConsent({ essential: true, analytics: false, preferences: false });
  };

  const handleSaveCustom = () => {
    saveConsent(prefs);
  };

  return (
    <>
      {/* 1. BANNER INFERIOR DE CONSENTIMENTO LGPD */}
      {showBanner && (
        <aside
          role="region"
          aria-label="Consentimento de Cookies e Privacidade LGPD"
          className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-xl z-50 bg-[#121722]/95 backdrop-blur-md border border-[#232D3F] p-5 rounded-2xl shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <AnimatedIcon type="cookie" size={20} animation="pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  Privacidade & Cookies (LGPD Lei nº 13.709/2018)
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Proteção Ativa
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Utilizamos cookies essenciais para manter sua sessão anônima segura (ticket sem dados pessoais), prevenir ataques de força bruta e assegurar a explicabilidade do algoritmo de matching.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#232D3F]">
            <button
              type="button"
              onClick={() => setShowPrivacyModal(true)}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 self-start sm:self-auto font-medium"
            >
              <span>Ver Política Completa & Direitos Art. 18</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl bg-[#0D111A] hover:bg-[#182130] border border-[#232D3F] text-slate-300 hover:text-white text-xs font-semibold transition-colors"
              >
                Rejeitar Opcionais
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="flex-1 sm:flex-initial px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all shadow-sm"
              >
                Aceitar Todos
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 2. MODAL COMPLETO DE POLÍTICA DE PRIVACIDADE & TERMOS LGPD */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121722] border border-[#232D3F] w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            
            {/* Header do Modal */}
            <div className="p-5 border-b border-[#232D3F] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center">
                  <AnimatedIcon type="shield" size={18} animation="pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Política de Privacidade & Governança LGPD
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Em conformidade com a Lei Federal nº 13.709/2018 (Artigos 18 e 20)
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#182130] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo da Política */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed font-sans">
              
              <section className="space-y-1.5">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>1. Princípio da Minimização de Dados & Ticket Magro</span>
                </h4>
                <p>
                  A plataforma Q.I. Tech adota a arquitetura de <strong>Ticket Magro de Autenticação (Lean Session Token)</strong>. Nossos cookies de sessão não transportam CPF, nome completo, faixa salarial ou contatos pessoais. Apenas um identificador opaco criptográfico (`ticketId`) transita pelo navegador com bandeira `SameSite=Strict`.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>2. Explicabilidade Algorítmica e Não-Discriminação (Art. 20)</span>
                </h4>
                <p>
                  Conforme o Artigo 20 da LGPD, você tem o direito garantido de solicitar revisão humana e auditoria de qualquer decisão automatizada tomada pelo algoritmo de matchmaking. Nenhum dado sensível relativo a raça, gênero, orientação sexual, convicções religiosas ou endereço físico residencial é processado pelos modelos neurais (Whisper + Qwen).
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>3. Seus Direitos como Titular dos Dados (Art. 18)</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
                  <li><strong>Confirmação e Acesso:</strong> Consultar todos os laudos técnicos emitidos pela inteligência artificial.</li>
                  <li><strong>Anonimização e Eliminação:</strong> Excluir seu histórico de entrevistas e gravações de áudio sem penalidades.</li>
                  <li><strong>Revogação do Consentimento:</strong> Desativar o modo de visibilidade das empresas a qualquer instante.</li>
                  <li><strong>Portabilidade de Dados:</strong> Baixar laudos técnicos prévios em formato PDF estruturado auditável.</li>
                </ul>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Cookie className="w-4 h-4 text-amber-400" />
                  <span>4. Tipos de Cookies Utilizados</span>
                </h4>
                <div className="space-y-2 pt-1">
                  <div className="p-3 rounded-xl bg-[#0D111A] border border-[#232D3F]">
                    <strong className="text-white block font-semibold">Cookies Estritamente Necessários (Sempre Ativos):</strong>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      `qitech_ticket` (sessão magra), `qitech_sec_lockout` (proteção de força bruta contra invasões), `qitech_cookie_consent`.
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0D111A] border border-[#232D3F]">
                    <strong className="text-white block font-semibold">Cookies Analíticos & de Desempenho (Opcionais):</strong>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Métricas de latência de áudio do Whisper e estatísticas agregadas de aderência técnica sem identificação pessoal.
                    </span>
                  </div>
                </div>
              </section>

              <section className="p-3.5 rounded-xl bg-[#0D111A] border border-emerald-500/25 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-emerald-400 block font-semibold">Canal do Encarregado de Dados (DPO)</strong>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Para exercer seus direitos de revogação ou esclarecer dúvidas de privacidade: <span className="text-white font-mono">dpo@qitech.com.br</span>.
                  </p>
                </div>
              </section>

            </div>

            {/* Footer com Ações */}
            <div className="p-4 border-t border-[#232D3F] bg-[#0D111A] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all"
              >
                Entendi e Concordo
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

