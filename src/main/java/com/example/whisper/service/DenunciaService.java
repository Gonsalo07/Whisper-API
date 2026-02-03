package com.example.whisper.service;

import com.example.whisper.entity.Denuncia;

import java.util.List;

public interface DenunciaService {
    List<Denuncia> listarDenuncias();
    Denuncia obtenerPorId(Long id);
    Denuncia crearDenuncia(Denuncia denuncia);
    void eliminarDenuncia(Denuncia denuncia);
}
