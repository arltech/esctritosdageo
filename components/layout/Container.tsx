import { type ElementType, type ReactNode } from 'react';

/**
 * Container — wrapper de leitura.
 *
 * Largura máxima 680px (medida ideal para texto longo, ~65 caracteres),
 * centralizado horizontalmente, com padding lateral responsivo.
 * Usado em todas as superfícies de conteúdo: editor, lista, páginas públicas.
 */

interface ContainerProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

export function Container({ children, as: Component = 'div', className = '' }: ContainerProps) {
  return (
    <Component className={`mx-auto w-full max-w-[680px] px-6 sm:px-8 ${className}`.trim()}>
      {children}
    </Component>
  );
}
