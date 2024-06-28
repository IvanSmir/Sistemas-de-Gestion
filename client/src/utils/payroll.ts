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
export const verifyPayrollDetails= async (id: string, periodDetailId: string, token: string) => {
    try {
        const response = await fetch(`${API_URL}/${id}/verifyPayrollDetails/${periodDetailId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error("Error al verificar la nómina");
        }
       
    } catch (error:any) {
        throw new Error((error as Error).message || "Error al verificar la nómina");
   
    }
};

export const generateIpsPayrollDetails= async (id: string, periodDetailId: string, token: string) => {
    try {
        const response = await fetch(`${API_URL}/${id}/ips/${periodDetailId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error("Error al generar ips");
        }
       
    } catch (error:any) {
        throw new Error((error as Error).message || "Error al generar ips");
   
    }
};

export const generateBonusPayrollDetails= async (id: string, periodDetailId: string, token: string) => {
    try {
        const response = await fetch(`${API_URL}/${id}/bonusFamiliar/${periodDetailId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {            
            throw new Error("Error al generar bonus familiar");

        }
       
    } catch (error:any) {
        throw new Error((error as Error).message || "Error al generar bonus familiar");
   
    }
};

export const salaryPayrollDetails = async (id: string, employeeId: string, token: string) => {
    try {
        const response = await fetch(`${API_URL}/${id}/createPayments/${employeeId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error("Error al crear salarios");
        }
       
    } catch (error:any) {
        throw new Error((error as Error).message || "Error al crear salarios");
   
    }
};


export const getLastSalaryPayments = async (token: string) => {
    try {
        const response = await fetch(`${API_URL}/lastSalaryPayments`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            throw new Error("Error al obtener los últimos pagos de salarios");
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        throw new Error((error as Error).message || "Error al obtener los últimos pagos de salarios");
    }
};