package com.example.whisper.controller;

import com.example.whisper.entity.Evidencia;
import com.example.whisper.service.EvidenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
<<<<<<< Updated upstream
@RequestMapping("/api/evidencias")
=======
@RequestMapping("/api/evidencia")
@CrossOrigin(origins = "http://localhost:3039")
>>>>>>> Stashed changes
public class EvidenciaController {

    @Autowired
    private EvidenciaService evidenciaService;

    @GetMapping
    public ResponseEntity<List<Evidencia>> listarTodas() {
        List<Evidencia> evidencias = evidenciaService.listarTodas();
        if (evidencias.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(evidencias);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Evidencia> obtenerPorId(@PathVariable Long id) {
        Evidencia evidencia = evidenciaService.obtenerPorId(id);
        if (evidencia == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(evidencia);
    }

    @PostMapping
    public ResponseEntity<Evidencia> crearEvidencia(@RequestBody Evidencia evidencia) {
        try {
            Evidencia nueva = evidenciaService.crearEvidencia(evidencia);
            return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Evidencia> actualizarEvidencia(@PathVariable Long id, @RequestBody Evidencia evidencia) {
        try {
            Evidencia actualizada = evidenciaService.actualizarEvidencia(id, evidencia);
            if (actualizada == null) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(actualizada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // DELETE ahora oculta en lugar de borrar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> ocultarEvidencia(@PathVariable Long id) {
        try {
            Evidencia evidencia = evidenciaService.obtenerPorId(id);
            if (evidencia == null) return ResponseEntity.notFound().build();
            evidenciaService.ocultarEvidencia(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
