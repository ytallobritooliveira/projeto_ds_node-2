-- dois traços faz comentarios


--
CREATE DATABASE projeto_backend_angela;
--
use projeto_backend_angela;
--
create table usuarios(
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    login VARCHAR(50) NOT NULL,
    senha VARCHAR(10) NOT NULL 
);
--
INSERT INTO usuarios VALUES (null, 'Ytalão Master', 'ytallao.com.gameplays','aura67');
INSERT INTO usuarios VALUES (null, 'Nycoludos', 'nycolasOsenhorDaaura', 'AuraBoy');
INSERT INTO usuarios VALUES (null, 'Bolinha de QUEIJO', 'bolotaPORNO@primbolin.com', 'rasgatobin');
--
SELECT * 
FROM usuarios;