import { useEffect, useState } from "react";
import { getRecetas } from "../services/strapi";

export default function Recetario() {
  const [recetas, setRecetas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReceta()
      .then(setReceta)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando recetas...</p>;

  return (
    <div>
      {receta.map((item) => {
        const receta = item.attributes;

        return (
          <div key={item.id} className="receta-card">
            <h3>{receta.Titulo}</h3>
            <p><strong>Región:</strong> {receta.Region}</p>
            <p><strong>Dificultad:</strong> {receta.Dificultad}</p>
            <p>{receta.Ingredientes}</p>
          </div>
        );
      })}
    </div>
  );
}
