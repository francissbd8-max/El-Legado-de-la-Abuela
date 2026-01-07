
import React, { useState, useRef } from 'react';
import { enhanceRecipe } from '../services/geminiService';
import { Ingredient, RecipeStep, RecipeMedia } from '../types';

interface RecipeFormProps {
  onSave: (recipeData: any) => void;
  onCancel: () => void;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({ onSave, onCancel }) => {
  const [rawText, setRawText] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [view, setView] = useState<'ai' | 'manual'>('ai');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    familyRole: 'Abuela',
    origin: '',
    category: 'Platos Principales',
    difficulty: 'Media' as 'Fácil' | 'Media' | 'Dificil',
    prepTime: '',
    story: '',
    culturalNote: '',
    ancestralSecrets: ['', '', ''],
    ingredients: [{ name: '', amount: '' }] as Ingredient[],
    steps: [{ description: '', duration: '' }] as RecipeStep[],
    imageUrl: '',
    media: [] as RecipeMedia[],
  });

  const handleAIHelp = async () => {
    if (!rawText.trim()) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceRecipe(rawText);
      setFormData({ ...formData, ...enhanced, author: formData.author || "Anónimo" });
      setView('manual');
    } catch (error) {
      alert("Error con la IA. Inténtalo de nuevo.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleManualSave = () => {
    if (!formData.title || !formData.origin || formData.ingredients.length === 0 || formData.steps.length === 0) {
      alert("Por favor, rellena el título, el origen, al menos un ingrediente y un paso.");
      return;
    }
    let finalImageUrl = formData.imageUrl || `https://picsum.photos/seed/${Math.random()}/800/600`;
    onSave({ ...formData, imageUrl: finalImageUrl, createdAt: Date.now() });
  };

  return (
    <div className="bg-[#FDFCFB] rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] w-full mx-auto overflow-hidden flex flex-col max-h-[95vh] border border-stone-200">
      {/* Header Form */}
      <div className="bg-stone-900 px-12 py-10 text-white flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-3xl font-bold serif italic">Nueva Receta</h2>
          <p className="text-stone-400 text-[10px] uppercase tracking-[0.3em] mt-2">Documentando la historia familiar</p>
        </div>
        <button onClick={onCancel} className="bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="overflow-y-auto p-12 lg:p-16 scrollbar-hide">
        {view === 'ai' ? (
          <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8">
            <div className="bg-emerald-900 rounded-[2.5rem] p-12 text-white shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="text-3xl font-bold serif italic mb-4 flex items-center gap-3">
                    ✨ El Relato de la Abuela
                  </h3>
                  <p className="text-emerald-100 text-sm leading-relaxed mb-10 opacity-80">
                    Pega aquí un texto libre, notas desordenadas o el dictado de tu abuela. Nuestra IA estructurará la receta por ti preservando la esencia emocional.
                  </p>
                  <textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    className="w-full h-80 p-8 bg-white/10 border border-white/20 rounded-[2rem] shadow-inner focus:bg-white/15 outline-none transition-all resize-none text-white leading-relaxed placeholder:text-white/20"
                    placeholder="Ej: Mi abuela siempre hacía este guiso cuando llovía. Ponía un kilo de patatas y mucha paciencia..."
                  />
                  <div className="mt-10 flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleAIHelp}
                      disabled={isEnhancing || !rawText}
                      className="flex-grow bg-white text-emerald-900 py-5 rounded-2xl font-bold transition-all shadow-xl hover:scale-[1.02] disabled:opacity-50"
                    >
                      {isEnhancing ? 'Estructurando memorias...' : 'Transformar Relato'}
                    </button>
                    <button onClick={() => setView('manual')} className="px-10 py-5 bg-emerald-800 text-emerald-100 rounded-2xl font-bold hover:bg-emerald-700 transition-colors">Saltar a manual</button>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-20 pb-20 animate-in fade-in slide-in-from-right-8">
            {/* Editor Manual */}
            <section className="space-y-10">
              <div className="border-b border-stone-100 pb-6 flex justify-between items-end">
                 <h3 className="text-3xl font-bold text-stone-900 serif italic">Detalles de la Receta</h3>
                 <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Paso 2 de 2</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase ml-2">Título del Plato</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-8 py-5 rounded-2xl bg-white border border-stone-200 outline-none focus:ring-4 focus:ring-emerald-500/10 text-lg serif font-bold" placeholder="Nombre de la receta..." />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase ml-2">Tu Nombre</label>
                  <input type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white border border-stone-200 outline-none focus:ring-4 focus:ring-emerald-500/10 text-sm" placeholder="Autor/a" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase ml-2">Origen / Región</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </span>
                    <input type="text" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-stone-200 outline-none focus:ring-4 focus:ring-emerald-500/10 text-sm italic" placeholder="Ej: Asturias, España" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase ml-2">Dificultad</label>
                  <select value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value as any})} className="w-full px-6 py-4 rounded-2xl bg-white border border-stone-200 outline-none focus:ring-4 focus:ring-emerald-500/10 text-sm">
                    <option>Fácil</option><option>Media</option><option>Dificil</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase ml-2">Categoría</label>
                  <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white border border-stone-200 outline-none focus:ring-4 focus:ring-emerald-500/10 text-sm" placeholder="Ej: Guisos, Postres..." />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase ml-2">La Historia (Contexto)</label>
                  <textarea value={formData.story} onChange={e => setFormData({...formData, story: e.target.value})} className="w-full h-32 px-6 py-4 rounded-2xl bg-white border border-stone-200 outline-none focus:ring-4 focus:ring-emerald-500/10 text-sm resize-none italic" placeholder="¿Por qué es especial este plato? Cuéntanos el legado emocional..." />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <label className="text-[10px] font-bold text-stone-400 uppercase ml-2">Secretos de Familia (Trucos de Abuela)</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {formData.ancestralSecrets.map((secret, idx) => (
                      <input key={idx} type="text" value={secret} onChange={e => {
                        const next = [...formData.ancestralSecrets];
                        next[idx] = e.target.value;
                        setFormData({...formData, ancestralSecrets: next});
                      }} placeholder={`Secreto #${idx+1}`} className="w-full px-6 py-4 rounded-2xl bg-white border border-stone-100 text-xs italic outline-none focus:ring-4 focus:ring-emerald-500/5 shadow-sm" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Ingredients & Steps with a more visual grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                 <div className="space-y-6">
                    <div className="flex justify-between items-center">
                       <h4 className="font-bold text-stone-900 uppercase text-xs tracking-widest flex items-center gap-2">
                         <span className="w-4 h-4 bg-emerald-100 text-emerald-700 rounded flex items-center justify-center text-[8px]">1</span>
                         Ingredientes
                       </h4>
                       <button onClick={() => setFormData({...formData, ingredients: [...formData.ingredients, {name:'', amount:''}]})} className="text-emerald-700 font-bold text-[10px] hover:underline">+ AÑADIR</button>
                    </div>
                    {formData.ingredients.map((ing, idx) => (
                      <div key={idx} className="flex gap-3 animate-in slide-in-from-left-4 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                        <input value={ing.name} onChange={e => {
                           const next = [...formData.ingredients];
                           next[idx].name = e.target.value;
                           setFormData({...formData, ingredients: next});
                        }} className="flex-grow px-4 py-3 bg-white border border-stone-100 rounded-xl text-sm" placeholder="Producto" />
                        <input value={ing.amount} onChange={e => {
                           const next = [...formData.ingredients];
                           next[idx].amount = e.target.value;
                           setFormData({...formData, ingredients: next});
                        }} className="w-24 px-4 py-3 bg-white border border-stone-100 rounded-xl text-sm text-center" placeholder="Cant." />
                      </div>
                    ))}
                 </div>
                 <div className="space-y-6">
                    <div className="flex justify-between items-center">
                       <h4 className="font-bold text-stone-900 uppercase text-xs tracking-widest flex items-center gap-2">
                         <span className="w-4 h-4 bg-emerald-100 text-emerald-700 rounded flex items-center justify-center text-[8px]">2</span>
                         Pasos de Preparación
                       </h4>
                       <button onClick={() => setFormData({...formData, steps: [...formData.steps, {description:'', duration:''}]})} className="text-emerald-700 font-bold text-[10px] hover:underline">+ AÑADIR</button>
                    </div>
                    {formData.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-4 animate-in slide-in-from-right-4 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                        <span className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center font-bold text-stone-400 text-xs shrink-0">{idx+1}</span>
                        <textarea value={step.description} onChange={e => {
                           const next = [...formData.steps];
                           next[idx].description = e.target.value;
                           setFormData({...formData, steps: next});
                        }} className="flex-grow p-4 bg-white border border-stone-100 rounded-2xl text-sm h-24 resize-none" placeholder="Describe este paso con detalle..." />
                      </div>
                    ))}
                 </div>
              </div>
            </section>

            <div className="fixed bottom-0 left-0 right-0 p-8 bg-white/95 backdrop-blur-xl border-t border-stone-100 flex gap-6 z-50">
               <button onClick={handleManualSave} className="flex-grow bg-emerald-900 text-white py-5 rounded-[2rem] font-bold hover:bg-emerald-950 transition-all shadow-2xl active:scale-95 text-xs uppercase tracking-widest">Guardar en el Legado</button>
               <button onClick={() => setView('ai')} className="px-12 bg-stone-100 text-stone-600 rounded-[2rem] font-bold text-[10px] uppercase tracking-widest hover:bg-stone-200 transition-colors">Volver al Dictado</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
