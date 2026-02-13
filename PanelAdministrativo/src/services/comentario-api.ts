// src/services/comentario-api.ts

const API_BASE_URL = 'http://localhost:9090/api/comentarios';

// -----------------------------------------------------------------------
// Tipos — reflejan tu entidad Comentario.java
// -----------------------------------------------------------------------

export type Comentario = {
  id?: number;
  denunciaId?: { id: number };   // relación ManyToOne → Denuncia
  aliasId?: { id: number };      // relación ManyToOne → AliasPublico
  contenido: string;
  creadoEn?: string;             // Date viene como string ISO desde Spring
};

export type ComentarioCreate = {
  denunciaId: { id: number };
  aliasId: { id: number };
  contenido: string;
};

export type ComentarioUpdate = {
  contenido: string;             // Solo contenido es editable según tu Service
};

// -----------------------------------------------------------------------
// GET - Listar todos los comentarios
// -----------------------------------------------------------------------
export async function fetchComentarios(): Promise<Comentario[]> {
  const response = await fetch(API_BASE_URL);

  if (!response.ok) {
    if (response.status === 204) return []; // No Content
    throw new Error(`Error al obtener comentarios: ${response.status}`);
  }

  return response.json();
}

// -----------------------------------------------------------------------
// GET - Obtener comentario por ID
// -----------------------------------------------------------------------
export async function fetchComentarioById(id: number): Promise<Comentario | null> {
  const response = await fetch(`${API_BASE_URL}/${id}`);

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Error al obtener comentario: ${response.status}`);
  }

  return response.json();
}

// -----------------------------------------------------------------------
// POST - Crear comentario
// -----------------------------------------------------------------------
export async function createComentario(comentario: ComentarioCreate): Promise<Comentario> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comentario),
  });

  if (!response.ok) {
    let errorMessage = `Error al crear comentario: ${response.status}`;
    try {
      const errorBody = await response.text();
      if (errorBody) errorMessage = errorBody;
    } catch { /* usar mensaje por defecto */ }

    throw new Error(errorMessage);
  }

  return response.json();
}

// -----------------------------------------------------------------------
// PUT - Actualizar comentario (solo contenido, igual a tu Service)
// -----------------------------------------------------------------------
export async function updateComentario(id: number, comentario: ComentarioUpdate): Promise<Comentario> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comentario),
  });

  if (!response.ok) {
    let errorMessage = `Error al actualizar comentario: ${response.status}`;
    try {
      const errorBody = await response.text();
      if (errorBody) errorMessage = errorBody;
    } catch { /* usar mensaje por defecto */ }

    if (response.status === 404) throw new Error('Comentario no encontrado');
    throw new Error(errorMessage);
  }

  return response.json();
}

// -----------------------------------------------------------------------
// DELETE - Eliminar comentario
// -----------------------------------------------------------------------
export async function deleteComentario(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    if (response.status === 404) throw new Error('Comentario no encontrado');
    throw new Error(`Error al eliminar comentario: ${response.status}`);
  }
}