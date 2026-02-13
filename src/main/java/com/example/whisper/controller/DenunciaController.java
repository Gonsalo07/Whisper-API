package com.example.whisper.controller;

import com.example.whisper.entity.Comentario;
import com.example.whisper.entity.Denuncia;
import com.example.whisper.service.CategoriaService;
import com.example.whisper.service.DenunciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/denuncias")
@CrossOrigin(origins = "http://localhost:3039")

public class DenunciaController {
    @Autowired
    private DenunciaService denunciaService;

    @GetMapping
    public ResponseEntity<List<Denuncia>> listar()
    {
        List<Denuncia> listaDenuncias = denunciaService.listarDenuncias();
        if(listaDenuncias.isEmpty())
            return ResponseEntity.noContent().build();
        else return ResponseEntity.ok().body(listaDenuncias);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> listarPorId(@PathVariable Long id)
    {
        Denuncia denuncia = denunciaService.obtenerPorId(id);
        if(denuncia == null)
            return ResponseEntity.notFound().build();
        else return ResponseEntity.ok().body(denuncia);
    }

    @PostMapping("")
    public ResponseEntity<Denuncia> addDenuncia(@RequestBody Denuncia denuncia) {
        try {
            Denuncia nuevo = denunciaService.crearDenuncia(denuncia);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
