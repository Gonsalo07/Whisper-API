package com.example.whisper.service;

import com.example.whisper.entity.Comentario;
import com.example.whisper.repository.IComentarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComentarioService {

    @Autowired
    private IComentarioRepository repoComentario;

    // Lista todos — VISIBLE y OCULTO — para que el admin vea el estado
    public List<Comentario> listarTodos() {
        return repoComentario.findAll();
    }

    public Comentario obtenerporId(Long id) {
        return repoComentario.findById(id).orElse(null);
    }

    public Comentario agregarComentario(Comentario comentario) {
        comentario.setEstado("VISIBLE");
        comentario.setCreadoEn(LocalDateTime.now()); // ← fecha automática
        return repoComentario.save(comentario);
    }

    public Comentario actualizarComentario(Long id, Comentario comentarioActualizado) {
        Comentario comentarioExistente = repoComentario.findById(id).orElse(null);
        if (comentarioExistente == null) return null;

        comentarioExistente.setContenido(comentarioActualizado.getContenido());
        return repoComentario.save(comentarioExistente);
    }

    // "Eliminar" = cambiar estado a OCULTO
    public void ocultarComentario(Long id) {
        Comentario comentario = repoComentario.findById(id)
                .orElseThrow(() -> new RuntimeException("Comentario no encontrado"));
        comentario.setEstado("OCULTO");
        repoComentario.save(comentario);
    }
}