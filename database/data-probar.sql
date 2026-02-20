USE Whisper;

-- 1. USUARIOS
INSERT INTO usuarios (email, password, dni, rol, estado, firebase_id) VALUES
('admin@whisper.pe', '$2a$10$7654321', '00000000', 'ADMINISTRADOR', 'ACTIVO', '1YoU34b2nsMdfnf5QqmAyA5kTeK2'),
('carlos.mendoza@gmail.com', 'user1234', '45879632', 'USUARIO', 'ACTIVO', '33LdXSj0YOhRybEwNJ7hauYQbaF2'),
('ana.luz@outlook.com', 'ana_pass', '78541236', 'USUARIO', 'ACTIVO', 'FDieSvANV3Vxf1h5n3ISB3Yu77t1'),
('sergio.paz@yahoo.com', 'sergio99', '12457896', 'USUARIO', 'ACTIVO', 'cJ8NhGMaNGXetdz5fUb90wWxBsL2'),
('lucia.fer@gmail.com', 'lucia_fe', '32145698', 'USUARIO', 'ACTIVO', 'wwBKR6scj3YOB2rCy7PwXSiJrdS2');

-- 2. ALIAS PÚBLICOS
INSERT INTO alias_publicos (usuario_id, alias) VALUES
(1, 'ModeradorGral'),
(2, 'VecinoLince'),
(3, 'AnaJusticia'),
(4, 'SergioAlerta'),
(5, 'LuciaInforma');

-- 3. CATEGORÍAS
INSERT INTO categorias (nombre, descripcion) VALUES
('Seguridad', 'Robos, asaltos y actividad sospechosa.'),
('Estafas', 'Fraudes digitales y engaños en ventas.'),
('Infraestructura', 'Baches, falta de luz y semáforos.'),
('Medio Ambiente', 'Acumulación de basura y ruidos.'),
('Servicios', 'Problemas con agua, luz o internet.');

-- 4. DENUNCIAS
INSERT INTO denuncias (usuario_id, alias_id, categoria_id, titulo, descripcion, ubicacion, estado) VALUES
(2, 2, 1, 'Asalto en paradero', 'Dos sujetos en moto arrancharon celulares.', 'Av. Arenales cdra. 15, Lince', 'VISIBLE'),
(3, 3, 2, 'Link de estafa SMS', 'Me llegó un mensaje falso del banco pidiendo clave.', 'Plaza San Martín, Cercado de Lima', 'VISIBLE'),
(4, 4, 3, 'Poste a punto de caer', 'Poste inclinado tras choque en Av. Arequipa.', 'Av. Arequipa cruce con Calle Juan de Arona, San Isidro', 'EN_EVALUACION'),
(5, 5, 4, 'Basura acumulada', 'Desmonte dejado en la vereda hace una semana.', 'Jr. Huallaga 450, Cercado de Lima', 'VISIBLE'),
(2, 2, 5, 'Corte de luz masivo', 'Toda la cuadra 5 sin fluido eléctrico.', 'Av. Javier Prado Este cdra. 25, San Borja', 'EN_EVALUACION');

-- 5. EVIDENCIAS
INSERT INTO evidencias (denuncia_id, url, tipo) VALUES
(1, 'https://cdn.whisper.pe/e1.jpg', 'IMAGEN'),
(2, 'https://cdn.whisper.pe/e2.png', 'IMAGEN'),
(3, 'https://cdn.whisper.pe/e3.mp4', 'VIDEO'),
(4, 'https://cdn.whisper.pe/e4.jpg', 'IMAGEN'),
(5, 'https://cdn.whisper.pe/e5.jpg', 'IMAGEN');

-- 6. VOTOS DE DENUNCIAS
INSERT INTO votos_denuncia (denuncia_id, usuario_id, voto) VALUES
(1, 3, 1),
(1, 4, 1),
(3, 2, 1),
(4, 3, 1),
(2, 5, -1);

-- 7. COMENTARIOS
INSERT INTO comentarios (denuncia_id, alias_id, contenido, estado) VALUES
(1, 1, 'Patrulla en camino.', 'VISIBLE'),
(3, 3, 'Tengan cuidado al pasar por ahí.', 'VISIBLE'),
(4, 1, 'Reportado a la municipalidad.', 'VISIBLE'),
(2, 4, 'A mí también me llegó ese mensaje.', 'VISIBLE'),
(5, 2, 'Ya regresó la luz por mi sector.', 'VISIBLE');

-- 8. REPORTES DE FALSEDAD
INSERT INTO reportes_falsedad (denuncia_id, usuario_id, motivo, estado) VALUES
(2, 1, 'Spam repetitivo.', 'VISIBLE'),
(5, 4, 'Información desactualizada.', 'VISIBLE'),
(1, 5, 'Ubicación incorrecta.', 'VISIBLE'),
(3, 2, 'Ya fue reparado.', 'VISIBLE'),
(4, 3, 'Es una foto antigua.', 'VISIBLE');

-- 9. EVIDENCIAS DE FALSEDAD
INSERT INTO evidencias_falsedad (reporte_id, url, tipo, estado) VALUES
(1, 'https://cdn.whisper.pe/f1.jpg', 'IMAGEN', 'VISIBLE'),
(2, 'https://cdn.whisper.pe/f2.jpg', 'IMAGEN', 'VISIBLE'),
(3, 'https://cdn.whisper.pe/f3.png', 'IMAGEN', 'VISIBLE'),
(4, 'https://cdn.whisper.pe/f4.jpg', 'IMAGEN', 'VISIBLE'),
(5, 'https://cdn.whisper.pe/f5.jpg', 'IMAGEN', 'VISIBLE');