const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getLastPayments = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/payroll/lastPaymnets`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener últimos pagos");
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error((error as Error).message || "Error al obtener últimos pagos");
  }
};

export const getLastTopEmployeesByIncome = async (token: string) => {   
    try {
        const response = await fetch(`${API_URL}/payroll/lastTopEmployeesByIncome`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener últimos pagos");
        }
        const data = await response.json();
        return data;
    } catch (error: any) {
        throw new Error((error as Error).message || "Error al obtener últimos pagos");
    }
};