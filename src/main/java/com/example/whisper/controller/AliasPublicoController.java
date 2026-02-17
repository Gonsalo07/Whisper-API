package com.example.whisper.controller;

import com.example.whisper.entity.AliasPublico;
import com.example.whisper.entity.Usuario;
import com.example.whisper.repository.UsuarioRepository;
import com.example.whisper.service.impl.IAliasPublicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/alias")
@CrossOrigin(origins = "http://localhost:3039")
public class AliasPublicoController {

    @Autowired
    private IAliasPublicoService aliasService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<AliasPublico>> listar(@RequestParam(required = false) String nombre) {
        List<AliasPublico> lista;
        if (nombre != null && !nombre.isEmpty()) {
            lista = aliasService.buscarPorAlias(nombre);
        } else {
            lista = aliasService.listar();
        }

        // Si la lista es null o vacía, devolvemos 204 (No Content)
        // Esto es lo que el Frontend ya está preparado para recibir
        if (lista == null || lista.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
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
    public ResponseEntity<?> crear(@RequestBody AliasPublico alias) {
        try {
            // Validación robusta del usuario
            if (alias.getUsuarioId() == null || alias.getUsuarioId().getId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("ID de usuario no proporcionado");
            }

            Usuario usuarioExistente = usuarioRepository.findById(alias.getUsuarioId().getId()).orElse(null);

            if (usuarioExistente == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("El usuario responsable no existe");
            }

            alias.setUsuarioId(usuarioExistente);
            alias.setCreadoEn(new java.util.Date());

            AliasPublico nuevo = aliasService.guardar(alias);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        AliasPublico a = aliasService.buscarPorId(id);
        if (a == null) {
            return ResponseEntity.notFound().build();
        }
        aliasService.delete(a);
        return ResponseEntity.ok().build();
    }
}
