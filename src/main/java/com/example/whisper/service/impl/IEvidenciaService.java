package com.example.whisper.service.impl;

import com.example.whisper.entity.Evidencia;
import com.example.whisper.repository.EvidenciaRepository;
import com.example.whisper.service.EvidenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IEvidenciaService implements EvidenciaService {

    @Autowired
    private EvidenciaRepository evidenciaRepository;

    @Override
    public List<Evidencia> listar() {
        return evidenciaRepository.findAll();
    }

    @Override
    public Evidencia guardar(Evidencia evidencia) {
        return evidenciaRepository.save(evidencia);
    }

    @Override
    public Evidencia buscarPorId(Long id) {
        return evidenciaRepository.findById(id).orElse(null);
    }

    @Override
    public void delete(Evidencia evidencia) {
        evidenciaRepository.delete(evidencia);
    }

}
