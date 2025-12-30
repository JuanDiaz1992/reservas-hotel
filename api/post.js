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
    console.log(resultado)
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


export async function postProtected({ endpoint, body, token }) {
  const baseUrl = import.meta.env.VITE_API_URL;
  try {
    const respuesta = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      return { data: resultado, error: `Error ${respuesta.status}`, status: respuesta.status };
    }
    return { data: resultado, error: null, status: respuesta.status };
  } catch (error) {
    return { data: null, error: "Error de conexión", status: 500 };
  }
}



export async function postProtectedFormData({ endpoint, body, token }) {
  const baseUrl = import.meta.env.VITE_API_URL;
  try {
    const respuesta = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: body,
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      return { data: resultado, error: `Error ${respuesta.status}`, status: respuesta.status };
    }
    return { data: resultado, error: null, status: respuesta.status };
  } catch (error) {
    return { data: null, error: "Error de conexión", status: 500 };
  }
}