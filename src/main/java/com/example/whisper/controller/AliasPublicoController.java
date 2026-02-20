package com.example.whisper.controller;

import com.example.whisper.entity.AliasPublico;
import com.example.whisper.entity.Usuario;
import com.example.whisper.repository.UsuarioRepository;
import com.example.whisper.service.impl.IAliasPublicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id) {
        try {
            AliasPublico a = aliasService.buscarPorId(id);

            if (a == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Alias no encontrado");
            }

            // CAMBIO AQUÍ: Usamos getEstado() y setEstado()
            // Invertimos el valor actual: si es true pasa a false y viceversa
            a.setEstado(!a.getEstado());

            aliasService.guardar(a);

            return ResponseEntity.ok("Estado del alias actualizado correctamente");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al cambiar el estado");
        }
    }
}
