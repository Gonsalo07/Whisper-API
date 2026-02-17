package com.example.whisper.service;

import com.example.whisper.entity.ReporteFalsedad;
import com.example.whisper.repository.IReporteFalsedadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReporteFalsedadService {

    @Autowired
    private IReporteFalsedadRepository repoReporte;

    // Lista todos — VISIBLE y OCULTO — para que el admin vea el estado
    public List<ReporteFalsedad> listarTodos() {
        return repoReporte.findAll();
    }

    public ReporteFalsedad obtenerPorId(Long id) {
        return repoReporte.findById(id).orElse(null);
    }

    public ReporteFalsedad crearReporte(ReporteFalsedad reporte) {
        reporte.setEstado("VISIBLE");
        reporte.setCreadoEn(LocalDateTime.now()); // ← fecha automática
        return repoReporte.save(reporte);
    }

    public ReporteFalsedad actualizarReporte(Long id, ReporteFalsedad reporteActualizado) {
        ReporteFalsedad reporteExistente = repoReporte.findById(id).orElse(null);
        if (reporteExistente == null) return null;

        reporteExistente.setMotivo(reporteActualizado.getMotivo());
        return repoReporte.save(reporteExistente);
    }

    // "Eliminar" = cambiar estado a OCULTO
    public void ocultarReporte(Long id) {
        ReporteFalsedad reporte = repoReporte.findById(id)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado"));
        reporte.setEstado("OCULTO");
        repoReporte.save(reporte);
    }
}