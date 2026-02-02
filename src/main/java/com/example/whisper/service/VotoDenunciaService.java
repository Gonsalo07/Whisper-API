package com.example.whisper.service;

import com.example.whisper.entity.VotoDenuncia;
import com.example.whisper.repository.VotoDenunciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VotoDenunciaService {

    @Autowired
    private VotoDenunciaRepository votoDenunciaRepository;

    public List<VotoDenuncia> listarTodos() {
        return votoDenunciaRepository.findAll();
    }

    public VotoDenuncia obtenerPorId(Long id) {
        return votoDenunciaRepository.findById(id).orElse(null);
    }

    public List<VotoDenuncia> obtenerPorDenuncia(Long denunciaId) {
        return votoDenunciaRepository.findByDenunciaId_Id(denunciaId);
    }

    public List<VotoDenuncia> obtenerPorUsuario(Long usuarioId) {
        return votoDenunciaRepository.findByUsuarioId_Id(usuarioId);
    }

    public VotoDenuncia obtenerVotoPorDenunciaYUsuario(Long denunciaId, Long usuarioId) {
        return votoDenunciaRepository.findByDenunciaId_IdAndUsuarioId_Id(denunciaId, usuarioId).orElse(null);
    }

    public VotoDenuncia crearVoto(VotoDenuncia votoDenuncia) {
        return votoDenunciaRepository.save(votoDenuncia);
    }

    public VotoDenuncia actualizarVoto(Long id, VotoDenuncia votoActualizado) {
        VotoDenuncia votoExistente = votoDenunciaRepository.findById(id).orElse(null);

        if (votoExistente == null) {
            return null;
        }

        votoExistente.setVoto(votoActualizado.getVoto());
        votoExistente.setDenunciaId(votoActualizado.getDenunciaId());
        votoExistente.setUsuarioId(votoActualizado.getUsuarioId());
        votoExistente.setCreadoEn(votoActualizado.getCreadoEn());

        return votoDenunciaRepository.save(votoExistente);
    }

    public void eliminarVoto(Long id) {
        votoDenunciaRepository.deleteById(id);
    }
}
