package com.example.whisper.service.impl;

import com.example.whisper.entity.AliasPublico;
import com.example.whisper.repository.AliasPublicoRepository;
import com.example.whisper.service.AliasPublicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IAliasPublicoService implements AliasPublicoService {

    @Autowired
    private AliasPublicoRepository aliasPublicoRepository;

    @Override
    public List<AliasPublico> listar() {
        return aliasPublicoRepository.findAll();
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
