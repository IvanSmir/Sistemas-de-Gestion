const API_URL = process.env.NEXT_PUBLIC_API_URL + "/employees";

export const getEmployeeId = async (id: string, token: string) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
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



export const updateEmployee = async (id: string, employeeData: any, token: string) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
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
        throw new Error((error as Error).message || "Error al guardar empleado editado");
    }
};
