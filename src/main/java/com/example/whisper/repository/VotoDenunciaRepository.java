package com.example.whisper.repository;

import com.example.whisper.entity.VotoDenuncia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VotoDenunciaRepository extends JpaRepository<VotoDenuncia, Long> {
    List<VotoDenuncia> findByDenunciaId_Id(Long denunciaId);
    List<VotoDenuncia> findByUsuarioId_Id(Long usuarioId);
    Optional<VotoDenuncia> findByDenunciaId_IdAndUsuarioId_Id(Long denunciaId, Long usuarioId);
}
