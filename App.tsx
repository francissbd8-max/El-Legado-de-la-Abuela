
import React, { useState, useEffect, useMemo } from 'react';
import { Recipe, AIAnalysis, MealPlan, DayOfWeek, MealPlanEntry, MealType, Ingredient, RecipeMedia, Challenge, Badge, Comment, Product } from './types';
import { RecipeCard } from './components/RecipeCard';
import { RecipeForm } from './components/RecipeForm';
import { getCulinaryWisdom, getPersonalizedSuggestions } from './services/geminiService';

const MOCK_BADGES: Badge[] = [
  { id: 'b1', name: 'Maestro de los Domingos', icon: '🏆', color: 'bg-amber-100 text-amber-700' },
  { id: 'b2', name: 'Guardián del Guiso', icon: '🍲', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'b3', name: 'Rey del Postre', icon: '🍰', color: 'bg-rose-100 text-rose-700' },
  { id: 'b4', name: 'Explorador de Tradiciones', icon: '🗺️', color: 'bg-indigo-100 text-indigo-700' }
];

const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'ch1',
    title: 'Misión: Fuera de la Red',
    description: 'Sube una receta que no exista en Google. Esos secretos que solo viven en servilletas viejas o en la memoria de tu familia.',
    endDate: Date.now() + 604800000, // 7 days from now
    isActive: true,
    prizeBadge: MOCK_BADGES[3],
    participantsCount: 142,
    imageUrl: 'https://images.unsplash.com/photo-1516054158913-91698e376046?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ch2',
    title: 'El Ingrediente Olvidado: Azafrán',
    description: 'Reivindiquemos el uso del azafrán en hebra como lo hacían nuestras bisabuelas en sus mejores arroces y guisos.',
    endDate: Date.now() + 259200000,
    isActive: true,
    prizeBadge: MOCK_BADGES[1],
    participantsCount: 89,
    imageUrl: 'https://images.unsplash.com/photo-1628156684813-f42f36d07d47?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ch3',
    title: 'Duelo de Tortillas',
    description: '¿Con cebolla? ¿Sin cebolla? ¿Poco hecha? Sube tu versión familiar y deja que la comunidad decida el Legado de Oro.',
    endDate: Date.now() + 1209600000,
    isActive: true,
    prizeBadge: MOCK_BADGES[0],
    participantsCount: 315,
    imageUrl: 'https://images.unsplash.com/photo-1594179047519-f347310d3322?auto=format&fit=crop&q=80&w=800'
  }
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'El Recetario Perdido: Repostería de Antaño',
    price: 14.99,
    description: 'Un compendio digital de 50 recetas de postres que marcaron nuestra infancia.',
    imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800',
    category: 'PDF',
    isDigital: true
  },
  {
    id: 'p2',
    name: 'Delantal de Lino "Herencia"',
    price: 35.00,
    description: 'Hecho a mano con lino orgánico. Bordado con hilos de algodón verde bosque.',
    imageUrl: 'https://images.unsplash.com/photo-1590736910113-17798305016e?auto=format&fit=crop&q=80&w=800',
    category: 'Textil',
    isDigital: false
  },
  {
    id: 'p3',
    name: 'Gorro de Chef Tradicional',
    price: 22.50,
    description: 'El clásico gorro plisado para los pequeños ayudantes de la casa.',
    imageUrl: 'https://images.unsplash.com/photo-1583394238182-6f3ad36b52a4?auto=format&fit=crop&q=80&w=800',
    category: 'Accesorios',
    isDigital: false
  },
  {
    id: 'p4',
    name: 'Pack Recetas de Verano (Digital)',
    price: 9.99,
    description: 'Gazpachos, ensaladas y guisos ligeros heredados del mediterráneo.',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800',
    category: 'PDF',
    isDigital: true
  }
];

const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Arroz con Leche de la Abuela Carmen',
    author: 'Elena',
    authorId: 'user_elena',
    familyRole: 'Abuela',
    story: 'Era el postre que nunca faltaba en Navidad en nuestra casa de Asturias.',
    ingredients: [{ name: 'Leche entera', amount: '1 Litro' }, { name: 'Arroz bomba', amount: '200g' }],
    steps: [{ description: 'Cocer el arroz con el limón y canela', duration: '15 min' }],
    prepTime: '60 min',
    difficulty: 'Media',
    category: 'Postres',
    origin: 'Asturias, España',
    imageUrl: 'https://images.unsplash.com/photo-1590080874088-eec64895b423?auto=format&fit=crop&q=80&w=800',
    media: [],
    createdAt: Date.now(),
    ancestralSecrets: ['Remover rítmicamente siempre hacia el mismo lado', 'Añadir la cáscara de limón solo al final'],
    culturalNote: 'Un postre emblemático del norte de España.',
    likes: 12,
    comments: [
      { id: 'c1', author: 'Pablo', familyRole: 'Nieto', text: '¡Lo hice ayer y salió clavado! El truco del limón es clave.', createdAt: Date.now() - 86400000 }
    ]
  }
];

const INITIAL_MEAL_PLAN: MealPlan = {
  'Lunes': [], 'Martes': [], 'Miércoles': [], 'Jueves': [], 'Viernes': [], 'Sábado': [], 'Domingo': []
};

const MEAL_TYPE_COLORS: Record<MealType, string> = {
  'Desayuno': 'text-sky-700 bg-sky-50/50 border-sky-100',
  'Comida': 'text-emerald-800 bg-emerald-50/50 border-emerald-100',
  'Merienda': 'text-amber-700 bg-amber-50/50 border-amber-100',
  'Cena': 'text-indigo-800 bg-indigo-50/50 border-indigo-100',
  'Postre': 'text-rose-700 bg-rose-50/50 border-rose-100'
};

const DAYS: DayOfWeek[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const MEAL_TYPES: MealType[] = ['Desayuno', 'Comida', 'Merienda', 'Cena', 'Postre'];

const App: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(MOCK_RECIPES);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'recetas' | 'retos' | 'planificador' | 'shop'>('recetas');
  
  const [aiWisdom, setAiWisdom] = useState<AIAnalysis | null>(null);
  const [isLoadingWisdom, setIsLoadingWisdom] = useState(false);
  const [userTaste, setUserTaste] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<{recipeId: string, reason: string}[]>([]);

  const [mealPlan, setMealPlan] = useState<MealPlan>(INITIAL_MEAL_PLAN);
  const [planningMode, setPlanningMode] = useState<{ active: boolean, day: DayOfWeek | null, step: 'day' | 'type' }>({ active: false, day: null, step: 'day' });

  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [shopCategory, setShopCategory] = useState<string>('Todas');
  const [commentForm, setCommentForm] = useState({ author: '', role: 'Nieto/a', text: '' });

  useEffect(() => {
    const saved = localStorage.getItem('family_recipes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecipes(parsed.length > 0 ? parsed : MOCK_RECIPES);
      } catch (e) { setRecipes(MOCK_RECIPES); }
    }
    const savedPlan = localStorage.getItem('family_meal_plan');
    if (savedPlan) {
      try {
        setMealPlan(JSON.parse(savedPlan));
      } catch (e) { setMealPlan(INITIAL_MEAL_PLAN); }
    }
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(recipes.map(r => r.category));
    return ['Todas', ...Array.from(cats)];
  }, [recipes]);

  const shopCategories = ['Todas', 'PDF', 'Textil', 'Accesorios'];

  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => activeCategory === 'Todas' || r.category === activeCategory);
  }, [recipes, activeCategory]);

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => shopCategory === 'Todas' || p.category === shopCategory);
  }, [shopCategory]);

  const saveRecipes = (updatedRecipes: Recipe[]) => {
    setRecipes(updatedRecipes);
    localStorage.setItem('family_recipes', JSON.stringify(updatedRecipes));
  };

  const handleLike = (recipeId: string) => {
    const updated = recipes.map(r => r.id === recipeId ? { ...r, likes: (r.likes || 0) + 1 } : r);
    saveRecipes(updated);
    if (selectedRecipe?.id === recipeId) {
      setSelectedRecipe({ ...selectedRecipe, likes: (selectedRecipe.likes || 0) + 1 });
    }
  };

  const handleClearPlan = () => {
    if (confirm('¿Limpiar menú? Esta acción no se puede deshacer.')) {
      setMealPlan(INITIAL_MEAL_PLAN);
      localStorage.setItem('family_meal_plan', JSON.stringify(INITIAL_MEAL_PLAN));
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipe || !commentForm.author || !commentForm.text) return;
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      author: commentForm.author,
      familyRole: commentForm.role,
      text: commentForm.text,
      createdAt: Date.now()
    };
    const updatedRecipes = recipes.map(r => r.id === selectedRecipe.id ? { ...r, comments: [newComment, ...(r.comments || [])] } : r);
    saveRecipes(updatedRecipes);
    setSelectedRecipe({ ...selectedRecipe, comments: [newComment, ...(selectedRecipe.comments || [])] });
    setCommentForm({ author: '', role: 'Nieto/a', text: '' });
  };

  const handleRecipeClick = async (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setAiWisdom(null);
    setIsLoadingWisdom(true);
    setPlanningMode({ active: false, day: null, step: 'day' });
    try {
      const wisdom = await getCulinaryWisdom(recipe);
      setAiWisdom(wisdom);
    } catch (e) { console.error(e); } finally { setIsLoadingWisdom(false); }
  };

  const getSuggestions = async () => {
    if (!userTaste) return;
    setIsSuggesting(true);
    try {
      const sugs = await getPersonalizedSuggestions(recipes, userTaste);
      setSuggestions(sugs);
    } catch (e) { console.error(e); } finally { setIsSuggesting(false); }
  };

  const addToMealPlan = (recipeId: string, recipeTitle: string, day: DayOfWeek, type: MealType) => {
    const newPlan = { ...mealPlan };
    newPlan[day] = [...newPlan[day], { recipeId, recipeTitle, type }];
    setMealPlan(newPlan);
    localStorage.setItem('family_meal_plan', JSON.stringify(newPlan));
    setPlanningMode({ active: false, day: null, step: 'day' });
    setSelectedRecipe(null);
    setActiveTab('planificador');
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 glass border-b border-stone-100 px-8 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setActiveTab('recetas'); setSelectedRecipe(null); }}>
            <div className="w-12 h-12 bg-emerald-900 rounded-2xl flex items-center justify-center text-white serif italic text-2xl shadow-xl shadow-emerald-900/20 rotate-3 transition-transform">L</div>
            <div>
              <h1 className="text-2xl font-black text-stone-900 tracking-tighter serif">El Legado <span className="text-emerald-800 italic">de la Abuela</span></h1>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 mt-0.5">Recetas heredadas, sabores eternos</p>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-10">
            {[
              { id: 'recetas', label: 'Recetario' },
              { id: 'retos', label: 'Retos' },
              { id: 'planificador', label: 'Menú Semanal' },
              { id: 'shop', label: 'Tienda' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)} 
                className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative py-2 ${activeTab === tab.id ? 'text-emerald-900' : 'text-stone-400 hover:text-stone-600'}`}
              >
                {tab.label}
                {activeTab === tab.id && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-800 rounded-full"></span>}
              </button>
            ))}
          </nav>
          <button onClick={() => setIsAdding(true)} className="bg-emerald-900 hover:bg-emerald-950 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-xl text-xs uppercase tracking-widest">
            Nueva Receta
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-16">
        {activeTab === 'recetas' && (
          <div className="space-y-20 animate-in fade-in duration-700">
            <section className="relative overflow-hidden bg-emerald-900 rounded-[3rem] p-12 lg:p-20 text-white shadow-2xl">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-5xl lg:text-7xl font-bold serif leading-[1.1] mb-8">Busca entre los <span className="text-emerald-300 italic">secretos</span> mejor guardados.</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input type="text" placeholder="¿Qué te apetece hoy?..." className="flex-grow px-8 py-5 bg-white/10 border border-white/20 rounded-3xl text-sm outline-none focus:bg-white/20 transition-all placeholder:text-white/40" value={userTaste} onChange={(e) => setUserTaste(e.target.value)} />
                  <button onClick={getSuggestions} disabled={isSuggesting || !userTaste} className="bg-white text-emerald-900 px-10 py-5 rounded-3xl font-bold text-sm hover:bg-emerald-50 transition-all shadow-xl">Descubrir</button>
                </div>
              </div>
            </section>

            {suggestions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-top-10">
                {suggestions.map((sug, idx) => {
                  const r = recipes.find(r => r.id === sug.recipeId);
                  if (!r) return null;
                  return (
                    <div key={idx} className="bg-emerald-50/50 border border-emerald-100 p-8 rounded-[2.5rem] group cursor-pointer hover:bg-white hover:shadow-xl transition-all" onClick={() => handleRecipeClick(r)}>
                      <h4 className="font-bold text-stone-900 text-lg mb-3 serif">{r.title}</h4>
                      <p className="text-xs text-stone-500 italic mb-5 leading-relaxed">"{sug.reason}"</p>
                      <span className="text-emerald-700 text-[10px] font-bold uppercase tracking-widest group-hover:translate-x-2 inline-block transition-transform">Ver Tesoro →</span>
                    </div>
                  );
                })}
              </div>
            )}

            <section className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-100 pb-10">
                <div>
                  <h3 className="text-4xl font-bold text-stone-900 serif italic">Recetario Familiar</h3>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2.5 rounded-2xl text-[10px] font-bold transition-all border uppercase tracking-widest ${activeCategory === cat ? 'bg-stone-900 text-white shadow-xl' : 'bg-white text-stone-500 hover:border-emerald-300'}`}>{cat}</button>
                  ))}
                </div>
              </div>
              <div className="recipe-grid">
                {filteredRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} onClick={handleRecipeClick} />
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'retos' && (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 space-y-20">
            <header className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-6xl font-bold text-stone-900 serif italic">Retos de la Comunidad</h2>
              <p className="text-stone-500 leading-relaxed italic">Preservemos el legado a través de la acción. Participa en misiones semanales, gana insignias y conviértete en Guardián de Oro de nuestras tradiciones.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {MOCK_CHALLENGES.map((challenge) => (
                <div key={challenge.id} className="group relative bg-white rounded-[3.5rem] overflow-hidden border border-stone-100 flex flex-col md:flex-row shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                    <img src={challenge.imageUrl} alt={challenge.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-transparent transition-colors"></div>
                    <div className="absolute top-6 left-6">
                      <span className="glass px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-900">Activo</span>
                    </div>
                  </div>
                  <div className="md:w-3/5 p-10 flex flex-col">
                    <div className="mb-6">
                      <h3 className="text-3xl font-bold text-stone-900 serif mb-3 leading-tight">{challenge.title}</h3>
                      <p className="text-stone-500 text-sm leading-relaxed mb-6">{challenge.description}</p>
                      
                      <div className="flex items-center gap-6 pb-6 border-b border-stone-50">
                        <div>
                          <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest mb-1">Premio</p>
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${challenge.prizeBadge.color}`}>
                            <span className="text-lg">{challenge.prizeBadge.icon}</span>
                            <span className="text-[9px] font-bold uppercase">{challenge.prizeBadge.name}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest mb-1">Participantes</p>
                          <p className="font-bold text-stone-900">{challenge.participantsCount} Guardianes</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">Termina en:</span>
                        <span className="text-xs font-bold text-stone-900">3 días, 12 horas</span>
                      </div>
                      <button className="bg-emerald-900 text-white px-8 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-950 transition-all shadow-xl shadow-emerald-900/10 active:scale-95">Participar ahora</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <section className="bg-stone-900 rounded-[4rem] p-16 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
                 <span className="text-[20rem] serif italic">🏆</span>
              </div>
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <h3 className="text-5xl font-bold serif italic">Tus Logros en el Legado</h3>
                  <p className="text-stone-400 leading-relaxed italic">Cada receta compartida y cada reto completado te acerca a la maestría culinaria tradicional. Colecciona insignias y desbloquea beneficios exclusivos en nuestra tienda.</p>
                  <div className="flex flex-wrap gap-4">
                    {MOCK_BADGES.slice(0, 3).map(badge => (
                      <div key={badge.id} className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl grayscale hover:grayscale-0 cursor-help transition-all group relative" title={badge.name}>
                        {badge.icon}
                        <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-800 text-[9px] px-3 py-1 rounded-lg whitespace-nowrap uppercase tracking-widest font-bold">Bloqueado: {badge.name}</div>
                      </div>
                    ))}
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                      {MOCK_BADGES[3].icon}
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-6">
                  <h4 className="font-bold text-lg uppercase tracking-widest flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-emerald-500"></span>
                    Salón de la Fama
                  </h4>
                  {[
                    { name: 'Abuela María', points: '1,240 pts', recipes: 45 },
                    { name: 'Nieto Carlos', points: '980 pts', recipes: 32 },
                    { name: 'Tía Lucía', points: '850 pts', recipes: 28 }
                  ].map((user, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-emerald-500 font-bold serif italic">#{i+1}</span>
                        <p className="font-bold text-sm">{user.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold">{user.points}</p>
                        <p className="text-[9px] text-stone-500 uppercase tracking-tighter">{user.recipes} recetas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'planificador' && (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
            <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <h2 className="text-6xl font-bold text-stone-900 serif italic mb-4">La Mesa Semanal</h2>
                <p className="text-stone-500 italic">Organiza los sabores que nutrirán a tu familia esta semana.</p>
              </div>
              <button 
                onClick={handleClearPlan} 
                className="text-stone-400 hover:text-rose-600 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 border border-stone-100 px-8 py-4 rounded-3xl hover:bg-rose-50 transition-all"
              >
                Limpiar Semana
              </button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
              {DAYS.map(day => (
                <div key={day} className="bg-white border border-stone-100 rounded-[2.5rem] p-6 shadow-sm flex flex-col min-h-[550px]">
                  <h4 className="text-center font-bold text-emerald-900 uppercase text-[10px] tracking-[0.3em] mb-8 pb-4 border-b border-stone-50">{day}</h4>
                  <div className="space-y-5 flex-grow">
                    {mealPlan[day].map((entry, idx) => (
                      <div key={idx} className={`relative p-5 rounded-3xl border shadow-sm group ${MEAL_TYPE_COLORS[entry.type]}`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[8px] font-black uppercase tracking-widest opacity-60">{entry.type}</span>
                          <button onClick={() => {
                             const newPlan = {...mealPlan};
                             newPlan[day] = newPlan[day].filter((_, i) => i !== idx);
                             setMealPlan(newPlan);
                             localStorage.setItem('family_meal_plan', JSON.stringify(newPlan));
                          }} className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-rose-500">✕</button>
                        </div>
                        <p className="text-sm font-bold text-stone-900 cursor-pointer" onClick={() => {
                          const recipe = recipes.find(r => r.id === entry.recipeId);
                          if (recipe) handleRecipeClick(recipe);
                        }}>{entry.recipeTitle}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 space-y-16">
            <header className="mb-16">
              <h2 className="text-6xl font-bold text-stone-900 serif italic mb-4">Boutique del Legado</h2>
              <p className="text-stone-500 max-w-xl">Objetos y guías seleccionadas para honrar la tradición en tu propia cocina.</p>
            </header>

            <div className="flex gap-3 overflow-x-auto pb-4 border-b border-stone-100">
              {shopCategories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setShopCategory(cat)} 
                  className={`px-8 py-3 rounded-2xl text-[10px] font-bold transition-all border uppercase tracking-widest ${shopCategory === cat ? 'bg-emerald-900 text-white border-emerald-900 shadow-xl' : 'bg-white text-stone-500 border-stone-200 hover:border-emerald-300'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {filteredProducts.map(product => (
                <div key={product.id} className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 transition-all hover:shadow-[0_20px_50px_rgba(27,67,50,0.08)] hover:-translate-y-1">
                  <div className="relative h-64 overflow-hidden">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-5 left-5">
                      <span className="glass px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-emerald-900">
                        {product.category}
                      </span>
                    </div>
                    {product.isDigital && (
                      <div className="absolute bottom-5 right-5">
                        <span className="bg-sky-500 text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter shadow-lg">Descarga Inmediata</span>
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-stone-900 serif leading-tight mb-3">{product.name}</h3>
                    <p className="text-stone-400 text-xs italic leading-relaxed mb-6 line-clamp-2">{product.description}</p>
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-stone-50">
                      <span className="text-3xl font-normal text-stone-900 serif italic tracking-tighter">
                        <span className="text-xs font-bold align-top mt-1 inline-block mr-0.5">$</span>
                        {product.price.toFixed(2)}
                      </span>
                      <button className="bg-stone-900 text-white p-3 rounded-2xl hover:bg-emerald-900 transition-colors shadow-lg shadow-stone-900/10 active:scale-95">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {selectedRecipe && (
        <div onClick={() => setSelectedRecipe(null)} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-stone-900/80 backdrop-blur-xl overflow-y-auto cursor-zoom-out">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-[3.5rem] max-w-7xl w-full my-auto overflow-hidden shadow-2xl cursor-default flex flex-col lg:flex-row max-h-[90vh]">
            <div className="lg:w-2/5 relative h-[400px] lg:h-auto overflow-hidden shrink-0">
              <img src={selectedRecipe.imageUrl} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent"></div>
              <div className="absolute bottom-12 left-12 right-12">
                 <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-emerald-600 text-white text-[9px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest inline-block">{selectedRecipe.category}</span>
                    <span className="bg-white text-stone-900 text-[9px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2">
                       <svg className="w-3 h-3 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                       {selectedRecipe.origin}
                    </span>
                 </div>
                 <h2 className="text-5xl font-bold text-white serif leading-tight mb-6">{selectedRecipe.title}</h2>
                 <div className="flex items-center gap-4">
                    <button onClick={() => handleLike(selectedRecipe.id)} className="flex items-center gap-3 bg-rose-500 text-white px-6 py-3 rounded-2xl transition-all active:scale-90 shadow-xl">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      <span className="font-bold text-sm">{selectedRecipe.likes || 0}</span>
                    </button>
                    <button 
                      onClick={() => setPlanningMode({ ...planningMode, active: true, step: 'day' })} 
                      className={`px-8 py-3 rounded-2xl font-bold shadow-xl transition-all flex items-center gap-3 text-sm ${planningMode.active ? 'bg-emerald-900 text-white' : 'bg-white text-stone-900 hover:bg-emerald-50'}`}
                    >
                      📅 Planificar Menú
                    </button>
                 </div>
              </div>
            </div>

            <div className="lg:w-3/5 p-12 lg:p-20 overflow-y-auto bg-white flex flex-col gap-12 relative">
              <button onClick={() => setSelectedRecipe(null)} className="absolute top-8 right-8 bg-stone-100 hover:bg-stone-200 p-4 rounded-full text-stone-500 transition-colors z-10">✕</button>
              
              <div className="max-w-3xl space-y-16">
                {planningMode.active && (
                  <section className="bg-emerald-50 p-10 rounded-[2.5rem] border border-emerald-100 shadow-lg animate-in slide-in-from-top-4 duration-500">
                    <div className="flex justify-between items-center mb-8">
                       <h4 className="text-emerald-900 font-bold text-xl serif italic">Programar "{selectedRecipe.title}"</h4>
                       <button onClick={() => setPlanningMode({ ...planningMode, active: false })} className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest underline decoration-2 underline-offset-4">Cancelar</button>
                    </div>

                    {planningMode.step === 'day' ? (
                      <div className="space-y-6">
                        <p className="text-emerald-800 text-sm font-bold uppercase tracking-widest">1. ¿Qué día quieres cocinarlo?</p>
                        <div className="flex flex-wrap gap-3">
                          {DAYS.map(day => (
                            <button 
                              key={day} 
                              onClick={() => setPlanningMode({ ...planningMode, day, step: 'type' })}
                              className="px-6 py-3 bg-white text-emerald-900 rounded-2xl text-[11px] font-bold border border-emerald-100 hover:bg-emerald-900 hover:text-white transition-all shadow-sm active:scale-95"
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex justify-between items-center">
                           <p className="text-emerald-800 text-sm font-bold uppercase tracking-widest">2. ¿Para qué momento del <span className="text-emerald-900 font-black">{planningMode.day}</span>?</p>
                           <button onClick={() => setPlanningMode({ ...planningMode, step: 'day' })} className="text-[9px] font-bold text-emerald-600 underline">Cambiar día</button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                          {MEAL_TYPES.map(type => (
                            <button 
                              key={type} 
                              onClick={() => addToMealPlan(selectedRecipe.id, selectedRecipe.title, planningMode.day!, type)}
                              className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] border transition-all hover:scale-105 shadow-sm text-center ${MEAL_TYPE_COLORS[type]}`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                )}

                <section className="relative">
                  <div className="absolute -top-10 -left-6 text-emerald-50 text-9xl serif italic select-none">“</div>
                  <p className="text-3xl text-stone-700 serif italic leading-relaxed relative z-10">{selectedRecipe.story}</p>
                  <div className="mt-8 flex items-center justify-between border-t border-stone-50 pt-8">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-bold serif italic text-xl">{selectedRecipe.author[0]}</div>
                        <div>
                           <p className="text-stone-900 font-bold">{selectedRecipe.author}</p>
                           <p className="text-stone-400 text-xs uppercase tracking-widest font-bold">Guardián del Legado ({selectedRecipe.familyRole})</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest mb-1">Geografía de la Tradición</p>
                        <p className="text-stone-900 font-bold serif italic text-lg">{selectedRecipe.origin}</p>
                     </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                  <section>
                    <h3 className="text-xl font-bold text-stone-900 mb-8 uppercase tracking-widest flex items-center gap-3"><span className="w-8 h-[2px] bg-emerald-800"></span>Ingredientes</h3>
                    <ul className="space-y-5">
                      {selectedRecipe.ingredients.map((ing, i) => (
                        <li key={i} className="flex justify-between items-center py-3 border-b border-stone-50">
                          <span className="text-stone-600 font-medium">{ing.name}</span>
                          <span className="bg-stone-50 text-stone-500 px-4 py-1 rounded-xl font-bold text-[10px] uppercase">{ing.amount}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h3 className="text-xl font-bold text-stone-900 mb-8 uppercase tracking-widest flex items-center gap-3"><span className="w-8 h-[2px] bg-emerald-800"></span>Preparación</h3>
                    <div className="space-y-10">
                      {selectedRecipe.steps.map((step, i) => (
                        <div key={i} className="flex gap-8 group">
                          <span className="shrink-0 w-10 h-10 rounded-2xl bg-stone-50 text-stone-400 group-hover:bg-emerald-900 group-hover:text-white flex items-center justify-center font-bold text-sm transition-all">{i + 1}</span>
                          <div className="flex flex-col gap-2">
                            {step.duration && <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">{step.duration}</span>}
                            <p className="text-stone-600 text-md leading-relaxed">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <section className="bg-stone-100/50 backdrop-blur-xl border border-stone-200 p-12 rounded-[3rem] shadow-xl text-stone-800">
                  <div className="flex items-center gap-4 mb-10">
                    <span className="text-3xl">✨</span>
                    <h4 className="text-2xl font-bold serif italic text-stone-900">Secretos de Familia</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-6">
                        <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">Trucos de la casa</p>
                        <ul className="space-y-6">
                          {(selectedRecipe.ancestralSecrets || []).map((t, i) => (
                            <li key={i} className="flex gap-4 italic text-stone-700 text-lg leading-relaxed">
                              <span className="text-emerald-600 font-bold">•</span>
                              "{t}"
                            </li>
                          ))}
                        </ul>
                     </div>
                     <div className="bg-white/40 p-8 rounded-[2.5rem] border border-stone-200/50 shadow-inner">
                        <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-4">Notas Culturales</p>
                        <p className="text-stone-600 italic text-sm leading-relaxed">{selectedRecipe.culturalNote || aiWisdom?.culturalContext}</p>
                     </div>
                  </div>
                </section>

                <section className="space-y-12 pb-20">
                   <h3 className="text-3xl font-bold text-stone-900 serif italic">Libro de Visitas</h3>
                   <form onSubmit={handleAddComment} className="bg-stone-50/50 p-10 rounded-[3rem] border border-stone-100 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <input type="text" placeholder="Tu nombre" value={commentForm.author} onChange={e => setCommentForm({ ...commentForm, author: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-white border border-stone-200 outline-none text-sm" required />
                         <select value={commentForm.role} onChange={e => setCommentForm({ ...commentForm, role: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-white border border-stone-200 outline-none text-sm">
                            <option>Nieto/a</option><option>Hijo/a</option><option>Amigo/a</option><option>Chef curioso</option>
                         </select>
                      </div>
                      <textarea placeholder="Cuéntanos cómo te ha salido..." value={commentForm.text} onChange={e => setCommentForm({ ...commentForm, text: e.target.value })} className="w-full h-32 px-6 py-4 rounded-2xl bg-white border border-stone-200 outline-none text-sm resize-none" required></textarea>
                      <button type="submit" className="w-full bg-emerald-900 text-white py-5 rounded-2xl font-bold text-sm hover:bg-emerald-950 transition-all">Publicar en el Legado</button>
                   </form>
                   <div className="space-y-8">
                      {selectedRecipe.comments?.map(comment => (
                        <div key={comment.id} className="bg-white border border-stone-50 p-8 rounded-[2.5rem] shadow-sm">
                           <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center font-bold text-stone-400">{comment.author[0]}</div>
                                 <div>
                                    <h5 className="font-bold text-stone-900 text-sm">{comment.author}</h5>
                                    <span className="text-[9px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-lg">{comment.familyRole}</span>
                                 </div>
                              </div>
                              <span className="text-[10px] text-stone-300 font-bold uppercase tracking-widest">{new Date(comment.createdAt).toLocaleDateString()}</span>
                           </div>
                           <p className="text-stone-600 italic leading-relaxed text-md">"{comment.text}"</p>
                        </div>
                      ))}
                   </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-stone-900/90 backdrop-blur-md overflow-y-auto">
          <div className="my-auto w-full max-w-5xl animate-in zoom-in-95 duration-500">
            <RecipeForm 
              onSave={(data) => {
                const newRecipe = { ...data, id: Math.random().toString(36).substr(2, 9), authorId: 'user_local', likes: 0, comments: [] };
                saveRecipes([newRecipe, ...recipes]);
                setIsAdding(false);
              }} 
              onCancel={() => setIsAdding(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
