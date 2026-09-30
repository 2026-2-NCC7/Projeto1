import React, { useState } from 'react';
import { useApp, ActivePersona } from '../context/AppContext';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Lock,
  Mail,
  KeyRound,
  LogIn,
  Building2,
  User,
  Zap,
  Award,
  Users,
  ChevronDown,
  X,
  Briefcase,
  Sparkles
} from 'lucide-react';

type LoginTab = 'profissional' | 'empresa' | 'admin';

interface AccountCredential {
  id: ActivePersona;
  tab: LoginTab;
  name: string;
  role: string;
  email: string;
  cnpj?: string;
  password: string;
}

export const PersonaSelectorView: React.FC<{ onEnterApp: () => void }> = ({ onEnterApp }) => {
  const { login, commercialConfig, vacancies, companies } = useApp();

  const accounts: AccountCredential[] = [
    {
      id: 'candidato-lucas',
      tab: 'profissional',
      name: 'Lucas Almeida',
      role: 'Desenvolvedor Front-end Pleno',
      email: 'lucas@qitech.com.br',
      password: '123456'
    },
    {
      id: 'candidato-marina',
      tab: 'profissional',
      name: 'Marina Costa',
      role: 'Engenheira de Dados Sênior',
      email: 'marina@qitech.com.br',
      password: '123456'
    },
    {
      id: 'comunidade-rafael',
      tab: 'profissional',
      name: 'Rafael Mendes',
      role: 'DevOps & Cloud Engineer (Comunidade)',
      email: 'rafael@comunidade.com.br',
      password: '123456'
    },
    {
      id: 'empresa-orion',
      tab: 'empresa',
      name: 'Orion Tech Solutions',
      role: 'Cliente Corporativo B2B',
      email: 'recrutamento@oriontech.com.br',
      cnpj: '45.123.890/0001-99',
      password: '123456'
    },
    {
      id: 'admin-qitech',
      tab: 'admin',
      name: 'Governança Q.I. Tech',
      role: 'Backoffice & Operações',
      email: 'admin@qitech.com.br',
      password: '123456'
    }
  ];

  // Controle do Menu Suspenso no Ícone de Login e do Modal de Autenticação
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeLoginTab, setActiveLoginTab] = useState<LoginTab>('profissional');
  const [selectedAccountId, setSelectedAccountId] = useState<ActivePersona>('candidato-lucas');
  const [emailInput, setEmailInput] = useState('lucas@qitech.com.br');
  const [cnpjInput, setCnpjInput] = useState('45.123.890/0001-99');
  const [passwordInput, setPasswordInput] = useState('123456');
  const [errorMsg, setErrorMsg] = useState('');

  const openLoginForPortal = (tab: LoginTab, defaultAccount?: ActivePersona) => {
    setShowAccountDropdown(false);
    setActiveLoginTab(tab);
    setErrorMsg('');
    const targetAcc = defaultAccount
      ? accounts.find(a => a.id === defaultAccount)
      : accounts.find(a => a.tab === tab);
    if (targetAcc) {
      setSelectedAccountId(targetAcc.id);
      setEmailInput(targetAcc.email);
      if (targetAcc.cnpj) setCnpjInput(targetAcc.cnpj);
      setPasswordInput(targetAcc.password);
    }
    setShowLoginModal(true);
  };

  const handleSelectAccountFromDropdown = (accountId: ActivePersona) => {
    const acc = accounts.find(a => a.id === accountId);
    if (!acc) return;
    setSelectedAccountId(acc.id);
    setActiveLoginTab(acc.tab);
    setEmailInput(acc.email);
    if (acc.cnpj) setCnpjInput(acc.cnpj);
    setPasswordInput(acc.password);
    setErrorMsg('');
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = accounts.find(
      a => a.email.toLowerCase() === emailInput.trim().toLowerCase()
    );
    if (!matched) {
      setErrorMsg('E-mail não encontrado. Selecione uma conta cadastrada na lista acima.');
      return;
    }
    if (!passwordInput.trim()) {
      setErrorMsg('Digite sua senha para continuar.');
      return;
    }
    setShowLoginModal(false);
    login(matched.id);
    onEnterApp();
  };

  const filteredAccounts = accounts.filter(a => a.tab === activeLoginTab);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      
      {/* BARRA DE NAVEGAÇÃO COMERCIAL COM ÍCONE DE LOGIN NO TOPO DIREITO */}
      <header className="sticky top-0 z-40 bg-brandNavy text-white border-b border-white/10">
        <div className="max-w-[1320px] mx-auto h-16 px-4 sm:px-8 flex items-center justify-between">
          
          {/* Logo Comercial */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-base bg-primary flex items-center justify-center font-heading font-bold text-white text-lg shadow-xs">
              Q
            </div>
            <div>
              <span className="font-heading font-bold text-white text-lg tracking-tight block leading-none">
                Q.I. Tech
              </span>
              <span className="text-[10px] text-brandNavySub block mt-0.5">
                Talent & Community Cloud
              </span>
            </div>
          </div>

          {/* Links de Navegação do Site */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-brandNavySub">
            <a href="#solucoes" className="hover:text-white transition-colors">Soluções</a>
            <a href="#vagas" className="hover:text-white transition-colors">Vagas Abertas</a>
            <a href="#para-empresas" className="hover:text-white transition-colors">Para Empresas</a>
          </nav>

          {/* ÍCONE DE LOGIN COM LISTA SUSPENSA (COMO NOS SITES REAIS) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-base bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white transition-all"
              title="Acessar minha conta"
            >
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <span>Entrar</span>
              <ChevronDown className="w-3.5 h-3.5 text-brandNavySub" />
            </button>

            {/* LISTA SUSPENSA DE ACESSO */}
            {showAccountDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-foreground rounded-base border border-border shadow-xl py-2 z-50">
                <div className="px-3.5 py-1.5 border-b border-border">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Selecione seu Portal de Acesso
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => openLoginForPortal('profissional', 'candidato-lucas')}
                  className="w-full px-3.5 py-2.5 text-left hover:bg-secondary/60 flex items-center gap-2.5 transition-colors"
                >
                  <User className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <strong className="text-xs font-bold text-foreground block">Profissional & Comunidade</strong>
                    <span className="text-[10px] text-muted-foreground">Candidatos e membros da rede</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => openLoginForPortal('empresa', 'empresa-orion')}
                  className="w-full px-3.5 py-2.5 text-left hover:bg-secondary/60 flex items-center gap-2.5 transition-colors"
                >
                  <Building2 className="w-4 h-4 text-brandOrange shrink-0" />
                  <div>
                    <strong className="text-xs font-bold text-foreground block">Portal da Empresa (B2B)</strong>
                    <span className="text-[10px] text-muted-foreground">Recrutadores, vagas e NFS-e</span>
                  </div>
                </button>

                <div className="border-t border-border mt-1 pt-1">
                  <button
                    type="button"
                    onClick={() => openLoginForPortal('admin', 'admin-qitech')}
                    className="w-full px-3.5 py-2 text-left hover:bg-secondary/60 flex items-center gap-2.5 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-gray-800 shrink-0" />
                    <div>
                      <strong className="text-xs font-bold text-foreground block">Administração Q.I. Tech</strong>
                      <span className="text-[10px] text-muted-foreground">Governança, preços e LGPD</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* HERO COMERCIAL */}
      <section className="bg-brandNavy text-white py-14 sm:py-20 border-b border-white/10">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brandOrange text-xs font-bold border border-white/10">
              <Sparkles className="w-3.5 h-3.5" /> Plataforma de Recrutamento Invertido & Comunidade Tech
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold leading-tight text-white">
              Contratação técnica em dias, não meses — com <span className="text-brandOrange">1º Match Grátis</span> e Privacidade Total.
            </h1>

            <p className="text-sm sm:text-base text-brandNavySub max-w-2xl leading-relaxed">
              Conectamos empresas a talentos de tecnologia pré-validados por IA com proteção de dados via Double Opt-In e indicações recompensadas na comunidade.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => openLoginForPortal('empresa', 'empresa-orion')}
                className="px-5 py-3 rounded-base bg-brandOrange hover:opacity-95 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all"
              >
                Contratar Talentos (1º Grátis) <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => openLoginForPortal('profissional', 'candidato-lucas')}
                className="px-5 py-3 rounded-base bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all"
              >
                Sou Profissional de Tecnologia
              </button>
            </div>
          </div>

          {/* Métricas de Impacto Comercial */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            <div className="p-5 rounded-base bg-white/5 border border-white/10">
              <span className="text-2xl sm:text-3xl font-heading font-bold text-brandOrange block">R$ 0</span>
              <span className="text-xs font-bold text-white mt-1 block">no 1º Candidato Aceito</span>
              <span className="text-[11px] text-brandNavySub">Cortesia imediata no Match Express</span>
            </div>

            <div className="p-5 rounded-base bg-white/5 border border-white/10">
              <span className="text-2xl sm:text-3xl font-heading font-bold text-[#4AD6E8] block">100%</span>
              <span className="text-xs font-bold text-white mt-1 block">Double Opt-In LGPD</span>
              <span className="text-[11px] text-brandNavySub">Dados liberados só após aceite</span>
            </div>

            <div className="p-5 rounded-base bg-white/5 border border-white/10">
              <span className="text-2xl sm:text-3xl font-heading font-bold text-emerald-400 block">
                +{commercialConfig.referralBonusEstalecas} 🪙
              </span>
              <span className="text-xs font-bold text-white mt-1 block">Estalecas Q.I.</span>
              <span className="text-[11px] text-brandNavySub">Por indicação aprovada na vaga</span>
            </div>

            <div className="p-5 rounded-base bg-white/5 border border-white/10">
              <span className="text-2xl sm:text-3xl font-heading font-bold text-white block">NFS-e</span>
              <span className="text-xs font-bold text-white mt-1 block">Faturamento Automático</span>
              <span className="text-[11px] text-brandNavySub">Desbloqueio avulso ou pacotes B2B</span>
            </div>
          </div>

        </div>
      </section>

      {/* OS 3 PILARES DO ECOSSISTEMA (TEXTO COMERCIAL DIRETO E TÍTULOS CLAROS) */}
      <section id="solucoes" className="py-14 max-w-[1320px] mx-auto px-4 sm:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
            Como funciona o ecossistema Q.I. Tech
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Três motores integrados para acelerar contratações e recompensar a comunidade técnica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pilar 1 */}
          <div className="bg-white p-6 rounded-base border border-border shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-base bg-brandOrange/15 text-brandOrange flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-foreground">
                1. Motor Comercial B2B & Match Express
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Empresas publicam vagas com transparência salarial e recebem o <strong>1º candidato com Double Opt-In gratuitamente</strong>. Perfis adicionais são desbloqueados sob demanda (R$ {commercialConfig.singleUnlockPriceBrl} ou pacotes de créditos com emissão automática de NFS-e).
              </p>
            </div>
            <button
              type="button"
              onClick={() => openLoginForPortal('empresa', 'empresa-orion')}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 pt-2"
            >
              Acessar Portal Corporativo <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pilar 2 */}
          <div className="bg-white p-6 rounded-base border border-border shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-base bg-secondary text-primary flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-foreground">
                2. "Quem Indica" Gamificado (Estalecas Q.I.)
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Profissionais que indicam colegas por link rastreável ganham <strong>+{commercialConfig.referralBonusEstalecas} Estalecas Q.I.</strong> na aprovação, resgatáveis por vouchers de certificação AWS, cursos e eventos (sem alterar o score técnico).
              </p>
            </div>
            <button
              type="button"
              onClick={() => openLoginForPortal('profissional', 'candidato-lucas')}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 pt-2"
            >
              Ver Carteira & Recompensas <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pilar 3 */}
          <div className="bg-white p-6 rounded-base border border-border shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-base bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-foreground">
                3. Comunidade por Grau de Afinidade & IA Explicável
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Conexões recomendadas pelo <strong>grau de sobreposição de habilidades</strong> (1º, 2º e 3º grau) para destravar dúvidas técnicas, com entrevista opcional por IA auditável conforme o Art. 20 da LGPD.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openLoginForPortal('profissional', 'comunidade-rafael')}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 pt-2"
            >
              Explorar Comunidade Técnica <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* VITRINE DE VAGAS COM TRANSPARÊNCIA SALARIAL */}
      <section id="vagas" className="py-10 bg-white border-y border-border">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">
                Oportunidades em Destaque com Faixa Salarial Transparente
              </h2>
              <p className="text-xs text-muted-foreground">
                Todas as empresas parceiras divulgam remuneração aberta antes do seu aceite.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openLoginForPortal('profissional', 'candidato-lucas')}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              Entrar como candidato <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vacancies.slice(0, 4).map((vac) => {
              const comp = companies.find(c => c.id === vac.companyId);
              return (
                <div key={vac.id} className="p-5 rounded-base bg-background border border-border flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-primary bg-secondary px-2.5 py-0.5 rounded">
                        {vac.area} • {vac.seniority}
                      </span>
                      {vac.isUrgentMatchExpress && (
                        <span className="text-[10px] bg-brandOrange/15 text-brandOrange font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Match Express
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading font-bold text-sm text-foreground">{vac.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {comp?.name} • {vac.modality} ({vac.location})
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {vac.mandatorySkills.map((sk, idx) => (
                        <span key={idx} className="text-[10px] bg-white border border-border px-2 py-0.5 rounded text-foreground font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Faixa Salarial Mensal</span>
                      <strong className="text-xs sm:text-sm font-bold text-foreground">
                        R$ {vac.salaryMin.toLocaleString('pt-BR')} — R$ {vac.salaryMax.toLocaleString('pt-BR')}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => openLoginForPortal('profissional', 'candidato-lucas')}
                      className="px-3.5 py-1.5 rounded-base bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all"
                    >
                      Ver Compatibilidade
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PLANOS COMERCIAIS PARA EMPRESAS */}
      <section id="para-empresas" className="py-12 max-w-[1320px] mx-auto px-4 sm:px-8">
        <div className="bg-brandNavy text-white rounded-base p-6 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-xl sm:text-2xl font-heading font-bold">
              Recrutamento B2B sem mensalidade fixa obrigatória
            </h2>
            <p className="text-xs sm:text-sm text-brandNavySub leading-relaxed">
              Publique sua vaga com Match Express, receba o 1º candidato confirmado gratuitamente e desbloqueie novos perfis apenas quando quiser (R$ {commercialConfig.singleUnlockPriceBrl} avulso ou pacote de 5 créditos por R$ {commercialConfig.package5PriceBrl}).
            </p>
          </div>
          <button
            type="button"
            onClick={() => openLoginForPortal('empresa', 'empresa-orion')}
            className="px-5 py-3 rounded-base bg-brandOrange hover:opacity-95 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 shadow-md"
          >
            <Building2 className="w-4 h-4" /> Acessar Conta Empresa
          </button>
        </div>
      </section>

      {/* RODAPÉ COMERCIAL */}
      <footer className="bg-white border-t border-border py-6 text-xs text-muted-foreground">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary text-white font-heading font-bold text-xs flex items-center justify-center">
              Q
            </div>
            <span className="font-bold text-foreground">Q.I. Tech</span>
            <span>© 2026 Todos os direitos reservados.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacidade & LGPD</span>
            <span>Termos Corporativos</span>
            <button
              type="button"
              onClick={() => openLoginForPortal('admin', 'admin-qitech')}
              className="hover:text-primary font-semibold"
            >
              Backoffice
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL DE LOGIN (SÓ ABRE QUANDO O USUÁRIO CLICA NO ÍCONE DE LOGIN OU BOTÃO DE ENTRADA) */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-base border border-border max-w-md w-full p-6 shadow-2xl space-y-5">
            
            {/* Topo do Modal */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-base bg-primary flex items-center justify-center font-heading font-bold text-white text-sm">
                  Q
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-foreground">Entrar na Q.I. Tech</h3>
                  <span className="text-[11px] text-muted-foreground block">
                    Autenticação segura por perfil
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="p-1 rounded hover:bg-background text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Abas de Tipo de Conta */}
            <div className="grid grid-cols-3 gap-1.5 bg-background p-1 rounded-base border border-border">
              <button
                type="button"
                onClick={() => openLoginForPortal('profissional')}
                className={`py-2 px-2 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                  activeLoginTab === 'profissional' ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Profissional
              </button>
              <button
                type="button"
                onClick={() => openLoginForPortal('empresa')}
                className={`py-2 px-2 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                  activeLoginTab === 'empresa' ? 'bg-brandOrange text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Empresa
              </button>
              <button
                type="button"
                onClick={() => openLoginForPortal('admin')}
                className={`py-2 px-2 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                  activeLoginTab === 'admin' ? 'bg-gray-900 text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Admin
              </button>
            </div>

            {/* Lista Suspensa de Contas Registradas para Preenchimento Rápido */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Selecionar Conta Cadastrada
              </label>
              <select
                value={selectedAccountId}
                onChange={(e) => handleSelectAccountFromDropdown(e.target.value as ActivePersona)}
                className="w-full h-9 px-3 text-xs bg-secondary/40 border border-border rounded-base font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {filteredAccounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} — {acc.role} ({acc.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Formulário de Credenciais */}
            <form onSubmit={handleFormLogin} className="space-y-3.5">
              {activeLoginTab === 'empresa' && (
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">CNPJ Corporativo</label>
                  <input
                    type="text"
                    value={cnpjInput}
                    onChange={(e) => setCnpjInput(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-background border border-border rounded-base font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">E-mail</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setErrorMsg('');
                    }}
                    className="w-full h-9 pl-9 pr-3 text-xs bg-background border border-border rounded-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Senha</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setErrorMsg('');
                    }}
                    className="w-full h-9 pl-9 pr-3 text-xs bg-background border border-border rounded-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-destructive font-medium">{errorMsg}</p>
              )}

              <button
                type="submit"
                className={`w-full h-10 font-bold text-xs rounded-base flex items-center justify-center gap-2 text-white shadow-sm transition-all ${
                  activeLoginTab === 'empresa'
                    ? 'bg-brandOrange hover:opacity-95'
                    : activeLoginTab === 'admin'
                    ? 'bg-gray-900 hover:bg-black'
                    : 'bg-primary hover:bg-primary-dark'
                }`}
              >
                <LogIn className="w-4 h-4" /> Entrar na Plataforma
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};