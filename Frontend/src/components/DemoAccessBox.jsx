import React from 'react';
import { KeyRound, Sparkles, Check, ShieldCheck, UserCheck, UserX } from 'lucide-react';

export default function DemoAccessBox({ onUseCredentials }) {
  const accounts = [
    {
      role: 'Admin',
      roleKey: 'admin',
      username: 'admin',
      password: 'Admin@123',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: ShieldCheck,
      description: 'Full Dashboard + Administration Menus',
    },
    {
      role: 'User',
      roleKey: 'user',
      username: 'operator',
      password: 'User@123',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: UserCheck,
      description: 'Monitoring Dashboard, No Admin Menus',
    },
    {
      role: 'Disabled Test',
      roleKey: 'user',
      username: 'disabled_user',
      password: 'User@123',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: UserX,
      description: 'Demonstrates disabled account error state',
    },
  ];

  return (
    <div className="mt-4 p-4 rounded-2xl bg-white/90 border border-slate-200/90 shadow-sm backdrop-blur-md transition-all hover:border-mint-300">
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-mint-100/80 text-mint-700 flex items-center justify-center">
            <KeyRound className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 tracking-tight">Demo Access</span>
            <span className="text-[10px] text-slate-400 ml-1.5 font-normal">(Mock Phase / Viva Demo)</span>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-[11px] font-medium text-mint-600 bg-mint-50 px-2 py-0.5 rounded-full border border-mint-200/70">
          <Sparkles className="w-3 h-3" />
          <span>1-Click Auto Fill</span>
        </div>
      </div>

      <div className="space-y-2">
        {accounts.map((acc) => {
          const Icon = acc.icon;
          return (
            <div
              key={acc.username}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/60 transition-colors group"
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className={`p-1 rounded-lg border text-xs font-semibold shrink-0 ${acc.badgeColor}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-slate-800">{acc.role}</span>
                    <span className="font-mono text-[11px] text-slate-500 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                      {acc.username}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 hidden sm:inline">
                      {acc.password}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">{acc.description}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onUseCredentials(acc.roleKey, acc.username, acc.password)}
                className="shrink-0 ml-2 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-mint-500 hover:text-slate-950 text-white transition-all duration-150 flex items-center space-x-1 shadow-sm active:scale-95"
              >
                <span>Use</span>
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-2 text-[10px] text-slate-400 text-center">
        Tip: Click "Use" to auto-select tab & populate credentials for presentation testing.
      </p>
    </div>
  );
}
