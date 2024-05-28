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
