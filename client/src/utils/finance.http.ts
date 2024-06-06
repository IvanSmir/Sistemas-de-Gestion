const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getIncomeTypes = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/income-types`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener tipos de ingresos");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(
      (error as Error).message || "Error al obtener tipos de ingresos"
    );
  }
};

export const getExpenseTypes = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/expense-types`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener tipos de egresos");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(
      (error as Error).message || "Error al obtener tipos de egresos"
    );
  }
};

export const createIncome = async (data: any, token: string) => {
  try {
    const response = await fetch(`${API_URL}/incomes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error al crear ingreso");
    }

    return response.json();
  } catch (error: any) {
    throw new Error((error as Error).message || "Error al crear ingreso");
  }
};

export const createExpense = async (data: any, token: string) => {
  try {
    const response = await fetch(`${API_URL}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error al crear egreso");
    }

    return response.json();
  } catch (error: any) {
    throw new Error((error as Error).message || "Error al crear egreso");
  }
};

export const deleteIncome = async (id: string, token: string
) => {
  try {
    console.log("Token usado para eliminar:", token);
    const response = await fetch(`${API_URL}/incomes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("No tienes autorización para realizar esta acción");
      }
      throw new Error("Error al eliminar el ingreso");
    }
    return response.json();
  } catch (error: any) {
    throw new Error(
      error.message || "Error al eliminar el ingreso"
    );
  }
};

export const deleteExpense = async (id: string, token: string
) => {
  try {
    console.log("Token usado para eliminar:", token);
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("No tienes autorización para realizar esta acción");
      }
      throw new Error("Error al eliminar el egreso");
    }
    return response.json();
  } catch (error: any) {
    throw new Error(
      error.message || "Error al eliminar el egreso"
    );
  }
};

export const updateIncome = async (
  id: string,
  data: any,
  token: string
) => {
  try {
    console.log("Token usado para actualizar:", token);
    const response = await fetch(`${API_URL}/incomes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error detallado:", errorData);
      // Agregar registro adicional para depuración
      console.error("Error en la solicitud de actualización:", response.statusText);
      throw new Error("Error al actualizar el ingreso");
    }
    return response.json();
  } catch (error: any) {
    throw new Error(
      error.message || "Error al actualizar el ingreso"
    );
  }
};


export const updateExpense = async (
  id: string,
  data: any,
  token: string
) => {
  try {
    console.log("Token usado para actualizar:", token);
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error detallado:", errorData);
      throw new Error("Error al actualizar el egreso");
    }
    return response.json();
  } catch (error: any) {
    throw new Error(
      error.message || "Error al actualizar el egreso"
    );
  }
};

export const createIncomeType = async (data: any, token: string) => {
  try {
    const response = await fetch(`${API_URL}/income-types`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error al crear tipo de ingreso");
    }

    return response.json();
  } catch (error: any) {
    throw new Error((error as Error).message || "Error al crear tipo de ingreso");
  }
};

export const createExpenseType = async (data: any, token: string) => {
  try {
    const response = await fetch(`${API_URL}/expense-types`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error al crear tipo de egreso");
    }

    return response.json();
  } catch (error: any) {
    throw new Error((error as Error).message || "Error al crear tipo de egreso");
  }
};

export const updateIncomeType = async (id: string, data: any, token: string) => {
  try {
    const response = await fetch(`${API_URL}/income-types/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar tipo de ingreso");
    }

    return response.json();
  } catch (error: any) {
    throw new Error((error as Error).message || "Error al actualizar tipo de ingreso");
  }
};

export const updateExpenseType = async (id: string, data: any, token: string) => {
  try {
    const response = await fetch(`${API_URL}/expense-types/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar tipo de egreso");
    }

    return response.json();
  } catch (error: any) {
    throw new Error((error as Error).message || "Error al actualizar tipo de egreso");
  }
};

export const deleteIncomeType = async (id: string, token: string) => {
  try {
    const response = await fetch(`${API_URL}/income-types/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar tipo de ingreso");
    }

    return response.json();
  } catch (error: any) {
    throw new Error((error as Error).message || "Error al eliminar tipo de ingreso");
  }
};

export const deleteExpenseType = async (id: string, token: string) => {
  try {
    const response = await fetch(`${API_URL}/expense-types/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar tipo de egreso");
    }

    return response.json();
  } catch (error: any) {
    throw new Error((error as Error).message || "Error al eliminar tipo de egreso");
  }
};
