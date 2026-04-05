"use client";

import { motion } from "framer-motion";
import { PlusCircle, UploadCloud, Edit3, BookOpen } from "lucide-react";
import { useState } from "react";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([
    { id: "rec:margherita-pizza", name: "Margherita Pizza", cost: 2.15, price: 16.00, ingredients: 4 },
    { id: "rec:spaghetti-carbonara", name: "Spaghetti Carbonara", cost: 4.80, price: 18.50, ingredients: 6 },
    { id: "rec:tiramisu", name: "Classic Tiramisu", cost: 3.20, price: 9.00, ingredients: 5 },
  ]);

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            Corporate Recipe Master <BookOpen className="w-6 h-6 text-primary" />
          </h1>
          <p className="text-muted-foreground mt-1">Manage, import, and dictate theoretical consumption ratios.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-foreground px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/10 transition-colors">
            <UploadCloud className="w-4 h-4" /> Import Recipes (CSV)
          </button>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <PlusCircle className="w-4 h-4" /> Manual Setup
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((rec, i) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex flex-col hover:border-primary/30 transition-colors group cursor-pointer relative"
          >
            <div className="absolute top-4 right-4 text-white/0 group-hover:text-white/40 hover:!text-primary transition-colors p-2">
              <Edit3 className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-bold text-foreground pr-8">{rec.name}</h3>
            <p className="text-xs text-muted-foreground font-mono mt-1 mb-4">{rec.id}</p>
            
            <div className="mt-auto space-y-3 pt-4 border-t border-white/5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Ingredients</span>
                <span className="font-semibold">{rec.ingredients} linked</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Plated Cost</span>
                <span className="font-mono text-amber-500">${rec.cost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Retail Price</span>
                <span className="font-mono text-green-400">${rec.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-muted-foreground">Gross Margin</span>
                <span className="font-bold text-foreground">{((rec.price - rec.cost) / rec.price * 100).toFixed(1)}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
