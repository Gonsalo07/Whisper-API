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
@Table(name = "comentarios")

public class Comentario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "denuncia_id", nullable = false)
    private Denuncia denunciaId;

    @ManyToOne
    @JoinColumn(name = "alias_id", nullable = false)
    private AliasPublico aliasId;

    @Column(name = "contenido")
    private String contenido;

    @Column(name = "creado_en")
    private Date creadoEn;



}
