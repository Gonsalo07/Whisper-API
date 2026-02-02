package com.example.whisper.controller;

import com.example.whisper.entity.VotoDenuncia;
import com.example.whisper.service.VotoDenunciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/votos-denuncia")
public class VotoDenunciaController {

    @Autowired
    private VotoDenunciaService votoDenunciaService;

    @GetMapping
    public ResponseEntity<List<VotoDenuncia>> listarTodos() {
        List<VotoDenuncia> votos = votoDenunciaService.listarTodos();
        if (votos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(votos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VotoDenuncia> obtenerPorId(@PathVariable Long id) {
        VotoDenuncia voto = votoDenunciaService.obtenerPorId(id);
        if (voto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(voto);
    }

    @GetMapping("/denuncia/{denunciaId}")
    public ResponseEntity<List<VotoDenuncia>> obtenerPorDenuncia(@PathVariable Long denunciaId) {
        List<VotoDenuncia> votos = votoDenunciaService.obtenerPorDenuncia(denunciaId);
        if (votos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(votos);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<VotoDenuncia>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        List<VotoDenuncia> votos = votoDenunciaService.obtenerPorUsuario(usuarioId);
        if (votos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(votos);
    }

    @GetMapping("/denuncia/{denunciaId}/usuario/{usuarioId}")
    public ResponseEntity<VotoDenuncia> obtenerVotoPorDenunciaYUsuario(
            @PathVariable Long denunciaId,
            @PathVariable Long usuarioId) {
        VotoDenuncia voto = votoDenunciaService.obtenerVotoPorDenunciaYUsuario(denunciaId, usuarioId);
        if (voto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(voto);
    }

    @PostMapping
    public ResponseEntity<VotoDenuncia> crearVoto(@RequestBody VotoDenuncia votoDenuncia) {
        try {
            VotoDenuncia nuevo = votoDenunciaService.crearVoto(votoDenuncia);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<VotoDenuncia> actualizarVoto(@PathVariable Long id, @RequestBody VotoDenuncia votoDenuncia) {
        try {
            VotoDenuncia votoActualizado = votoDenunciaService.actualizarVoto(id, votoDenuncia);
            if (votoActualizado == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(votoActualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarVoto(@PathVariable Long id) {
        try {
            VotoDenuncia voto = votoDenunciaService.obtenerPorId(id);
            if (voto == null) {
                return ResponseEntity.notFound().build();
            }
            votoDenunciaService.eliminarVoto(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
