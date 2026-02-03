package com.example.whisper.service.impl;

import com.example.whisper.entity.Denuncia;
import com.example.whisper.repository.DenunciaRepository;
import com.example.whisper.service.DenunciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IDenunciaService implements DenunciaService {
    @Autowired
    private DenunciaRepository repoDenuncias;
    @Override
    public List<Denuncia> listarDenuncias() {
        return repoDenuncias.findAll();
    }

    @Override
    public Denuncia obtenerPorId(Long id) {
        return repoDenuncias.findById(id).orElse(null);
    }

    @Override
    public Denuncia crearDenuncia(Denuncia denuncia) {
        return repoDenuncias.save(denuncia);
    }

    @Override
    public void eliminarDenuncia(Denuncia denuncia) {
        repoDenuncias.delete(denuncia);
    }
}
