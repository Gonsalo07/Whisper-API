// src/services/denuncia-api.ts


const API_BASE_URL = 'http://localhost:9090/api/denuncia';

export type Denuncia = {
  id?: number;
  usuarioId?: { id: number };
  aliasId?: { id: number };
  categoriaId?: { id: number };
  titulo?: string;
  descripcion?: string;
  estado?: string; // EN_EVALUACION | CUESTIONADA | CONSISTENTE
  creadaEn?: string;
};

export type DenunciaCreate = {
  usuarioId: { id: number };
  aliasId: { id: number };
  categoriaId: { id: number };
  titulo: string;
  descripcion: string;
  // estado y creadaEn los genera el backend
};

export type DenunciaUpdate = {
  titulo?: string;
  descripcion?: string;
  estado?: string;
  descripcion: string;
  estado?: string;
  creadaEn?: string;
};

export async function fetchDenuncias(): Promise<Denuncia[]> {
  const res = await fetch(API_BASE_URL);
  if (!res.ok) {
    if (res.status === 204) return [];
    throw new Error(`Error al obtener denuncias: ${res.status}`);
  }
  return res.json();
}

export async function fetchDenunciaById(id: number): Promise<Denuncia | null> {
  const res = await fetch(`${API_BASE_URL}/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Error al obtener denuncia: ${res.status}`);
  return res.json();
}

export async function createDenuncia(data: DenunciaCreate): Promise<Denuncia> {
  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Error al crear denuncia: ${res.status}`);
  }
  return res.json();
}

export async function updateDenuncia(id: number, data: DenunciaUpdate): Promise<Denuncia> {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (res.status === 404) throw new Error('Denuncia no encontrada');
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Error al actualizar denuncia: ${res.status}`);
  }
  return res.json();
}

export async function cambiarEstadoDenuncia(id: number, estado: string): Promise<Denuncia> {
  const res = await fetch(`${API_BASE_URL}/${id}/estado`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado }),
  });
  if (res.status === 404) throw new Error('Denuncia no encontrada');
  if (!res.ok) throw new Error('Estado inválido o error al cambiar estado');
  return res.json();
}

export async function deleteDenuncia(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
  if (res.status === 404) throw new Error('Denuncia no encontrada');
  if (!res.ok) throw new Error(`Error al eliminar denuncia: ${res.status}`);
}

// ======================================
// APIs para dropdowns
// ======================================

const USUARIO_API_URL = 'http://localhost:9090/api/usuario';
const ALIAS_API_URL = 'http://localhost:9090/api/alias-publico';
const CATEGORIA_API_URL = 'http://localhost:9090/api/categoria';

export type DropdownItem = {
  id: number;
  label: string;
};

// Obtener usuarios para dropdown (asumiendo que existe el endpoint)
export async function fetchUsuariosDropdown(): Promise<DropdownItem[]> {
  try {
    const res = await fetch(USUARIO_API_URL);
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((u: any) => ({
      id: u.id,
      label: u.email || `Usuario ${u.id}`,
    }));
  } catch {
    return [];
  }
}

// Obtener alias para dropdown (asumiendo que existe el endpoint)
export async function fetchAliasDropdown(): Promise<DropdownItem[]> {
  try {
    const res = await fetch(ALIAS_API_URL);
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((a: any) => ({
      id: a.id,
      label: a.alias || `Alias ${a.id}`,
    }));
  } catch {
    return [];
  }
}

// Obtener categorías para dropdown (asumiendo que existe el endpoint)
export async function fetchCategoriasDropdown(): Promise<DropdownItem[]> {
  try {
    const res = await fetch(CATEGORIA_API_URL);
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((c: any) => ({
      id: c.id,
      label: c.nombre || `Categoría ${c.id}`,
    }));
  } catch {
    return [];
  }
}
