import { useState } from "react";
import { crearReceta } from "../services/strapi";

export default function NuevaReceta() {
  const [form, setForm] = useState({
    Titulo: "",
    Autor: "",
    Region: "",
    Categoria: "",
    Dificultad: "",
    Ingredientes: "",
    Pasos: "",
    Historia: "",
    Secretos: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await crearReceta(form);
      alert("Receta enviada. Pendiente de aprobación ❤️");
      setForm({
        Titulo: "",
        Autor: "",
        Region: "",
        Categoria: "",
        Dificultad: "",
        Ingredientes: "",
        Pasos: "",
        Historia: "",
        Secretos: "",
      });
    } catch (error) {
      alert("Error al enviar la receta");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="Titulo" placeholder="Título" onChange={handleChange} value={form.Titulo} />
      <input name="Autor" placeholder="Tu nombre" onChange={handleChange} value={form.Autor} />
      <input name="Region" placeholder="Región" onChange={handleChange} value={form.Region} />
      <textarea name="Ingredientes" placeholder="Ingredientes" onChange={handleChange} value={form.Ingredientes} />
      <textarea name="Pasos" placeholder="Pasos" onChange={handleChange} value={form.Pasos} />
      <textarea name="Historia" placeholder="Historia del plato" onChange={handleChange} value={form.Historia} />
      <textarea name="Secretos" placeholder="Secretos de la abuela" onChange={handleChange} value={form.Secretos} />

      <button type="submit">Enviar receta</button>
    </form>
  );
}

