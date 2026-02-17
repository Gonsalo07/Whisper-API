-- =========================================
-- INSERTS
-- =========================================

-- 1. USUARIOS
INSERT INTO usuarios (email, password, rol, estado) VALUES
('sofia@whisper.com',   '$2b$12$abc', 'USUARIO',        'ACTIVO'),
('diego@whisper.com',   '$2b$12$abc', 'USUARIO',        'ACTIVO'),
('laura@whisper.com',   '$2b$12$abc', 'USUARIO',        'ACTIVO'),
('carlos@whisper.com',  '$2b$12$abc', 'USUARIO',        'ACTIVO'),
('ana@whisper.com',     '$2b$12$abc', 'USUARIO',        'INACTIVO'),
('admin@whisper.com',   '$2b$12$abc', 'ADMINISTRADOR',  'ACTIVO');

-- 2. ALIAS PÚBLICOS
INSERT INTO alias_publicos (usuario_id, alias, creado_en) VALUES
(1, 'SombraLegal',      '2024-11-05 09:00:00'),
(2, 'VozCiudadana',     '2024-12-10 10:00:00'),
(3, 'AnonimoDigital',   '2025-01-14 11:00:00'),
(4, 'AlertaUrbana',     '2025-02-16 12:00:00'),
(5, 'DefensorPublico',  '2025-03-18 13:00:00'),
(6, 'VisionAdmin',      '2025-04-20 14:00:00');

-- 3. CATEGORÍAS
INSERT INTO categorias (nombre, descripcion) VALUES
('Corrupcion',           'Casos relacionados con mal uso de recursos públicos'),
('Abuso de poder',       'Uso indebido de autoridad'),
('Transparencia',        'Falta de información pública'),
('Contratacion',         'Irregularidades en contratos'),
('Conflicto de interes', 'Relaciones que afectan imparcialidad');

-- 4. DENUNCIAS (distribuidas en los últimos 6 meses)
INSERT INTO denuncias (usuario_id, alias_id, categoria_id, descripcion, titulo,estado, creada_en) VALUES
(1, 1, 1, 'Sobrecostos detectados en contratos municipales durante el ultimo trimestre.','ADMINISTRACIÓN MONETARIA', 'EN_EVALUACION', '2024-11-15 10:00:00'),
(2, 2, 4, 'Posibles irregularidades en proceso de licitacion publica regional.','CORRUPCION REGIONAL',           'EN_EVALUACION', '2024-12-18 11:00:00'),
(3, 3, 3, 'No se publicaron documentos completos en el portal oficial de transparencia.','DOCUMENTOS MANCHADOS',  'CONSISTENTE',   '2025-01-20 12:00:00'),
(4, 4, 2, 'Funcionario ejerce presion indebida sobre subordinados en area de logistica.','DEPOTISMO',  'EN_EVALUACION', '2025-02-22 13:00:00'),
(5, 5, 5, 'Existe relacion familiar directa en adjudicacion de contrato por S/. 500,000.','FAMILIAS EN CONFLICTO','CUESTIONADA',   '2025-03-25 14:00:00'),
(1, 1, 1, 'Nueva evidencia de desvio presupuestal en el area administrativa central.','ROBO DE DINERO',     'EN_EVALUACION', '2025-04-28 15:00:00'),
(2, 2, 2, 'Directivo utiliza vehiculo institucional para fines personales.','CORRUCPCIÓN AL VOLANTE',               'EN_EVALUACION', '2025-05-10 09:00:00'),
(3, 3, 4, 'Contrato adjudicado sin proceso de licitacion reglamentario.','REGLAMENTO IMPUESTO',                  'CONSISTENTE',   '2025-06-15 10:00:00');

-- 5. EVIDENCIAS
INSERT INTO evidencias (denuncia_id, url, tipo, creada_en) VALUES
(1, 'https://archivo.com/doc1.pdf',    'PDF',    '2024-11-16 11:00:00'),
(2, 'https://archivo.com/foto1.jpg',   'IMAGEN', '2024-12-19 12:00:00'),
(3, 'https://archivo.com/doc2.pdf',    'PDF',    '2025-01-21 13:00:00'),
(4, 'https://archivo.com/audio1.mp3',  'AUDIO',  '2025-02-23 14:00:00'),
(5, 'https://archivo.com/doc3.pdf',    'PDF',    '2025-03-26 15:00:00'),
(6, 'https://archivo.com/video1.mp4',  'VIDEO',  '2025-04-29 16:00:00'),
(7, 'https://archivo.com/foto2.jpg',   'IMAGEN', '2025-05-11 10:00:00'),
(8, 'https://archivo.com/doc4.pdf',    'PDF',    '2025-06-16 11:00:00');

-- 6. VOTOS
INSERT INTO votos_denuncia (denuncia_id, usuario_id, voto, creado_en) VALUES
(1, 2,  1, '2024-11-17 09:00:00'),
(1, 3,  1, '2024-11-17 10:00:00'),
(2, 1,  0, '2024-12-20 11:00:00'),
(3, 4, -1, '2025-01-22 12:00:00'),
(4, 5,  1, '2025-02-24 13:00:00'),
(5, 6, -1, '2025-03-27 14:00:00'),
(6, 2,  1, '2025-04-30 15:00:00'),
(7, 3,  1, '2025-05-12 09:00:00'),
(8, 4,  0, '2025-06-17 10:00:00');

-- 7. COMENTARIOS (con estado VISIBLE)
INSERT INTO comentarios (denuncia_id, alias_id, contenido, estado, creado_en) VALUES
(1, 2, 'Esto necesita investigacion urgente, hay mas testigos.',     'VISIBLE', '2024-11-18 09:00:00'),
(2, 3, 'Existen mas pruebas disponibles que no se han presentado.',  'VISIBLE', '2024-12-21 10:00:00'),
(3, 4, 'Falta total de transparencia en todo el proceso.',           'VISIBLE', '2025-01-23 11:00:00'),
(4, 5, 'Situacion muy preocupante para la institucion.',             'VISIBLE', '2025-02-25 12:00:00'),
(5, 1, 'Se debe auditar inmediatamente este contrato.',              'VISIBLE', '2025-03-28 13:00:00'),
(6, 2, 'Caso similar ya ocurrio en el 2023, sin consecuencias.',     'VISIBLE', '2025-04-30 14:00:00'),
(7, 3, 'Tengo fotos del vehiculo en lugares no institucionales.',    'VISIBLE', '2025-05-13 09:00:00'),
(8, 4, 'El contrato fue publicado despues de la adjudicacion.',      'VISIBLE', '2025-06-18 10:00:00');

-- 8. REPORTES DE FALSEDAD (con estado VISIBLE)
INSERT INTO reportes_falsedad (denuncia_id, usuario_id, motivo, estado, creado_en) VALUES
(3, 2, 'La informacion presentada parece incompleta y sin respaldo.', 'VISIBLE', '2025-01-25 10:00:00'),
(5, 3, 'Existen datos que contradicen directamente esta denuncia.',   'VISIBLE', '2025-03-30 11:00:00'),
(7, 4, 'El supuesto testigo no puede ser verificado.',                'VISIBLE', '2025-05-15 12:00:00');

-- 9. EVIDENCIAS DE FALSEDAD (con estado VISIBLE)
INSERT INTO evidencias_falsedad (reporte_id, url, tipo, estado, creada_en) VALUES
(1, 'https://archivo.com/prueba_falsedad1.pdf', 'PDF',    'VISIBLE', '2025-01-26 12:00:00'),
(2, 'https://archivo.com/prueba_falsedad2.jpg', 'IMAGEN', 'VISIBLE', '2025-03-31 13:00:00'),
(3, 'https://archivo.com/prueba_falsedad3.pdf', 'PDF',    'VISIBLE', '2025-05-16 14:00:00');

-- =========================================
-- FIN DEL SCRIPT
-- =========================================