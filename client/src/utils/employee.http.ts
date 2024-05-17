const API_URL = process.env.NEXT_PUBLIC_API_URL + "/employees";

export const getEmployees = async (page: number) => {
  if (!page) {
    page = 1;
  }
  try {
    const response = await fetch(`${API_URL}?limit=6&page=${page}`);

    if (!response.ok) {
      throw new Error("Error al obtener empleados");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error((error as Error).message || "Error al obtener empleados");
  }
};

export const completeEmployee = async (employeeData: any, token: string) => {
  try {
    const response = await fetch(`${API_URL}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      throw new Error("Error al guardar empleado");
    }

    return response.json();
  } catch (error: any) {
    throw new Error((error as Error).message || "Error al guardar empleado");
  }
};
