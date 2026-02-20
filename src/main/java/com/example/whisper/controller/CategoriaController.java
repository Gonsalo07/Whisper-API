package com.example.whisper.controller;

import com.example.whisper.entity.Categoria;
import com.example.whisper.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "http://localhost:3039")

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

    /**
     * Endpoint para obtener categorías en formato simplificado para dropdowns
     * Retorna: [{ id: 1, label: "Nombre Categoría" }, ...]
     */
    @GetMapping("/dropdown")
    public ResponseEntity<List<Map<String, Object>>> listarParaDropdown() {
        List<Categoria> categorias = categoriaService.listar();

        List<Map<String, Object>> resultado = categorias.stream()
                .map(c -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", c.getId());
                    item.put("label", c.getNombre());
                    return item;
                })
                .collect(Collectors.toList());

        if (resultado.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(resultado);
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
