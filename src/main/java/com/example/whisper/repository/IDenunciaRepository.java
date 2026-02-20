package com.example.whisper.repository;

import com.example.whisper.entity.Denuncia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IDenunciaRepository extends JpaRepository<Denuncia, Long> {
}
