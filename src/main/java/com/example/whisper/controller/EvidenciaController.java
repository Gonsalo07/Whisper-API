package com.example.whisper.controller;

import com.example.whisper.entity.Evidencia;
import com.example.whisper.service.impl.IEvidenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evidencias")
@CrossOrigin(origins = "http://localhost:3039")

public class EvidenciaController {

    @Autowired
    private IEvidenciaService evidenciaService;

    @GetMapping
    public ResponseEntity<List<Evidencia>> listar() {
        List<Evidencia> lista = evidenciaService.listar();

        if (lista.isEmpty())
            return ResponseEntity.noContent().build();
        else
            return ResponseEntity.ok(lista);
    }

    @PostMapping
    public ResponseEntity<Evidencia> crear(@RequestBody Evidencia evidencia) {
        return ResponseEntity.ok(evidenciaService.guardar(evidencia));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Evidencia> obtener(@PathVariable Long id) {
        Evidencia e = evidenciaService.buscarPorId(id);

        if (e == null)
            return ResponseEntity.notFound().build();
        else
            return ResponseEntity.ok(e);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Evidencia evidencia) {
        evidenciaService.delete(evidencia);
        return ResponseEntity.ok().build();
    }

}
