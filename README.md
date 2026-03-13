📦 LogiTrack - Sistema de Gestión de Inventario
LogiTrack es una API REST desarrollada con Spring Boot para la gestión de bodegas, productos, movimientos de inventario y auditorías. Incluye autenticación mediante JWT.

🛠️ Tecnologías utilizadas

Java 17+
Spring Boot 
Spring Security 
JPA
MySQL
Lombok
Swagger
Maven


Base de datos
sqlDROP DATABASE logitrack;
CREATE DATABASE IF NOT EXISTS logitrack;
USE logitrack;

CREATE TABLE persona (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    edad INT NOT NULL,
    documento VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE bodegas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(150) NOT NULL,
    capacidad INT NOT NULL,
    encargado_id INT NOT NULL,
    CONSTRAINT fk_bodega_encargado
        FOREIGN KEY (encargado_id) REFERENCES persona(id)
);

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL
);

CREATE TABLE movimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL,
    tipo_movimiento ENUM('ENTRADA','SALIDA','TRANSFERENCIA') NOT NULL,
    usuario_id INT NOT NULL,
    bodega_origen_id INT,
    bodega_destino_id INT,
    CONSTRAINT fk_movimiento_usuario
        FOREIGN KEY (usuario_id) REFERENCES persona(id),
    CONSTRAINT fk_movimiento_bodega_origen
        FOREIGN KEY (bodega_origen_id) REFERENCES bodegas(id),
    CONSTRAINT fk_movimiento_bodega_destino
        FOREIGN KEY (bodega_destino_id) REFERENCES bodegas(id)
);

CREATE TABLE movimiento_detalles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movimiento_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    CONSTRAINT fk_detalle_movimiento
        FOREIGN KEY (movimiento_id) REFERENCES movimientos(id),
    CONSTRAINT fk_detalle_producto
        FOREIGN KEY (producto_id) REFERENCES productos(id),
    CONSTRAINT unique_movimiento_producto
        UNIQUE (movimiento_id, producto_id)
);

CREATE TABLE auditorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entidad VARCHAR(100) NOT NULL,
    operacion ENUM('INSERT','UPDATE','DELETE') NOT NULL,
    fecha DATETIME NOT NULL,
    usuario_id INT NOT NULL,
    valor_anterior TEXT,
    valor_nuevo TEXT,
    CONSTRAINT fk_auditoria_usuario
        FOREIGN KEY (usuario_id) REFERENCES persona(id)
);

Configuración application.properties
propertiesspring.datasource.url=jdbc:mysql://localhost:3306/logitrack
spring.datasource.username=santiago
spring.datasource.password=0809
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

server.port=8080

springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html

Estructura del proyecto
src/main/java/com/s1/logitrack/
│
├── auth/
│   ├── AuthController.java
│   ├── LoginRequest.java
│   └── LoginResponse.java
│
├── config/
│   ├── JwtFilter.java
│   ├── JwtService.java
│   ├── OpenAPIConfig.java
│   └── SecurityConfig.java
│
├── controller/
│   ├── AuditoriaController.java
│   ├── BodegaController.java
│   ├── MovimientoController.java
│   ├── MovimientoDetalleController.java
│   └── ProductoController.java
│
├── dto/
│   ├── request/
│   │   ├── AuditoriaRequestDTO.java
│   │   ├── BodegaRequestDTO.java
│   │   ├── MovimientoDetalleRequestDTO.java
│   │   ├── MovimientoRequestDTO.java
│   │   ├── PersonaRequestDTO.java
│   │   └── ProductoRequestDTO.java
│   └── response/
│       ├── AuditoriaResponseDTO.java
│       ├── BodegaResponseDTO.java
│       ├── MovimientoDetalleResponseDTO.java
│       ├── MovimientoResponseDTO.java
│       ├── PersonaResponseDTO.java
│       └── ProductoResponseDTO.java
│
├── exception/
│   ├── BusinessRuleException.java
│   ├── ErrorResponse.java
│   └── GlobalExceptionHandler.java
│
├── mapper/
│   ├── AuditoriaMapper.java
│   ├── BodegaMapper.java
│   ├── MovimientoDetalleMapper.java
│   ├── MovimientoMapper.java
│   ├── PersonaMapper.java
│   └── ProductoMapper.java
│
├── model/
│   ├── Auditorias.java
│   ├── Bodegas.java
│   ├── MovimientoDetalles.java
│   ├── Movimientos.java
│   ├── Persona.java
│   ├── Productos.java
│   ├── TipoMovimiento.java
│   └── TipoOperacion.java
│
├── repository/
│   ├── AuditoriaRepository.java
│   ├── BodegaRepository.java
│   ├── MovimientoDetalleRepository.java
│   ├── MovimientoRepository.java
│   ├── PersonaRepository.java
│   └── ProductoRepository.java
│
└── service/
    ├── AuditoriaService.java
    ├── BodegaService.java
    ├── MovimientoDetalleService.java
    ├── MovimientoService.java
    ├── PersonaService.java
    ├── ProductoService.java
    └── impl/
        ├── AuditoriaServiceImpl.java
        ├── BodegaServiceImpl.java
        ├── MovimientoDetalleServiceImpl.java
        ├── MovimientoServiceImpl.java
        ├── PersonaServiceImpl.java
        └── ProductoServiceImpl.java

Autenticación
Uso de JWT (JSON Web Token). Para acceder a los endpoints protegido

Login en POST /auth/login con email y contraseña.
Copiar el token de la respuesta.



   Authorization: Bearer <token>
El token tiene una duración de 30 minutos.
