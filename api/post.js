export async function post({ endpoint, body }) {
  const baseUrl = import.meta.env.VITE_API_URL;

  try {
    const respuesta = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!respuesta.ok) {
      return {
        data: null,
        error: `Error ${respuesta.status}: ${respuesta.statusText}`,
        status: respuesta.status,
      };
    }

    const resultado = await respuesta.json();

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
