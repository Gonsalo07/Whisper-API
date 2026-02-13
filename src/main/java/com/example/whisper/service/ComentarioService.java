package com.example.whisper.service;

import com.example.whisper.entity.Comentario;
import com.example.whisper.repository.IComentarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComentarioService {

    @Autowired
    private IComentarioRepository repoComentario;

    public List<Comentario> listarTodos(){
        return repoComentario.findAll();
    }

    public Comentario obtenerporId(Long id){
        return repoComentario.findById(id).orElse(null);
    }

    public Comentario agregarComentario(Comentario comentario){
        return repoComentario.save(comentario);
    }

    public Comentario actualizarComentario(Long id, Comentario comentarioActualizado) {
        Comentario comentarioExistente = repoComentario.findById(id).orElse(null);

        if (comentarioExistente == null) {
            return null;
        }

        comentarioExistente.setContenido(comentarioActualizado.getContenido());


        return repoComentario.save(comentarioExistente);
    }

    public void eliminarComentario(Long id) {
        repoComentario.deleteById(id);
    }



}
