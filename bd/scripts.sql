-- dois traços faz comentarios


--
CREATE DATABASE projeto_backend_angela;
--
use projeto_backend_angela;
--
create table usuarios(
    id_usuario INT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(10),
    cep VARCHAR(9),
    endereco VARCHAR(150),
    numero VARCHAR(10),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    login VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL 
);
--
INSERT INTO usuarios VALUES (null, 'Ytalão Master', 'ytallao.com.gameplays','aura67');
INSERT INTO usuarios VALUES (null, 'Nycoludos', 'nycolasOsenhorDaaura', 'AuraBoy');
INSERT INTO usuarios VALUES (null, 'Bolinha de QUEIJO', 'bolotaPORNO@primbolin.com', 'rasgatobin');
--
SELECT * 
FROM usuarios;