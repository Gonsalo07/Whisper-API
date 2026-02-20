package com.example.whisper.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
@Table(name = "evidencias")
public class Evidencia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "denuncia_id", nullable = false)
    private Denuncia denunciaId;

    @Column(name = "url")
    private String url;

    @Column(name = "tipo")
    private String tipo;

    @Column(name = "creado_en")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date creadoEn;

    @Column(name = "estado")
    private String estado;  // ← NUEVO: VISIBLE / OCULTO
}