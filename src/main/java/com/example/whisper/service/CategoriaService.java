package com.example.whisper.service;

import com.example.whisper.entity.Categoria;

import java.util.List;

public interface CategoriaService {
    List<Categoria> listar();
    Categoria listarPorId(Long id);
    Categoria crear(Categoria categoria);
    Categoria actualizar(Categoria categoria);
    void delete(Categoria categoria);
}
