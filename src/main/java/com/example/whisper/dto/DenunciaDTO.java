package com.example.whisper.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import java.util.Date;

@Setter
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class DenunciaDTO {

    private Long id;
    private String titulo;
    private String descripcion;
    private String estado;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date creadaEn;
    private String ubicacion;
    private String categoriaNombre;
    private String alias;
}