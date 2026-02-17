package com.example.whisper.controller;

import com.example.whisper.entity.Comentario;
import com.example.whisper.service.ComentarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comentarios")
@CrossOrigin(origins = "http://localhost:3039")
public class ComentarioController {

    @Autowired
    private ComentarioService comentarioService;

    @GetMapping
    public ResponseEntity<List<Comentario>> listarTodos() {
        List<Comentario> comentarios = comentarioService.listarTodos();
        if (comentarios.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(comentarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Comentario> obtenerPorId(@PathVariable Long id) {
        Comentario comentario = comentarioService.obtenerporId(id);
        if (comentario == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(comentario);
    }

    @PostMapping
    public ResponseEntity<Comentario> agregarComentario(@RequestBody Comentario comentario) {
        try {
            Comentario nuevo = comentarioService.agregarComentario(comentario);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comentario> actualizarComentario(@PathVariable Long id, @RequestBody Comentario comentario) {
        try {
            Comentario actualizado = comentarioService.actualizarComentario(id, comentario);
            if (actualizado == null) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // DELETE ahora oculta en lugar de borrar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> ocultarComentario(@PathVariable Long id) {
        try {
            Comentario comentario = comentarioService.obtenerporId(id);
            if (comentario == null) return ResponseEntity.notFound().build();
            comentarioService.ocultarComentario(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}