package com.example.whisper.service;

import com.example.whisper.entity.AliasPublico;

import java.util.List;

public interface AliasPublicoService {

    List<AliasPublico> listar();
    AliasPublico guardar (AliasPublico alias);
    AliasPublico actualizar(Long id,AliasPublico alias);
    AliasPublico buscarPorId (Long id);
    AliasPublico buscarPorFirebaseId(String firebaseId);
    void delete(AliasPublico alias);
    List<AliasPublico> buscarPorAlias(String nombre);

}
