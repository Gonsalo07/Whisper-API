package com.example.whisper.repository;

import com.example.whisper.entity.Denuncia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IDenunciaRepository extends JpaRepository<Denuncia, Long> {
    List<Denuncia> findByUsuarioId_Id(Long usuarioId);
}
