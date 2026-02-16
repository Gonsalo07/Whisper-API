package com.example.whisper.service;

import com.example.whisper.entity.EvidenciaFalsedad;
import com.example.whisper.repository.IEvidenciaFalsedadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EvidenciaFalsedadService {

    @Autowired
    private IEvidenciaFalsedadRepository repoEvidencia;

    // Lista todas — VISIBLE y OCULTO — para que el admin vea el estado
    public List<EvidenciaFalsedad> listarTodas() {
        return repoEvidencia.findAll();
    }

    public EvidenciaFalsedad obtenerPorId(Long id) {
        return repoEvidencia.findById(id).orElse(null);
    }

    public EvidenciaFalsedad crearEvidencia(EvidenciaFalsedad evidencia) {
        evidencia.setEstado("VISIBLE");
        evidencia.setCreadaEn(LocalDateTime.now()); // ← fecha automática
        return repoEvidencia.save(evidencia);
    }

    public EvidenciaFalsedad actualizarEvidencia(Long id, EvidenciaFalsedad evidenciaActualizada) {
        EvidenciaFalsedad evidenciaExistente = repoEvidencia.findById(id).orElse(null);
        if (evidenciaExistente == null) return null;

        evidenciaExistente.setUrl(evidenciaActualizada.getUrl());
        evidenciaExistente.setTipo(evidenciaActualizada.getTipo());
        return repoEvidencia.save(evidenciaExistente);
    }

    // "Eliminar" = cambiar estado a OCULTO
    public void ocultarEvidencia(Long id) {
        EvidenciaFalsedad evidencia = repoEvidencia.findById(id)
                .orElseThrow(() -> new RuntimeException("Evidencia no encontrada"));
        evidencia.setEstado("OCULTO");
        repoEvidencia.save(evidencia);
    }
}