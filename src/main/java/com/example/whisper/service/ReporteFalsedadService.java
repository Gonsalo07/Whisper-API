package com.example.whisper.service;


import com.example.whisper.entity.EvidenciaFalsedad;
import com.example.whisper.entity.ReporteFalsedad;
import com.example.whisper.repository.IEvidenciaFalsedadRepository;
import com.example.whisper.repository.IReporteFalsedadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReporteFalsedadService {

    @Autowired
    private IReporteFalsedadRepository repoReporFalsedad;

    public List<ReporteFalsedad> listarTodos(){
        return repoReporFalsedad.findAll();
    }

    public ReporteFalsedad obtenerporId(Long id){
        return repoReporFalsedad.findById(id).orElse(null);
    }

    public ReporteFalsedad agregarReporte(ReporteFalsedad reporteFalsedad){
        return repoReporFalsedad.save(reporteFalsedad);
    }

    public ReporteFalsedad actualizarReporte(Long id, ReporteFalsedad reporteActualizado) {
        ReporteFalsedad reporteExistente = repoReporFalsedad.findById(id).orElse(null);

        if (reporteExistente == null) {
            return null;
        }

        reporteExistente.setMotivo(reporteActualizado.getMotivo());

        return repoReporFalsedad.save(reporteExistente);
    }



}
