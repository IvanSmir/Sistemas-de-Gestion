const API_URL = process.env.NEXT_PUBLIC_API_URL + "/positions";

export const getPositions = async (page: number = 1) => {
  try {
    const response = await fetch(`${API_URL}?limit=6&page=${page}`);

    if (!response.ok) {
      throw new Error("Error al obtener posiciones");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error((error as Error).message || "Error al obtener posiciones");
  }
};

export const deletePosition = async (id: string, token: string) => {
  if(!id){
    return
  }else{
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
  
      if (!response.ok) {
        throw new Error("Error al borrar posiciones");
      }
  
      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error((error as Error).message || "Error al borrar posiciones");
    }
  }
};

export const addPosition = async (position: any, token: string) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(position),
    });

    if (!response.ok) {
      throw new Error("Error al agregar la posición");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    
    throw new Error(error.message || "Error al agregar la posición");
    
  }
};
