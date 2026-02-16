package com.example.whisper.repository;

import com.example.whisper.entity.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IComentarioRepository extends JpaRepository<Comentario, Long> {
    List<Comentario> findByEstado(String estado);
}
