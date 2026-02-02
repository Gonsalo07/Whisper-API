package com.example.whisper.repository;

import com.example.whisper.entity.EvidenciaFalsedad;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IEvidenciaFalsedadRepository extends JpaRepository<EvidenciaFalsedad,Long> {
}
