// src/services/denuncia-api.ts

const API_BASE_URL = 'http://localhost:9090/api/denuncias';

export type Denuncia = {
  id?: number;
  usuarioId?: { id: number };
  aliasId?: { id: number };
  categoriaId?: { id: number };
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