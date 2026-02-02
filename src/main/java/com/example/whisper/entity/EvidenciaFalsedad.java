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
@Table(name = "tbl_evidencia_falsedad")
public class EvidenciaFalsedad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reporte_id", nullable = false)
    private ReporteFalsedad reporteId;

    @Column(name = "url")
    private String url;

    @Column(name = "tipo")
    private String tipo;

    @Column(name = "creado_en")
    private Date creadoEn;
}
