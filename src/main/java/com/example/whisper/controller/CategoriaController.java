package com.example.whisper.controller;

import com.example.whisper.entity.Categoria;
import com.example.whisper.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {
    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    public ResponseEntity<List<Categoria>> listar() {
        List<Categoria> listaCategoria = categoriaService.listar();
        if(listaCategoria.isEmpty())
            return ResponseEntity.noContent().build();
        else return ResponseEntity.ok().body(listaCategoria);
    }

     @GetMapping("/{id}")
    public ResponseEntity<?> listarPorId(@PathVariable Long id)
     {
        Categoria categoria = categoriaService.listarPorId(id);
        if(categoria == null)
            return ResponseEntity.notFound().build();
        else return ResponseEntity.ok().body(categoria);
     }
}
