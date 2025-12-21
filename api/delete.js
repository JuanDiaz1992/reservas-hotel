export async function del({ endpoint, body = {} }) {
  const baseUrl = import.meta.env.VITE_API_URL;

  try {
    const respuesta = await fetch(`${baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: body && Object.keys(body).length > 0 ? JSON.stringify(body) : null,
    });

    if (!respuesta.ok) {
      return {
        data: null,
        error: `Error ${respuesta.status}: ${respuesta.statusText}`,
        status: respuesta.status,
      };
    }

    const resultado =
      respuesta.status !== 204 ? await respuesta.json() : { success: true };

    return {
      data: resultado,
      error: null,
      status: respuesta.status,
    };
  } catch (error) {
    return {
      data: null,
      error: "No se pudo conectar con el servidor",
      status: 500,
    };
  }
}
