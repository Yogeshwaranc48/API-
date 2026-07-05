import { useState, useCallback, useRef } from 'react';
import { Activity, ShieldAlert, Key, Server, RotateCcw } from 'lucide-react';

type LogEntry = {
  id: number;
  time: string;
  method: string;
  url: string;
  status: number;
  response: any;
};

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logCounter = useRef(0);

  const addLog = (method: string, url: string, status: number, response: any) => {
    setLogs(prev => [{
      id: ++logCounter.current,
      time: new Date().toLocaleTimeString(),
      method,
      url,
      status,
      response
    }, ...prev].slice(0, 50));
  };

  const makeRequest = useCallback(async (method: string, url: string, body?: any) => {
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined
      });
      
      const data = await res.json();
      addLog(method, url, res.status, data);
    } catch (err: any) {
      addLog(method, url, 500, { error: err.message });
    }
  }, []);

  const clearLogs = () => setLogs([]);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-slate-300 font-sans p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="border-b border-white/10 pb-6">
          <h1 className="text-3xl font-medium text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 p-1.5 bg-emerald-500 rounded text-black" />
            API Rate Limiter
          </h1>
          <p className="mt-2 text-white/40 max-w-2xl text-[11px] font-mono leading-relaxed">
            Demonstrating Express.js rate limiting. The general API allows 100 requests per 15 minutes. 
            The protected login route is strictly limited to 5 requests per 15 minutes.
          </p>
        </header>

        <div className="grid md:grid-cols-12 gap-8">
          
          {/* Controls Panel */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-[#0f0f12] border border-white/10 rounded-xl p-6">
              <h2 className="text-[10px] font-bold uppercase tracking-tighter text-white/40 mb-4">Endpoints</h2>
              
              <div className="space-y-4">
                <button 
                  onClick={() => makeRequest('GET', '/api')}
                  className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-transparent transition-colors rounded-lg group"
                >
                  <div className="flex items-center gap-3">
                    <Server className="w-5 h-5 text-emerald-500" />
                    <span className="font-mono text-sm text-white/80 group-hover:text-white">GET /api</span>
                  </div>
                  <span className="text-[11px] text-white/40 font-mono group-hover:text-white/60">100/15m</span>
                </button>

                <button 
                  onClick={() => makeRequest('GET', '/api/users')}
                  className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-transparent transition-colors rounded-lg group"
                >
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-blue-400" />
                    <span className="font-mono text-sm text-white/80 group-hover:text-white">GET /api/users</span>
                  </div>
                  <span className="text-[11px] text-white/40 font-mono group-hover:text-white/60">100/15m</span>
                </button>

                <button 
                  onClick={() => makeRequest('POST', '/api/login', { username: 'test' })}
                  className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-red-500/20 transition-colors rounded-lg group"
                >
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-emerald-500" />
                    <span className="font-mono text-sm text-white/80 group-hover:text-white">POST /api/login</span>
                  </div>
                  <span className="text-[11px] text-red-400/80 font-mono group-hover:text-red-400">5/15m</span>
                </button>
              </div>

              <div className="mt-8 p-4 bg-black/40 rounded-lg border border-white/5 text-[11px] text-white/60">
                <p>Spam the POST /api/login button to observe the strict rate limit kicking in (HTTP 429).</p>
              </div>
            </div>
          </div>

          {/* Logs Panel */}
          <div className="md:col-span-7">
            <div className="bg-[#0f0f12] border border-white/10 rounded-xl h-[600px] flex flex-col overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#16161a]">
                <h2 className="text-[10px] font-bold uppercase tracking-tighter text-white/40">Request Logs</h2>
                <button 
                  onClick={clearLogs}
                  className="text-[11px] flex items-center gap-2 text-white/40 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Clear
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs bg-[#0c0c0e]">
                {logs.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-white/40">
                    No requests sent yet
                  </div>
                ) : (
                  logs.map(log => (
                    <div 
                      key={log.id} 
                      className={`p-3 rounded border ${
                        log.status === 429 
                          ? 'bg-red-500/10 border-red-500/20 text-red-300' 
                          : log.status >= 400 
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                            : 'bg-black/40 border-white/5 text-white/80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                            log.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {log.method}
                          </span>
                          <span className="text-white">{log.url}</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/40">
                          <span>{log.time}</span>
                          <span className={`font-bold ${log.status === 429 ? 'text-red-400' : log.status === 200 ? 'text-emerald-400' : ''}`}>
                            {log.status}
                          </span>
                        </div>
                      </div>
                      <pre className="overflow-x-auto whitespace-pre-wrap opacity-80">
                        {JSON.stringify(log.response, null, 2)}
                      </pre>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
