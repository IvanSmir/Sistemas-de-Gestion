const API_URL = process.env.NEXT_PUBLIC_API_URL + "/person";

export const getPerson = async (ciRuc: string, token: string) => {
  try {
    const response = await fetch(`${API_URL}/${ciRuc}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status == 404) {
      throw new Error("Persona no encontrada");
    }
    if (!response.ok) {
      throw new Error("Error al obtener persona");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error((error as Error).message || "Error al obtener persona");
  }
};
