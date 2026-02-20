package com.example.whisper.service;

import com.example.whisper.entity.Denuncia;
import com.example.whisper.entity.Evidencia;
import com.example.whisper.repository.IDenunciaRepository;
import com.example.whisper.repository.IEvidenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class EvidenciaService {

    @Autowired
    private IEvidenciaRepository repoEvidencia;

    @Autowired
    private IDenunciaRepository repoDenuncia;

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

    public Evidencia subirEvidencia(Long denunciaId, MultipartFile file) {

        if (file.isEmpty()) {
            throw new RuntimeException("El archivo está vacío");
        }

        Denuncia denuncia = repoDenuncia.findById(denunciaId)
                .orElseThrow(() -> new RuntimeException("Denuncia no encontrada"));

        try {

            String nombreArchivo = UUID.randomUUID() + "_" + file.getOriginalFilename();

            Path ruta = Paths.get("uploads/" + nombreArchivo);
            Files.createDirectories(ruta.getParent());
            Files.write(ruta, file.getBytes());

            Evidencia evidencia = new Evidencia();
            evidencia.setDenunciaId(denuncia);

            evidencia.setUrl("/uploads/" + nombreArchivo);

            evidencia.setTipo(file.getContentType());
            evidencia.setCreadoEn(new Date());
            evidencia.setEstado("VISIBLE");

            return repoEvidencia.save(evidencia);

        } catch (Exception e) {
            throw new RuntimeException("Error al subir archivo");
        }
    }

    public List<Evidencia> obtenerPorDenuncia(Long denunciaId) {
        return repoEvidencia.findByDenunciaIdIdAndEstado(denunciaId, "VISIBLE");
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
