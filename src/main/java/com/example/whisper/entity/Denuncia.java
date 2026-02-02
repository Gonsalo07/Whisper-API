package com.example.whisper.entity;

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

@Table(name = "tbl_denuncia")
public class Denuncia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne()
    @JoinColumn(name = "usuario_id",  nullable = false)
    private Usuario usuarioId;

    @ManyToOne()
    @JoinColumn(name = "usuario_id",  nullable = false)
    private Usuario usuarioId;

    @ManyToOne()
    @JoinColumn(name = "alias_id",  nullable = false)
    private AliasPublico aliasId;

    @ManyToOne()
    @JoinColumn(name = "categoria_id",  nullable = false)
    private Categoria categoriaId;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "estado")
    private String estado;

    @Column(name = "creada_en")
    private Date creadaEn;
}
