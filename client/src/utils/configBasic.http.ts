const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getConfigAmount = async (token: string) => {
    try {
        const response = await fetch(`${API_URL}/config`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
  
        if (!response.ok) {
            throw new Error("Error al obtener los tipos de montos");
        }
  
        const data = await response.json();
        return data;
    } catch (error: any) {
        throw new Error((error as Error).message || "Error al obtener los tipos de montos");
    }
};

export const getConfigAmountType = async (id: string, token: string) => {
    try {
        const response = await fetch(`${API_URL}/config/${id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("Error al obtener el tipo de monto");
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        throw new Error(
            error.message || "Error al obtener el tipo de monto"
        );
    }
};

export const createConfigAmountType = async (data:any , token: string) => {
    try {
        const response = await fetch(`${API_URL}/config`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Error al crear la configuración");
        }

        return response.json();
    } catch (error: any) {
        throw new Error(error.message || "Error al crear la configuración");
    }
};

export const updateConfigAmountType = async (id: string, data: any, token: string) => {
    try {
        const response = await fetch(`${API_URL}/config/${id}`, {
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
            throw new Error("Error al actualizar la configuración");
        }

        return response.json();
    } catch (error: any) {
        throw new Error(
            error.message || "Error al actualizar la configuración"
        );
    }
};
