const STRAPI_URL = "https://el-legado-de-la-abuela.onrender.com";

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
