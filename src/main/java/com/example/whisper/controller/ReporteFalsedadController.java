package com.example.whisper.controller;

import com.example.whisper.entity.ReporteFalsedad;
import com.example.whisper.service.ReporteFalsedadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reporte-falsedad")
public class ReporteFalsedadController {
    
    @Autowired
    private ReporteFalsedadService reporteFalsedadService;

    @GetMapping
    public ResponseEntity<List<ReporteFalsedad>> listarTodos() {
        List<ReporteFalsedad> reporte = reporteFalsedadService.listarTodos();
        if (reporte.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(reporte);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReporteFalsedad> obtenerPorId(@PathVariable Long id) {
        ReporteFalsedad reporte = reporteFalsedadService.obtenerporId(id);
        if (reporte == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(reporte);
    }

    @PostMapping
    public ResponseEntity<ReporteFalsedad> agregarreporte(@RequestBody ReporteFalsedad reporte) {
        try {
            ReporteFalsedad nuevo = reporteFalsedadService.agregarReporte(reporte);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReporteFalsedad> actualizarreporte(@PathVariable Long id, @RequestBody ReporteFalsedad reporte) {
        try {
            ReporteFalsedad reporteActualizado = reporteFalsedadService.actualizarReporte(id, reporte);
            if (reporteActualizado == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(reporteActualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    
    
}
