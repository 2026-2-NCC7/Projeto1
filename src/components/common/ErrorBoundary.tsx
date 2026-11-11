import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Trash2, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[QI Match ErrorBoundary] Erro capturado na renderização:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.hash = '';
    window.location.reload();
  };

  private handleResetData = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (_) {}
    window.location.hash = '';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#0A0C10] text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-[#121620] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-heading font-black text-white">
                  Instabilidade Detectada no Ecossistema
                </h2>
                <span className="text-xs text-slate-400">
                  O Motor de IA interceptou uma exceção de renderização para preservar seus dados.
                </span>
              </div>
            </div>

            {this.state.error && (
              <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 font-mono text-xs text-rose-400 overflow-x-auto max-h-40">
                <strong>Mensagem:</strong> {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto flex-1 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20"
              >
                <RotateCcw className="w-4 h-4 text-slate-950" />
                <span>Recarregar Plataforma</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetData}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-700"
                title="Limpa o armazenamento local para restaurar os dados originais do MVP"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>Resetar Estado da Demo</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
