const STRAPI_URL = "https://el-legado-de-la-abuela.onrender.com";

export async function getReceta() {
  const res = await fetch(
    `${STRAPI_URL}/api/receta?filters[Estado][$eq]=aprobada&populate=*`
  );

  if (!res.ok) {
    throw new Error("Error cargando recetas");
  }

  export async function crearReceta(receta: any) {
  const res = await fetch(
    "https://el-legado-de-la-abuela.onrender.com/api/recetas",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          ...receta,
          Estado: "pendiente",
        },
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Error al crear receta");
  }

  return res.json();
}

  const data = await res.json();
  return data.data;
}
