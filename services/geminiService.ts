
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const enhanceRecipe = async (rawInput: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Eres un experto historiador culinario y chef especializado en cocina tradicional familiar. 
    A partir del siguiente texto desordenado sobre una receta de familia, extrae la información y devuélvela en un formato estructurado. 
    Preserva el sentimiento y la historia familiar. 
    
    Reglas específicas:
    1. Para los ingredientes, separa estrictamente el nombre del producto de su cantidad.
    2. Para cada paso, estima una duración razonable.
    3. Extrae o deduce 'ancestralSecrets' (3 consejos clave tipo abuela).
    4. Extrae o deduce 'culturalNote' (un pequeño párrafo sobre el origen o tradición de este plato).
    
    Texto: "${rawInput}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          familyRole: { type: Type.STRING, description: "Ej: Abuela, Mamá, Tía" },
          story: { type: Type.STRING, description: "La anécdota o comentario emocional" },
          ingredients: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                amount: { type: Type.STRING }
              },
              required: ["name", "amount"]
            } 
          },
          steps: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                duration: { type: Type.STRING }
              },
              required: ["description"]
            } 
          },
          prepTime: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ["Fácil", "Media", "Dificil"] },
          category: { type: Type.STRING },
          origin: { type: Type.STRING },
          ancestralSecrets: { type: Type.ARRAY, items: { type: Type.STRING } },
          culturalNote: { type: Type.STRING }
        },
        required: ["title", "ingredients", "steps", "story", "origin", "category", "ancestralSecrets", "culturalNote"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const getCulinaryWisdom = async (recipe: Recipe) => {
  const ai = getAI();
  // Si la receta ya tiene estos datos, los devolvemos directamente (o los enriquecemos)
  if (recipe.ancestralSecrets && recipe.culturalNote) {
    return {
      nutritionSummary: "Análisis nutricional basado en ingredientes tradicionales.",
      culturalContext: recipe.culturalNote,
      tips: recipe.ancestralSecrets
    };
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analiza esta receta familiar: "${recipe.title}" de "${recipe.origin}". 
    Proporciona un resumen nutricional breve, un dato curioso sobre su origen cultural y 3 consejos de 'abuela' para que salga perfecta.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          nutritionSummary: { type: Type.STRING },
          culturalContext: { type: Type.STRING },
          tips: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["nutritionSummary", "culturalContext", "tips"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const getPersonalizedSuggestions = async (recipes: Recipe[], preferences: string) => {
  const ai = getAI();
  const recipeList = recipes.map(r => ({ id: r.id, title: r.title, category: r.category }));
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Dada esta lista de recetas: ${JSON.stringify(recipeList)}, sugiere las 3 mejores para un usuario que busca: "${preferences}".`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            recipeId: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["recipeId", "reason"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};
