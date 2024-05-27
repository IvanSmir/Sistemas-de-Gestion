const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getFamilyMembers = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/family-members/employee/${id}`);
    if (!response.ok) {
      throw new Error("Error al obtener familiares");
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener familiares");
  }
};

export const getFamilyMember = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/family-members/${id}`);
    if (!response.ok) {
      throw new Error("Error al obtener el miembro de la familia");
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(
      error.message || "Error al obtener el miembro de la familia"
    );
  }
};

export const getFamilyTypes= async ( token: string) => {
  try {
      const response = await fetch(`${API_URL}/family-types`, {
          method: "GET",
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error("Error al obtener los tipos de familia");
      }

      const data = await response.json();
      return data;
  } catch (error: any) {
      throw new Error((error as Error).message || "Error al obtener los tipos de familia");
  }
};
export const getFamilyTypeId = async (id: string, token: string) => {
  try {
      const response = await fetch(`${API_URL}/family-types/${id}`, {
          method: "GET",
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error("Error al obtener el tipo de familia");
      }

      const data = await response.json();
      return data;
  } catch (error: any) {
      throw new Error((error as Error).message || "Error al obtener el tipo de familia");
  }
};
export const createFamilyMember = async (
  familyMemberData: any,
  token: string
) => {
  try {
    console.log("Token usado para crear:", token);
    const response = await fetch(`${API_URL}/family-members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(familyMemberData),
    });
    if (!response.ok) {
      throw new Error("Error al crear el miembro de la familia");
    }
    return response.json();
  } catch (error: any) {
    throw new Error(error.message || "Error al crear el miembro de la familia");
  }
};

export const updateFamilyMember = async (
  familyMemberId: string,
  familyMemberData: any,
  token: string
) => {
  try {
    console.log("Token usado para actualizar:", token);
    const response = await fetch(`${API_URL}/family-members/${familyMemberId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(familyMemberData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error detallado:", errorData);
      throw new Error("Error al actualizar el miembro de la familia");
    }
    return response.json();
  } catch (error: any) {
    throw new Error(
      error.message || "Error al actualizar el miembro de la familia"
    );
  }
};

export const deleteFamilyMember = async (
  familyMemberId: string,
  token: string
) => {
  try {
    console.log("Token usado para eliminar:", token);
    const response = await fetch(`${API_URL}/family-members/${familyMemberId}`, {
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
      throw new Error("Error al eliminar el miembro de la familia");
    }
    return response.json();
  } catch (error: any) {
    throw new Error(
      error.message || "Error al eliminar el miembro de la familia"
    );
  }
};
