const API_URL = "http://localhost:3000/api/employees?limit=6&page=1";

export const getEmployees = async () => {
    try {
        const response = await fetch(API_URL);
  
        if (!response.ok) {
            throw new Error("Error al obtener empleados");
        }
  
        const data = await response.json();
        return data;
    } catch (error: any) {
        throw new Error((error as Error).message || "Error al obtener empleados");
    }
};