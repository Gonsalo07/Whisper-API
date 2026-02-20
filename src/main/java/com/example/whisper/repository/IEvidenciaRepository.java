package com.example.whisper.repository;

import com.example.whisper.entity.Evidencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IEvidenciaRepository extends JpaRepository<Evidencia, Long> {
    List<Evidencia> findByDenunciaIdIdAndEstado(Long denunciaId, String estado);

}