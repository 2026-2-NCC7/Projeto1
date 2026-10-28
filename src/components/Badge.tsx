import React from 'react';

interface BadgeProps {
  status: string;
  label?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, label, size = 'sm' }) => {
  const normalized = status.toUpperCase();
  let badgeClass = 'badge-nao-avaliada';
  let displayLabel = label || status;

  switch (normalized) {
    case 'EVIDENCIADA':
    case 'ATENDIDO':
    case 'CONSOLIDADO':
    case 'ATIVO':
      badgeClass = 'badge-evidenciada';
      break;
    case 'PARCIALMENTE_EVIDENCIADA':
    case 'PARCIALMENTE_ATENDIDO':
      badgeClass = 'badge-parcial';
      break;
    case 'EVIDENCIA_INSUFICIENTE':
    case 'EM_REVISAO':
    case 'SUBMETIDA':
      badgeClass = 'badge-insuficiente';
      break;
    case 'NAO_AVALIADA':
    case 'PENDENTE_AVALIACAO':
    case 'PRELIMINAR':
      badgeClass = 'badge-nao-avaliada';
      break;
    case 'DIVERGENCIA_IDENTIFICADA':
    case 'NAO_ATENDIDO':
    case 'ENCAMINHADA_HUMANO':
      badgeClass = 'badge-divergencia';
      break;
    case 'HARD':
      badgeClass = 'badge-cyan';
      break;
    case 'SOFT':
      badgeClass = 'badge-parcial';
      break;
    default:
      badgeClass = 'badge-cyan';
  }

  const fontSize = size === 'sm' ? '0.72rem' : '0.85rem';
  const padding = size === 'sm' ? '0.2rem 0.55rem' : '0.35rem 0.8rem';

  return (
    <span className={`badge ${badgeClass}`} style={{ fontSize, padding }}>
      {displayLabel.replace(/_/g, ' ')}
    </span>
  );
};
