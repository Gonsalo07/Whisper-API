package com.example.whisper.service;

import com.example.whisper.entity.Categoria;

import java.util.List;

public interface CategoriaService {
    List<Categoria> listar();
    Categoria crear(Categoria categoria);
    void delete(Categoria categoria);
}
