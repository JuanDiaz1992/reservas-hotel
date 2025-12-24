export async function get({ endpoint }) {
  const baseUrl = import.meta.env.VITE_API_URL;

  try {
    const respuesta = await fetch(`${baseUrl}${endpoint}`);

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

export async function getProtected({ endpoint, token }) {
  const baseUrl = import.meta.env.VITE_API_URL;

  try {
    const respuesta = await fetch(`${baseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      return {
        data: resultado,
        error: `Error ${respuesta.status}: ${respuesta.statusText}`,
        status: respuesta.status,
      };
    }

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