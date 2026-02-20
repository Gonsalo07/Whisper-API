package com.example.whisper.service;

import com.example.whisper.entity.Denuncia;
import com.example.whisper.repository.IDenunciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class DenunciaService {

    @Autowired
    private IDenunciaRepository repoDenuncia;

    // Lista todas las denuncias
    public List<Denuncia> listarTodas() {
        return repoDenuncia.findAll();
    }

    public Denuncia obtenerPorId(Long id) {
        return repoDenuncia.findById(id).orElse(null);
    }

    public Denuncia crearDenuncia(Denuncia denuncia) {
        // Establecer estado inicial y fecha
        denuncia.setEstado("EN_EVALUACION");
        denuncia.setCreadaEn(new Date());
        return repoDenuncia.save(denuncia);
    }

    public Denuncia actualizarDenuncia(Long id, Denuncia denunciaActualizada) {
        Denuncia denunciaExistente = repoDenuncia.findById(id).orElse(null);
        if (denunciaExistente == null) return null;

        // Actualizar campos
        denunciaExistente.setTitulo(denunciaActualizada.getTitulo());
        denunciaExistente.setDescripcion(denunciaActualizada.getDescripcion());
        denunciaExistente.setEstado(denunciaActualizada.getEstado());

        // No actualizar usuarioId, aliasId, categoriaId, ni creadaEn

        return repoDenuncia.save(denunciaExistente);
    }

    // Cambiar estado de la denuncia
    public Denuncia cambiarEstado(Long id, String nuevoEstado) {
        Denuncia denuncia = repoDenuncia.findById(id)
                .orElseThrow(() -> new RuntimeException("Denuncia no encontrada"));

        // Validar que el estado sea válido
        if (!nuevoEstado.equals("EN_EVALUACION") &&
                !nuevoEstado.equals("CUESTIONADA") &&
                !nuevoEstado.equals("CONSISTENTE")) {
            throw new RuntimeException("Estado inválido. Use: EN_EVALUACION, CUESTIONADA o CONSISTENTE");
        }

        denuncia.setEstado(nuevoEstado);
        return repoDenuncia.save(denuncia);
    }

    // Eliminar denuncia (borrado físico - usa con precaución)
    public void eliminarDenuncia(Long id) {
        Denuncia denuncia = repoDenuncia.findById(id)
                .orElseThrow(() -> new RuntimeException("Denuncia no encontrada"));
        repoDenuncia.delete(denuncia);
    }
}