const API_URL = process.env.NEXT_PUBLIC_API_URL + "/payroll";

export const getPayroll = async (id: string = "", token: string) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            throw new Error("Error al obtener payroll");
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        throw new Error((error as Error).message || "Error al obtener payroll");
    }
};

export const getPayrollDetail = async (id: string = "", payrollDetailId:string, token: string) => {
    try {
        const response = await fetch(`${API_URL}/${id}/payrollDetails/${payrollDetailId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            throw new Error("Error al obtener payroll");
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        throw new Error((error as Error).message || "Error al obtener payroll");
    }
};