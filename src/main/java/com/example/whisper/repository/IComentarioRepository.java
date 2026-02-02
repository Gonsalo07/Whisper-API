package com.example.whisper.repository;

import com.example.whisper.entity.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IComentarioRepository extends JpaRepository<Comentario, Long> {
}
