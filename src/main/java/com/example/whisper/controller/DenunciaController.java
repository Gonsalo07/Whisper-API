package com.example.whisper.controller;

import com.example.whisper.entity.Denuncia;
import com.example.whisper.service.DenunciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
<<<<<<< Updated upstream
@RequestMapping("api/denuncias")
=======
@RequestMapping("/api/denuncia")
@CrossOrigin(origins = "http://localhost:3039")
>>>>>>> Stashed changes
public class DenunciaController {

    @Autowired
    private DenunciaService denunciaService;

    /**
     * Endpoint para obtener denuncias en formato simplificado para dropdowns
     * Retorna: [{ id: 1, label: "Título de la denuncia" }, ...]
     */
    @GetMapping("/dropdown")
    public ResponseEntity<List<Map<String, Object>>> listarParaDropdown() {
        List<Denuncia> denuncias = denunciaService.listarTodas();

        List<Map<String, Object>> resultado = denuncias.stream()
                .map(d -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", d.getId());

                    // Usar el título como label principal
                    String titulo = d.getTitulo() != null && !d.getTitulo().trim().isEmpty()
                            ? d.getTitulo()
                            : "Denuncia sin título (ID: " + d.getId() + ")";

                    item.put("label", titulo);

                    return item;
                })
                .collect(Collectors.toList());

        if (resultado.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(resultado);
    }

    /**
     * Endpoint para obtener todas las denuncias completas
     */
    @GetMapping
    public ResponseEntity<List<Denuncia>> listarTodas() {
        List<Denuncia> denuncias = denunciaService.listarTodas();
        if (denuncias.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(denuncias);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Denuncia> obtenerPorId(@PathVariable Long id) {
        Denuncia denuncia = denunciaService.obtenerPorId(id);
        if (denuncia == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(denuncia);
    }

    @PostMapping
    public ResponseEntity<Denuncia> crearDenuncia(@RequestBody Denuncia denuncia) {
        try {
            Denuncia nueva = denunciaService.crearDenuncia(denuncia);
            return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Denuncia> actualizarDenuncia(@PathVariable Long id, @RequestBody Denuncia denuncia) {
        try {
            Denuncia actualizada = denunciaService.actualizarDenuncia(id, denuncia);
            if (actualizada == null) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(actualizada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Endpoint para cambiar solo el estado de una denuncia
     * Body: { "estado": "CONSISTENTE" }
     */
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Denuncia> cambiarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String nuevoEstado = body.get("estado");
            if (nuevoEstado == null || nuevoEstado.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            Denuncia actualizada = denunciaService.cambiarEstado(id, nuevoEstado);
            return ResponseEntity.ok(actualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDenuncia(@PathVariable Long id) {
        try {
            Denuncia denuncia = denunciaService.obtenerPorId(id);
            if (denuncia == null) return ResponseEntity.notFound().build();
            denunciaService.eliminarDenuncia(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}