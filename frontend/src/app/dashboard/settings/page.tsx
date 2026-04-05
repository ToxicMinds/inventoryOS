"use client";

import { motion } from "framer-motion";
import { Settings2, Shield, Bell, Network } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          System Configuration <Settings2 className="w-6 h-6 text-primary" />
        </h1>
        <p className="text-muted-foreground mt-1">Tenant-wide policy and integration rules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="p-2 bg-primary/10 rounded-lg"><Shield className="w-5 h-5 text-primary" /></div>
            <h2 className="text-lg font-bold">Access & Roles</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Require Ledger Audits</span>
              <div className="w-10 h-5 bg-primary/20 rounded-full relative cursor-pointer border border-primary">
                <div className="w-3 h-3 bg-primary rounded-full absolute right-1 top-1" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Auto-approve Transfers &lt; $50</span>
              <div className="w-10 h-5 bg-white/10 rounded-full relative cursor-pointer">
                <div className="w-3 h-3 bg-white/40 rounded-full absolute left-1 top-1" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg"><Network className="w-5 h-5 text-amber-500" /></div>
            <h2 className="text-lg font-bold">Integrations</h2>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Toast POS</p>
                <p className="text-xs text-muted-foreground">Active • Webhook Sync</p>
              </div>
              <button className="text-xs text-primary font-medium hover:underline">Configure</button>
            </div>
            <div className="p-3 bg-white/5 border border-dashed border-white/20 rounded-lg flex items-center justify-between opacity-50 grayscale">
              <div>
                <p className="text-sm font-medium text-foreground">QuickBooks Online</p>
                <p className="text-xs text-muted-foreground">Not connected</p>
              </div>
              <button className="text-xs bg-white/10 px-3 py-1 rounded text-foreground font-medium hover:bg-white/20">Connect</button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
