package com.example.whisper.service;

import com.example.whisper.entity.Evidencia;

import java.util.List;

public interface EvidenciaService {

    List<Evidencia> listar();
    Evidencia guardar (Evidencia evidencia);
    Evidencia buscarPorId (Long id);
    void delete (Evidencia evidencia);

}
