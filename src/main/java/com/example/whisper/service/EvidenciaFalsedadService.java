package com.example.whisper.service;



import com.example.whisper.entity.EvidenciaFalsedad;
import com.example.whisper.repository.IEvidenciaFalsedadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EvidenciaFalsedadService {

    @Autowired
    private IEvidenciaFalsedadRepository repoEviFalsedad;

    public List<EvidenciaFalsedad> listarTodos(){
        return repoEviFalsedad.findAll();
    }

    public EvidenciaFalsedad obtenerporId(Long id){
        return repoEviFalsedad.findById(id).orElse(null);
    }

    public EvidenciaFalsedad agregarEvidencia(EvidenciaFalsedad evidenciaFalsedad){
        return repoEviFalsedad.save(evidenciaFalsedad);
    }

    public EvidenciaFalsedad actualizarEvidencia(Long id, EvidenciaFalsedad evidenciaActualizada) {
        EvidenciaFalsedad evidenciaExistente = repoEviFalsedad.findById(id).orElse(null);

        if (evidenciaExistente == null) {
            return null;
        }

        evidenciaExistente.setUrl(evidenciaActualizada.getUrl());
        evidenciaExistente.setTipo(evidenciaActualizada.getTipo());

        return repoEviFalsedad.save(evidenciaExistente);
    }   

}
