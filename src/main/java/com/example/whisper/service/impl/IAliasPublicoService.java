package com.example.whisper.service.impl;

import com.example.whisper.entity.AliasPublico;
import com.example.whisper.entity.Usuario;
import com.example.whisper.repository.AliasPublicoRepository;
import com.example.whisper.repository.UsuarioRepository;
import com.example.whisper.service.AliasPublicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IAliasPublicoService implements AliasPublicoService {

    @Autowired
    private AliasPublicoRepository aliasPublicoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Override
    public List<AliasPublico> listar() {
        return aliasPublicoRepository.findAll();
    }
    
    @Override
    public AliasPublico actualizar(Long id, AliasPublico aliasData) {
        AliasPublico aliasExistente = aliasPublicoRepository.findById(id).orElse(null);
        if (aliasExistente != null) {
            aliasExistente.setAlias(aliasData.getAlias());
            return aliasPublicoRepository.save(aliasExistente);
        }
        return null;
    }

    public AliasPublico buscarPorFirebaseId(String firebaseId) {
    	Usuario usuario = usuarioRepository.findByFirebaseId(firebaseId).orElse(null);
        if (usuario != null) {
            return aliasPublicoRepository.findByUsuarioId(usuario);
        }
        return null;
    }

    @Override
    public AliasPublico guardar(AliasPublico alias) {
        return aliasPublicoRepository.save(alias);
    }

    @Override
    public AliasPublico buscarPorId(Long id) {
        return aliasPublicoRepository.findById(id).orElse(null);
    }

    @Override
    public List<AliasPublico> buscarPorAlias(String nombre) { return aliasPublicoRepository.findByAliasContainingIgnoreCase(nombre); }

    @Override
    public void delete(AliasPublico alias) {
        aliasPublicoRepository.delete(alias);
    }

}
