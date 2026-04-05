"use client";

import { motion } from "framer-motion";
import { UploadCloud, FileSpreadsheet, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function SalesUploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <FileSpreadsheet className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">POS Sales Import</h1>
        <p className="text-muted-foreground">Upload end-of-day Excel (.xlsx) sales reports to automatically deduce theoretically consumed ingredients.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
          dragActive ? 'border-primary bg-primary/5' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept=".xlsx,.xls,.csv"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
        />
        
        <div className="text-center pointer-events-none">
          {file ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
              <div className="inline-flex bg-green-400/20 p-4 rounded-full text-green-400 mb-2">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{file.name}</h3>
              <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB ready for import.</p>
              <button className="mt-4 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-medium shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 transition-transform flex items-center gap-2 mx-auto pointer-events-auto">
                Process Ledger Events <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4 text-muted-foreground">
              <UploadCloud className="w-12 h-12 mx-auto" />
              <h3 className="text-lg font-medium text-foreground">Drag & drop your POS export here</h3>
              <p className="text-sm">or click anywhere to browse your files</p>
            </div>
          )}
        </div>
      </motion.div>

      <div className="glass-card p-6 border-l-4 border-l-primary">
        <h4 className="font-semibold text-foreground mb-2">Determinism Guarantee</h4>
        <p className="text-sm text-muted-foreground">When sales are imported, the system maps each menu item sold to its active recipe constituents. A single immutable <code>ConsumptionDeduced</code> event is appended to the ledger, automatically debiting theoretical inventory without destroying historical states.</p>
      </div>
    </div>
  );
}
