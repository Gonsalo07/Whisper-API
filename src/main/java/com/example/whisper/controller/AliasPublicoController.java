package com.example.whisper.controller;

import com.example.whisper.entity.AliasPublico;
import com.example.whisper.service.impl.IAliasPublicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alias")
public class AliasPublicoController {

    @Autowired
    private IAliasPublicoService aliasService;

    @GetMapping
    public ResponseEntity<List<AliasPublico>> listar() {
        List<AliasPublico> lista = aliasService.listar();

        if (lista.isEmpty())
            return ResponseEntity.noContent().build();
        else
            return ResponseEntity.ok(lista);
    }

    @PostMapping
    public ResponseEntity<AliasPublico> crear(@RequestBody AliasPublico alias) {
        return ResponseEntity.ok(aliasService.guardar(alias));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AliasPublico> obtener(@PathVariable Long id) {
        AliasPublico a = aliasService.buscarPorId(id);

        if (a == null)
            return ResponseEntity.notFound().build();
        else
            return ResponseEntity.ok(a);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable AliasPublico alias) {
        aliasService.delete(alias);
        return ResponseEntity.ok().build();
    }

}
