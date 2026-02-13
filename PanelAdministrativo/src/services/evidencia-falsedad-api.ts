
const API_BASE_URL = 'http://localhost:9090/api/evidencia-falsedad';

export type EvidenciaFalsedad = {
  id?: number;
  reporteId?: { id: number };
  url?: string;
  tipo?: string;
  creadoEn?: string;
};

export type EvidenciaFalsedadCreate = {
  reporteId: { id: number };
  url?: string;
  tipo: string;
  creadoEn: string;
};

export type EvidenciaFalsedadUpdate = {
  url?: string;
  tipo?: string;
  creadoEn?: string;
};

export async function fetchEvidencias(): Promise<EvidenciaFalsedad[]> {
  const res = await fetch(API_BASE_URL);
  if (!res.ok) throw new Error(`Error al obtener evidencias: ${res.status}`);
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

export async function deleteEvidencia(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
  if (res.status === 404) throw new Error('Evidencia no encontrada');
  if (!res.ok) throw new Error(`Error al eliminar evidencia: ${res.status}`);
}