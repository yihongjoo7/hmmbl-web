'use client';
interface Tab { id: string; label: string; badge?: number; }
interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  variant?: 'line' | 'pill';
}

export function TabBar({ tabs, activeTab, onTabChange, variant = 'line' }: TabBarProps) {
  if (variant === 'pill') return (
    <div className="flex gap-2 p-1 bg-bg-tertiary rounded-lg">
      {tabs.map((tab) => (
        <button key={tab.id} onClick={() => onTabChange(tab.id)}
          className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
            ${activeTab === tab.id ? 'bg-bg-primary text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}>
          {tab.label}
          {tab.badge !== undefined && tab.badge > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-info-light text-info-text">{tab.badge}</span>
          )}
        </button>
      ))}
    </div>
  );
  return (
    <div className="flex border-b border-border-default">
      {tabs.map((tab) => (
        <button key={tab.id} onClick={() => onTabChange(tab.id)}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px
            ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
          {tab.label}
          {tab.badge !== undefined && tab.badge > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-error-light text-error-hover">{tab.badge}</span>
          )}
        </button>
      ))}
    </div>
  );
}
