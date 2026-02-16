package com.example.whisper.controller;

import com.example.whisper.entity.AliasPublico;
import com.example.whisper.service.impl.IAliasPublicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    /**
     * Endpoint para obtener alias en formato simplificado para dropdowns
     * Retorna: [{ id: 1, label: "NombreAlias" }, ...]
     */
    @GetMapping("/dropdown")
    public ResponseEntity<List<Map<String, Object>>> listarParaDropdown() {
        List<AliasPublico> aliases = aliasService.listar();

        List<Map<String, Object>> resultado = aliases.stream()
                .map(a -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", a.getId());
                    item.put("label", a.getAlias());
                    return item;
                })
                .collect(Collectors.toList());

        if (resultado.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(resultado);
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
