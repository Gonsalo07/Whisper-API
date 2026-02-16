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
@CrossOrigin(origins = "http://localhost:3039")
public class ReporteFalsedadController {

    @Autowired
    private ReporteFalsedadService reporteService;

    @GetMapping
    public ResponseEntity<List<ReporteFalsedad>> listarTodos() {
        List<ReporteFalsedad> reportes = reporteService.listarTodos();
        if (reportes.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(reportes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReporteFalsedad> obtenerPorId(@PathVariable Long id) {
        ReporteFalsedad reporte = reporteService.obtenerPorId(id);
        if (reporte == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(reporte);
    }

    @PostMapping
    public ResponseEntity<ReporteFalsedad> crearReporte(@RequestBody ReporteFalsedad reporte) {
        try {
            ReporteFalsedad nuevo = reporteService.crearReporte(reporte);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReporteFalsedad> actualizarReporte(@PathVariable Long id, @RequestBody ReporteFalsedad reporte) {
        try {
            ReporteFalsedad actualizado = reporteService.actualizarReporte(id, reporte);
            if (actualizado == null) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // DELETE ahora oculta en lugar de borrar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> ocultarReporte(@PathVariable Long id) {
        try {
            ReporteFalsedad reporte = reporteService.obtenerPorId(id);
            if (reporte == null) return ResponseEntity.notFound().build();
            reporteService.ocultarReporte(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}