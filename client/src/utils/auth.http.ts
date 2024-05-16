const API_URL = "http://localhost:3000/api/auth"; // Reemplaza con la URL de tu API

// Login
export const loginHttp = async ({
  user,
}: {
  user: {
    userName: string;
    password: string;
  };
}) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Error al iniciar sesión");
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Error al iniciar sesión");
  }
};

// Register
export const register = async ({
  user,
}: {
  user: {
    fullName: string;
    userName: string;
    password: string;
    confirmPassword: string;
  };
}) => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Error al registrar");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Error al registrar");
  }
};

// Logout
export const logout = async () => {
  try {
    // Remueve el token del local storage o cookies
    localStorage.removeItem("token");
  } catch (error) {
    throw new Error("Error al cerrar sesión");
  }
};
