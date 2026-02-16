// src/services/evidencia-falsedad-api.ts

const API_BASE_URL = 'http://localhost:9090/api/evidencia-falsedad';

export type EvidenciaFalsedad = {
  id?: number;
  reporteId?: { id: number };
  url?: string;
  tipo?: string;
  estado?: string;        // ← nuevo: VISIBLE / OCULTO
  creadaEn?: string;      // lo pone el backend automáticamente
};

export type EvidenciaFalsedadCreate = {
  reporteId: { id: number };
  url: string;
  tipo: string;
  // creadaEn lo genera el TIMESTAMP de la BD
};

export type EvidenciaFalsedadUpdate = {
  url?: string;
  tipo?: string;
};

export async function fetchEvidencias(): Promise<EvidenciaFalsedad[]> {
  const res = await fetch(API_BASE_URL);
  if (!res.ok) {
    if (res.status === 204) return [];
    throw new Error(`Error al obtener evidencias: ${res.status}`);
  }
  return res.json();
}

export async function fetchEvidenciaById(id: number): Promise<EvidenciaFalsedad | null> {
  const res = await fetch(`${API_BASE_URL}/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Error al obtener evidencia: ${res.status}`);
  return res.json();
}

export async function createEvidencia(data: EvidenciaFalsedadCreate): Promise<EvidenciaFalsedad> {
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

export async function updateEvidencia(id: number, data: EvidenciaFalsedadUpdate): Promise<EvidenciaFalsedad> {
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