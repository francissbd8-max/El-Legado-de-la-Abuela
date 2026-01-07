
export interface RecipeStep {
  description: string;
  duration?: string;
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface RecipeMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Comment {
  id: string;
  author: string;
  familyRole: string;
  text: string;
  createdAt: number;
}

export interface Recipe {
  id: string;
  title: string;
  author: string;
  authorId: string; 
  familyRole: string; 
  story: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  prepTime: string;
  difficulty: 'Fácil' | 'Media' | 'Dificil';
  category: string;
  origin: string; 
  imageUrl: string; 
  media: RecipeMedia[]; 
  createdAt: number;
  ancestralSecrets?: string[];
  culturalNote?: string;
  challengeId?: string;
  likes: number;
  comments: Comment[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: 'PDF' | 'Textil' | 'Accesorios';
  isDigital: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  endDate: number;
  isActive: boolean;
  prizeBadge: Badge;
  participantsCount: number;
  winnerRecipeId?: string;
  imageUrl: string;
}

export interface AIAnalysis {
  nutritionSummary: string;
  culturalContext: string;
  tips: string[];
}

export type DayOfWeek = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';

export type MealType = 'Desayuno' | 'Comida' | 'Merienda' | 'Cena' | 'Postre';

export interface MealPlanEntry {
  recipeId: string;
  recipeTitle: string;
  type: MealType;
}

export type MealPlan = {
  [key in DayOfWeek]: MealPlanEntry[];
};
