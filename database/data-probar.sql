-- =========================================
-- SCRIPT DE INSERCIÓN DE DATOS (WHISPER)
-- =========================================

USE Whisper;

-- 1. USUARIOS
INSERT INTO usuarios (email, password_hash, estado) VALUES
('juan.perez@email.com', '$2b$12$eImiTXuWVpY0K.9vshSDF', 'ACTIVO'),
('maria.garcia@email.com', '$2b$12$v98vshSDFkLp02nSlpY1X', 'ACTIVO'),
('admin@whisper.com', '$2b$12$Z0mP4ks92MnBvCxZasQ1W', 'ACTIVO'),
('carlos.ruiz@email.com', '$2b$12$Lks02nSlpQwErTyUiO54Z', 'ACTIVO'),
('ana.lopez@email.com', '$2b$12$MnBvCxZas88XcVbNmK99L', 'ACTIVO'),
('luis.torres@email.com', '$2b$12$QwErTyUiOpAAsDfGhjKl2', 'INACTIVO');

-- 2. ALIAS PÚBLICOS
INSERT INTO alias_publicos (usuario_id, alias) VALUES
(1, 'Justiciero01'),
(2, 'EcoVoz'),
(3, 'Observador_X'),
(4, 'Anonimo_99'),
(5, 'LuzDeVerdad'),
(6, 'CiudadanoK');

-- 3. CATEGORÍAS
INSERT INTO categorias (nombre, descripcion) VALUES
('Corrupción', 'Uso indebido de funciones públicas o recursos.'),
('Medio Ambiente', 'Contaminación, tala ilegal o maltrato animal.'),
('Fraude', 'Estafas comerciales o engaños financieros.'),
('Acoso', 'Conductas de hostigamiento en espacios públicos o digitales.'),
('Seguridad Vial', 'Infracciones graves de tránsito o peligro en vías.'),
('Servicios Públicos', 'Fallas constantes o mala atención en servicios básicos.');

-- 4. DENUNCIAS
INSERT INTO denuncias (usuario_id, alias_id, categoria_id, descripcion, estado) VALUES
(1, 1, 1, 'Soborno detectado en la oficina de licencias del centro.', 'EN_EVALUACION'),
(2, 2, 2, 'Vertido de químicos ilegales en el río local por la fábrica textil.', 'ACTIVA'),
(4, 4, 3, 'App de préstamos "DineroFácil" está robando datos de contactos.', 'EN_EVALUACION'),
(5, 5, 4, 'Acoso sistemático reportado en la estación de bus central.', 'INVESTIGANDO'),
(6, 6, 5, 'Semáforo dañado provoca accidentes en Av. Principal con Calle 10.', 'SOLUCIONADO'),
(1, 1, 6, 'Corte de agua sin previo aviso por más de 48 horas en Barrio Norte.', 'ACTIVA');

-- 5. EVIDENCIAS
INSERT INTO evidencias (denuncia_id, url, tipo) VALUES
(1, 'https://storage.whisper.com/ev/video_soborno.mp4', 'VIDEO'),
(2, 'https://storage.whisper.com/ev/foto_rio_contaminado.jpg', 'IMAGEN'),
(3, 'https://storage.whisper.com/ev/screenshot_app.png', 'IMAGEN'),
(4, 'https://storage.whisper.com/ev/audio_testimonio.mp3', 'AUDIO'),
(5, 'https://storage.whisper.com/ev/foto_semaforo.jpg', 'IMAGEN'),
(6, 'https://storage.whisper.com/ev/recibo_pago.pdf', 'DOCUMENTO');

-- 6. VOTOS DE DENUNCIAS (1=CONSISTENTE, 0=EN_EVALUACION, -1=CUESTIONADA)
INSERT INTO votos_denuncia (denuncia_id, usuario_id, voto) VALUES
(1, 2, 1),
(1, 3, 1),
(2, 1, 1),
(3, 5, -1),
(4, 6, 0),
(2, 4, 1);

-- 7. COMENTARIOS
INSERT INTO comentarios (denuncia_id, alias_id, contenido) VALUES
(1, 3, 'Yo también vi movimientos extraños en esa oficina.'),
(2, 5, 'Es increíble que sigan haciendo esto en pleno 2024.'),
(3, 1, 'Cuidado, esa app ya tiene varios reportes en otros foros.'),
(5, 2, 'Ya lo repararon esta mañana, pasé por ahí.'),
(6, 4, 'En mi sector tampoco hay agua, es general.'),
(1, 6, '¿Tienes más pruebas de quién recibió el dinero?');

-- 8. REPORTES DE FALSEDAD
INSERT INTO reportes_falsedad (denuncia_id, usuario_id, motivo) VALUES
(3, 2, 'La aplicación mencionada no existe en la Play Store con ese nombre.'),
(1, 4, 'La oficina de licencias está cerrada por remodelación esta semana.'),
(6, 3, 'El corte de agua fue anunciado por la radio local ayer.'),
(2, 6, 'La foto del río parece ser de otra ciudad.'),
(4, 1, 'El video adjunto no corresponde a la ubicación descrita.'),
(5, 5, 'Información desactualizada, el problema ya fue resuelto.');

-- 9. EVIDENCIA DE REPORTES
INSERT INTO evidencias_falsedad (reporte_id, url, tipo) VALUES
(1, 'https://storage.whisper.com/reports/search_result.png', 'IMAGEN'),
(2, 'https://storage.whisper.com/reports/foto_oficina_cerrada.jpg', 'IMAGEN'),
(3, 'https://storage.whisper.com/reports/comunicado_radio.pdf', 'DOCUMENTO'),
(4, 'https://storage.whisper.com/reports/reverse_search.png', 'IMAGEN'),
(5, 'https://storage.whisper.com/reports/gps_metadata.txt', 'TEXTO'),
(6, 'https://storage.whisper.com/reports/foto_actualizada.jpg', 'IMAGEN');

-- =========================================
-- FIN DEL SCRIPT DE DATOS
-- =========================================