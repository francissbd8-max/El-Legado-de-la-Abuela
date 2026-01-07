
import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  return (
    <div 
      onClick={() => onClick(recipe)}
      className="group cursor-pointer bg-white rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(27,67,50,0.12)] border border-stone-100 flex flex-col h-full"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={recipe.imageUrl} 
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
        
        <div className="absolute top-5 left-5 flex flex-wrap gap-2">
          <span className="glass px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-stone-800 shadow-sm">
            {recipe.category}
          </span>
          <span className="bg-emerald-900/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-emerald-50 shadow-sm flex items-center gap-1.5">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {recipe.origin}
          </span>
        </div>

        <div className="absolute bottom-5 left-5 right-5">
           <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold uppercase tracking-wider">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
             {recipe.familyRole} {recipe.author}
           </div>
        </div>
        
        <div className="absolute top-5 right-5 glass px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-lg">
          <svg className="w-4 h-4 text-rose-500 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          <span className="text-xs font-bold text-stone-800">{recipe.likes || 0}</span>
        </div>
      </div>

      <div className="p-7 flex flex-col flex-grow bg-white">
        <h3 className="text-2xl font-bold text-stone-900 mb-3 serif leading-tight group-hover:text-emerald-900 transition-colors">
          {recipe.title}
        </h3>
        <p className="text-stone-500 text-sm line-clamp-2 italic mb-6 leading-relaxed">
          "{recipe.story}"
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-5 border-t border-stone-50">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {recipe.prepTime}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
               {recipe.comments?.length || 0}
            </span>
          </div>
          <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-tighter ${
            recipe.difficulty === 'Fácil' ? 'bg-emerald-50 text-emerald-700' : 
            recipe.difficulty === 'Media' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
          }`}>
            {recipe.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
};
