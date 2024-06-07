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

export const createPayments = async (periodId: string, token: string) => {
    try {
        const response = await fetch(`${API_URL}/${periodId}/createPayments`, {
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

export const getPayrollDetails = async (periodId: string, token: string) => {
    try {
        const response = await fetch(`${API_URL}/${periodId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener salarios");
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        throw new Error((error as Error).message || "Error al obtener salarios");
    }
};

export const calculateBonificationForAllEmployees = async (id: string, token: string) => {
    try {
        const response = await fetch(`${API_URL}/${id}/familyBonification`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al calcular bonificaciones");
        }


        return response.json();
    } catch (error: any) {
        throw new Error((error as Error).message || "Error al calcular bonificaciones");
    }
};

export const calculateIpsForAllEmployees = async (id: string, token: string) => {
    try {
        const response = await fetch(`${API_URL}/${id}/ips`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al calcular IPS");
        }


        return response.json();
    } catch (error: any) {
        throw new Error((error as Error).message || "Error al calcular IPS");
    }
};

export const closePayrollPeriod = async (id: string, token: string) => {
    try {
        const response = await fetch(`${API_URL}/${id}/closePayrollPeriod`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al cerrar periodo");
        }


        return response.json();
    } catch (error: any) {
        throw new Error((error as Error).message || "Error al cerrar periodo");
    }
};