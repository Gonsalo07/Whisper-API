// src/services/evidencia-api.ts

const API_BASE_URL = 'http://localhost:9090/api/evidencia';

export type Evidencia = {
  id?: number;
  denunciaId?: { id: number };
  url?: string;
  tipo?: string;
  estado?: string; // ← VISIBLE / OCULTO
  creadoEn?: string; // lo pone el backend automáticamente
};

export type EvidenciaCreate = {
  denunciaId: { id: number };
  url: string;
  tipo: string;
  // creadoEn y estado lo genera el backend
};

export type EvidenciaUpdate = {
  url?: string;
  tipo?: string;
};

export async function fetchEvidencias(): Promise<Evidencia[]> {
  const res = await fetch(API_BASE_URL);
  if (!res.ok) {
    if (res.status === 204) return [];
    throw new Error(`Error al obtener evidencias: ${res.status}`);
  }
  return res.json();
}

export async function fetchEvidenciaById(id: number): Promise<Evidencia | null> {
  const res = await fetch(`${API_BASE_URL}/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Error al obtener evidencia: ${res.status}`);
  return res.json();
}

export async function createEvidencia(data: EvidenciaCreate): Promise<Evidencia> {
  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Error al crear evidencia: ${res.status}`);
  }
  return res.json();
}

export async function updateEvidencia(id: number, data: EvidenciaUpdate): Promise<Evidencia> {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (res.status === 404) throw new Error('Evidencia no encontrada');
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Error al actualizar evidencia: ${res.status}`);
  }
  return res.json();
}

// DELETE → el backend lo cambia a OCULTO
export async function deleteEvidencia(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
  if (res.status === 404) throw new Error('Evidencia no encontrada');
  if (!res.ok) throw new Error(`Error al ocultar evidencia: ${res.status}`);
}

// ======================================
// API para obtener denuncias (dropdown)
// ======================================

const DENUNCIA_API_URL = 'http://localhost:9090/api/denuncia';

export type DenunciaDropdown = {
  id: number;
  label: string; // Título de la denuncia
};

export async function fetchDenunciasDropdown(): Promise<DenunciaDropdown[]> {
  const res = await fetch(`${DENUNCIA_API_URL}/dropdown`);
  if (!res.ok) {
    if (res.status === 204) return [];
    throw new Error(`Error al obtener denuncias: ${res.status}`);
  }
  return res.json();
}
