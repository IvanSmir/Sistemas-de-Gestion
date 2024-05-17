const API_URL = "http://localhost:3000/api/positions?limit=10&page=1";

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
