package com.example.whisper.service;

import com.example.whisper.entity.Evidencia;
import com.example.whisper.repository.IEvidenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class EvidenciaService {

    @Autowired
    private IEvidenciaRepository repoEvidencia;

    // Lista todas — VISIBLE y OCULTO — para que el admin vea el estado
    public List<Evidencia> listarTodas() {
        return repoEvidencia.findAll();
    }

    public Evidencia obtenerPorId(Long id) {
        return repoEvidencia.findById(id).orElse(null);
    }

    public Evidencia crearEvidencia(Evidencia evidencia) {
        evidencia.setEstado("VISIBLE");
        evidencia.setCreadoEn(new Date()); // ← fecha automática
        return repoEvidencia.save(evidencia);
    }

    public Evidencia actualizarEvidencia(Long id, Evidencia evidenciaActualizada) {
        Evidencia evidenciaExistente = repoEvidencia.findById(id).orElse(null);
        if (evidenciaExistente == null) return null;

        evidenciaExistente.setUrl(evidenciaActualizada.getUrl());
        evidenciaExistente.setTipo(evidenciaActualizada.getTipo());
        return repoEvidencia.save(evidenciaExistente);
    }

    // "Eliminar" = cambiar estado a OCULTO
    public void ocultarEvidencia(Long id) {
        Evidencia evidencia = repoEvidencia.findById(id)
                .orElseThrow(() -> new RuntimeException("Evidencia no encontrada"));
        evidencia.setEstado("OCULTO");
        repoEvidencia.save(evidencia);
    }
}
