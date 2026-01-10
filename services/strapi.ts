const STRAPI_URL = "http://localhost:1337";

export async function getReceta() {
  const res = await fetch(
    `${STRAPI_URL}/api/receta?filters[Estado][$eq]=aprobada&populate=*`
  );

  if (!res.ok) {
    throw new Error("Error cargando recetas");
  }

  const data = await res.json();
  return data.data;
}
