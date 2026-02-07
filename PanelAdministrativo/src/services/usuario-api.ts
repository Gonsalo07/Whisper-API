const API_BASE_URL = 'http://localhost:9090/api/usuarios';

export type Usuario = {
  id?: number;
  email: string;
  password?: string; // Solo para enviar al backend (se hashea internamente)
  rol?: string;
  estado: 'ACTIVO' | 'INACTIVO';
};

export type UsuarioCreate = {
  email: string;
  password: string;
  rol?: string;
  estado: 'ACTIVO' | 'INACTIVO';
};

export type UsuarioUpdate = {
  email?: string;
  password?: string;
  rol?: string;
  estado?: 'ACTIVO' | 'INACTIVO';
};

// GET - Listar todos los usuarios
export async function fetchUsuarios(): Promise<Usuario[]> {
  const response = await fetch(API_BASE_URL);
  
  if (!response.ok) {
    if (response.status === 204) {
      return []; // No Content
    }
    throw new Error(`Error al obtener usuarios: ${response.status}`);
  }
  
  return response.json();
}

// GET - Obtener usuario por ID
export async function fetchUsuarioById(id: number): Promise<Usuario | null> {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Error al obtener usuario: ${response.status}`);
  }
  
  return response.json();
}

// GET - Obtener usuario por email
export async function fetchUsuarioByEmail(email: string): Promise<Usuario | null> {
  const response = await fetch(`${API_BASE_URL}/email/${encodeURIComponent(email)}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Error al obtener usuario por email: ${response.status}`);
  }
  
  return response.json();
}

// POST - Crear usuario
export async function createUsuario(usuario: UsuarioCreate): Promise<Usuario> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usuario),
  });
  
  if (!response.ok) {
    let errorMessage = `Error al crear usuario: ${response.status}`;
    try {
      const errorBody = await response.text();
      if (errorBody) {
        errorMessage = errorBody;
      }
    } catch {
      // Si no se puede leer el cuerpo del error, usar el mensaje por defecto
    }
    
    if (response.status === 409) {
      throw new Error('El email ya está en uso');
    }
    if (response.status === 500) {
      throw new Error(`Error interno del servidor: ${errorMessage}`);
    }
    throw new Error(errorMessage);
  }
  
  return response.json();
}

// PUT - Actualizar usuario
export async function updateUsuario(id: number, usuario: UsuarioUpdate): Promise<Usuario> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usuario),
  });
  
  if (!response.ok) {
    let errorMessage = `Error al actualizar usuario: ${response.status}`;
    try {
      const errorBody = await response.text();
      if (errorBody) {
        errorMessage = errorBody;
      }
    } catch {
      // Si no se puede leer el cuerpo del error, usar el mensaje por defecto
    }
    
    if (response.status === 404) {
      throw new Error('Usuario no encontrado');
    }
    if (response.status === 500) {
      throw new Error(`Error interno del servidor: ${errorMessage}`);
    }
    throw new Error(errorMessage);
  }
  
  return response.json();
}

// DELETE - Eliminar usuario
export async function deleteUsuario(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Usuario no encontrado');
    }
    if (response.status === 500) {
      throw new Error('Error interno del servidor');
    }
    throw new Error(`Error al eliminar usuario: ${response.status}`);
  }
}
