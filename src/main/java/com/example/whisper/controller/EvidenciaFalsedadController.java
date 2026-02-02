package com.example.whisper.controller;

import com.example.whisper.entity.Comentario;
import com.example.whisper.entity.EvidenciaFalsedad;
import com.example.whisper.service.ComentarioService;
import com.example.whisper.service.EvidenciaFalsedadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evidencia-falsedad")
public class EvidenciaFalsedadController {

    @Autowired
    private EvidenciaFalsedadService evidenciaFalsedadService;

    @GetMapping
    public ResponseEntity<List<EvidenciaFalsedad>> listarTodos() {
        List<EvidenciaFalsedad> envidencias = evidenciaFalsedadService.listarTodos();
        if (envidencias.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(envidencias);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EvidenciaFalsedad> obtenerPorId(@PathVariable Long id) {
        EvidenciaFalsedad evidencias = evidenciaFalsedadService.obtenerporId(id);
        if (evidencias == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(evidencias);
    }

    @PostMapping
    public ResponseEntity<EvidenciaFalsedad> agregarevidencia(@RequestBody EvidenciaFalsedad evidencia) {
        try {
            EvidenciaFalsedad nuevo = evidenciaFalsedadService.agregarEvidencia(evidencia);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<EvidenciaFalsedad> actualizarEvidencia(@PathVariable Long id, @RequestBody EvidenciaFalsedad evidencia) {
        try {
            EvidenciaFalsedad evidenciaActualizado = evidenciaFalsedadService.actualizarEvidencia(id, evidencia);
            if (evidenciaActualizado == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(evidenciaActualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
}
