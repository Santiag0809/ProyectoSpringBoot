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


- [Base de datos](DATABASE/executable.sql)

  
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
src/main/java/com/s1/logitrack/
```
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
│   ├── PersonaController.java
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
```

Autenticación
Uso de JWT (JSON Web Token). Para acceder a los endpoints protegido

Login en POST /auth/login con email y contraseña.
Copiar el token de la respuesta.



   Authorization: Bearer <token>
El token tiene una duración de 30 minutos.
