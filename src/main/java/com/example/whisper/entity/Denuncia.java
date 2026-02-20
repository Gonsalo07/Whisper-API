package com.example.whisper.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Table(name = "denuncias")
public class Denuncia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne()
    @JoinColumn(name = "usuario_id",  nullable = false)
    private Usuario usuarioId;

    @ManyToOne()
    @JoinColumn(name = "alias_id",  nullable = false)
    private AliasPublico aliasId;

    @ManyToOne()
    @JoinColumn(name = "categoria_id",  nullable = false)
    private Categoria categoriaId;

    @Column(name = "titulo")
    private String titulo;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "ubicacion")
    private String ubicacion;

    @Column(name = "estado")
    private String estado;

    @Column(name = "creada_en")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date creadaEn;
}
