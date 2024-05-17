const API_URL = process.env.NEXT_PUBLIC_API_URL + "/positions";

const getPositions = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Error al obtener posiciones");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error((error as Error).message || "Error al obtener posiciones");
  }
};
