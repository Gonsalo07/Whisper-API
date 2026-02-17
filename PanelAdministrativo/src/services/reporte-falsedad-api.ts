// src/services/reporte-falsedad-api.ts

const API_BASE_URL = 'http://localhost:9090/api/reporte-falsedad';

export type ReporteFalsedad = {
  id?: number;
  denunciaId?: { id: number };
  usuarioId?: { id: number };
  motivo?: string;
  estado?: string;        // ← nuevo: VISIBLE / OCULTO
  creadoEn?: string;      // lo pone el backend automáticamente
};

export type ReporteFalsedadCreate = {
  denunciaId: { id: number };
  usuarioId: { id: number };
  motivo: string;
  // creadoEn lo genera el TIMESTAMP de la BD
};

export type ReporteFalsedadUpdate = {
  motivo?: string;
};

export async function fetchReportes(): Promise<ReporteFalsedad[]> {
  const res = await fetch(API_BASE_URL);
  if (!res.ok) {
    if (res.status === 204) return [];
    throw new Error(`Error al obtener reportes: ${res.status}`);
  }
  return res.json();
}

export async function fetchReporteById(id: number): Promise<ReporteFalsedad | null> {
  const res = await fetch(`${API_BASE_URL}/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Error al obtener reporte: ${res.status}`);
  return res.json();
}

export async function createReporte(data: ReporteFalsedadCreate): Promise<ReporteFalsedad> {
  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error al crear reporte: ${res.status}`);
  return res.json();
}

export async function updateReporte(id: number, data: ReporteFalsedadUpdate): Promise<ReporteFalsedad> {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (res.status === 404) throw new Error('Reporte no encontrado');
  if (!res.ok) throw new Error(`Error al actualizar reporte: ${res.status}`);
  return res.json();
}

// DELETE → el backend lo cambia a OCULTO
export async function deleteReporte(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
  if (res.status === 404) throw new Error('Reporte no encontrado');
  if (!res.ok) throw new Error(`Error al ocultar reporte: ${res.status}`);
}