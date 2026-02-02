package com.example.whisper.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Table(name = "tbl_evidencias")
public class Evidencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long evidencia_id;

    @ManyToOne
    @JoinColumn(name = "id")
    private Denuncia denuncia;

    @Column(name = "archivoUrl")
    private String archivoUrl;

    @Column(name = "tipoArchivo")
    private String tipoArchivo;

    @Column(name = "fechaSubida")
    private LocalDateTime fechaSubida;

}
