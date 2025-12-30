export async function patchProtected({ endpoint, body = null, token }) {
  const baseUrl = import.meta.env.VITE_API_URL;

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  const options = {
    method: "PATCH",
    headers: headers,
  };

  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  try {
    const respuesta = await fetch(`${baseUrl}${endpoint}`, options);
    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      return {
        data: resultado,
        error: resultado.message || `Error ${respuesta.status}`,
        status: respuesta.status,
      };
    }

    return { data: resultado, error: null, status: respuesta.status };
  } catch (error) {
    console.error("Error en PATCH:", error);
    return { data: null, error: "Error de conexión", status: 500 };
  }
}
