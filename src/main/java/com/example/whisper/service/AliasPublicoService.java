package com.example.whisper.service;

import com.example.whisper.entity.AliasPublico;

import java.util.List;

public interface AliasPublicoService {

    List<AliasPublico> listar();
    AliasPublico guardar (AliasPublico alias);
    AliasPublico buscarPorId (Long id);
<<<<<<< Updated upstream
    void delete(AliasPublico alias);
=======
    AliasPublico buscarPorFirebaseId(String firebaseId);
    void cambiarEstado(Long id, String nuevoEstado);
>>>>>>> Stashed changes
    List<AliasPublico> buscarPorAlias(String nombre);

}
