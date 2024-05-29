const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getEmployeeId = async (id: string, token: string) => {
  try {
    const response = await fetch(`${API_URL}/employees/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener empleado");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error((error as Error).message || "Error al obtener empleado");
  }
};

export const updateEmployee = async (
  id: string,
  employeeData: any,
  token: string
) => {
  try {
    const response = await fetch(`${API_URL}/employees/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      throw new Error("Error al editar empleado");
    }

    return response.json();
  } catch (error: any) {
    throw new Error(
      (error as Error).message || "Error al guardar empleado editado"
    );
  }
};

export const getEmployeeDetails = async (id: string, token: string) => {
  try {
    const response = await fetch(`${API_URL}/employee-details/employee/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los detalles del empleado");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error((error as Error).message || "Error al obtener empleado");
  }
};

export const getEmployeeIncomeDetails = async (id: string, token: string) => {
  try {
    const response = await fetch(`${API_URL}/incomes/employee/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener ingresos del empleado");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(
      (error as Error).message || "Error al obtener ingresos del empleado"
    );
  }
};

export const getEmployeeExpenseDetails = async (id: string, token: string) => {
  try {
    const response = await fetch(`${API_URL}/expenses/employee/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener egresos del empleado");
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(
      (error as Error).message || "Error al obtener egresos del empleado"
    );
  }
};
