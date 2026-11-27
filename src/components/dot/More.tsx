'use client';

import { ReactNode, useState } from 'react';
import { useT } from '../i18n';

/**
 * The detail of a note, folded: the sentence to remember stays visible, the rest opens on demand.
 * Everything stays on the page (and readable by search engines and screen readers), just not in the way.
 */
export default function More({ children, className = '' }: { children: ReactNode; className?: string }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <div className={className}>
      <div className="grid transition-[grid-template-rows] duration-[320ms] ease-[var(--ease-state)]" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
        <div className={`overflow-hidden transition-opacity duration-[320ms] ease-[var(--ease-state)] ${open ? 'opacity-100 delay-75' : 'opacity-0'}`} aria-hidden={!open}>
          <div className="space-y-3 pt-3">{children}</div>
        </div>
      </div>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="mt-2 text-black/55">
        {open ? t('− Réduire', '− Less') : t('+ Lire la suite', '+ Read more')}
      </button>
    </div>
  );
}
