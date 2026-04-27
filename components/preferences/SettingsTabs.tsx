'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  description?: string;
}

interface SettingsTabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export function SettingsTabs({ tabs, defaultTab }: SettingsTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const ids = useMemo(() => new Set(tabs.map((t) => t.id)), [tabs]);
  const fallback = defaultTab && ids.has(defaultTab) ? defaultTab : (tabs[0]?.id ?? '');
  const queryTab = searchParams.get('tab');
  const active = queryTab && ids.has(queryTab) ? queryTab : fallback;

  const setActive = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', id);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const activeTab = tabs.find((t) => t.id === active) ?? tabs[0];
  if (!activeTab) return null;

  return (
    <div>
      {/* Tab strip — horizontal scroll em mobile */}
      <div
        role="tablist"
        aria-label="Seções das configurações"
        className="border-outline-variant/40 -mx-4 mb-8 flex gap-1 overflow-x-auto border-b px-4 sm:mx-0 sm:px-0"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={`font-sans relative shrink-0 px-4 py-3 text-sm tracking-wide transition-colors ${
                isActive ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab.label}
              {/* Underline ativo — vai além do border-b do strip */}
              <span
                aria-hidden
                className={`absolute right-0 -bottom-px left-0 h-0.5 transition-all ${
                  isActive ? 'bg-primary' : 'bg-transparent'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Painel ativo */}
      <div role="tabpanel" id={`tabpanel-${activeTab.id}`} aria-labelledby={`tab-${activeTab.id}`}>
        {activeTab.description ? (
          <p className="text-on-surface-variant font-sans mb-8 text-sm italic">
            {activeTab.description}
          </p>
        ) : null}
        {activeTab.content}
      </div>
    </div>
  );
}
