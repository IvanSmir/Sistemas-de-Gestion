const API_URL = process.env.NEXT_PUBLIC_API_URL + "/payroll";

export const getPayrolls = async ( token: string) => {
    try {
        const response = await fetch(`${API_URL}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener salario");
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        throw new Error((error as Error).message || "Error al obtener salario");
    }
};

export const createPayroll = async ( token: string) => {
    try {
        const response = await fetch(`${API_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al crear salario");
        }


        return response.json();
    } catch (error: any) {
        throw new Error((error as Error).message || "Error al crear salario");
    }
};