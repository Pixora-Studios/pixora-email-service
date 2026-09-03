import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { Overview } from './pages/Overview';
import { Sandbox } from './pages/Sandbox';
import { Templates } from './pages/Templates';
import { ApiKeys } from './pages/ApiKeys';
import { Providers } from './pages/Providers';
import { Logs } from './pages/Logs';
import { Docs } from './pages/Docs';
import { api } from './services/api';
import { OverviewStats, ProviderConfig, StoredApiKey, EmailTemplate, EmailLog } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [sandboxSlug, setSandboxSlug] = useState<string>('appointment-booking');
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [providers, setProviders] = useState<ProviderConfig[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [apiKeys, setApiKeys] = useState<StoredApiKey[]>([]);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [statsRes, tplRes, keysRes, logsRes] = await Promise.allSettled([
        api.getStats(),
        api.getTemplates(),
        api.getKeys(),
        api.getLogs(100),
      ]);

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.stats);
        setProviders(statsRes.value.providers);
      }
      if (tplRes.status === 'fulfilled') {
        setTemplates(tplRes.value.templates);
      }
      if (keysRes.status === 'fulfilled') {
        setApiKeys(keysRes.value.keys);
      }
      if (logsRes.status === 'fulfilled') {
        setLogs(logsRes.value.logs);
      }
    } catch (err) {
      console.error('Failed to refresh data', err);
    } finally {
      setIsRefreshing(false);
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Periodic light polling every 15s to keep metrics fresh
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleSelectInSandbox = (slug: string) => {
    setSandboxSlug(slug);
    setActiveTab('sandbox');
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar onRefresh={loadData} isRefreshing={isRefreshing} />

      <div className="flex-1 flex">
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-7xl">
          {initialLoading ? (
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400 font-mono">Connecting to Pixora Email Engine...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <Overview stats={stats} providers={providers} onNavigate={setActiveTab} />
              )}
              {activeTab === 'sandbox' && (
                <Sandbox
                  templates={templates}
                  initialSlug={sandboxSlug}
                  onEmailSent={loadData}
                />
              )}
              {activeTab === 'templates' && (
                <Templates
                  templates={templates}
                  onRefresh={loadData}
                  onSelectInSandbox={handleSelectInSandbox}
                />
              )}
              {activeTab === 'keys' && <ApiKeys keys={apiKeys} onRefresh={loadData} />}
              {activeTab === 'providers' && (
                <Providers providers={providers} onRefresh={loadData} />
              )}
              {activeTab === 'logs' && <Logs logs={logs} onRefresh={loadData} />}
              {activeTab === 'docs' && <Docs />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
