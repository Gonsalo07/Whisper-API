package com.example.whisper.controller;

import com.example.whisper.entity.EvidenciaFalsedad;
import com.example.whisper.service.EvidenciaFalsedadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evidencia-falsedad")
@CrossOrigin(origins = "http://localhost:3039")
public class EvidenciaFalsedadController {

    @Autowired
    private EvidenciaFalsedadService evidenciaService;

    @GetMapping
    public ResponseEntity<List<EvidenciaFalsedad>> listarTodas() {
        List<EvidenciaFalsedad> evidencias = evidenciaService.listarTodas();
        if (evidencias.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(evidencias);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EvidenciaFalsedad> obtenerPorId(@PathVariable Long id) {
        EvidenciaFalsedad evidencia = evidenciaService.obtenerPorId(id);
        if (evidencia == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(evidencia);
    }

    @PostMapping
    public ResponseEntity<EvidenciaFalsedad> crearEvidencia(@RequestBody EvidenciaFalsedad evidencia) {
        try {
            EvidenciaFalsedad nueva = evidenciaService.crearEvidencia(evidencia);
            return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<EvidenciaFalsedad> actualizarEvidencia(@PathVariable Long id, @RequestBody EvidenciaFalsedad evidencia) {
        try {
            EvidenciaFalsedad actualizada = evidenciaService.actualizarEvidencia(id, evidencia);
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
            EvidenciaFalsedad evidencia = evidenciaService.obtenerPorId(id);
            if (evidencia == null) return ResponseEntity.notFound().build();
            evidenciaService.ocultarEvidencia(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}