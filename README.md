# LogiTrack

LogiTrack es un sistema web de gestión de inventario desarrollado con **Spring Boot** en el backend y **HTML/CSS/JS** en el frontend. Permite administrar bodegas, productos, movimientos de entrada, salida y transferencia, personas y auditorías, todo bajo un esquema de autenticación con **JWT**.

---

## Contenido

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Requisitos previos](#requisitos-previos)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Base de datos](#base-de-datos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Endpoints disponibles](#endpoints-disponibles)
- [Frontend](#frontend)

---

## Descripción

LogiTrack permite a las empresas llevar el control de su inventario a través de:

- Registro de personas con roles (`ADMIN` o `TRABAJADOR`)
- Gestión de bodegas con encargados asignados
- Catálogo de productos con categorías y precios
- Registro de movimientos de tipo ENTRADA, SALIDA o TRANSFERENCIA
- Detalles de cada movimiento con productos y cantidades
- Auditorías para trazabilidad de operaciones

---

## Tecnologías

- Java 17
- Spring Boot 3.x
- Spring Security + JWT
- Spring Data JPA
- MySQL 8
- Lombok
- Swagger / OpenAPI 3
- Maven
- HTML / CSS / JavaScript

---

## Requisitos previos

- Java 17 o superior instalado
- MySQL 8 instalado y corriendo
- Maven instalado
- Live Server (extensión de VS Code) para el frontend
- Postman (opcional, para probar la API)

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/LogitrackSA.git
cd LogitrackSA
```

### 2. Configurar la base de datos

Abre MySQL Workbench o tu cliente preferido y ejecuta el script ubicado en:

```
DATABASE/executable.sql
```

Esto creará la base de datos `logitrack` con todas las tablas y relaciones.

### 3. Configurar application.properties

Abre `src/main/resources/application.properties` y ajusta tu contraseña de MySQL:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/logitrack
spring.datasource.username=root
spring.datasource.password=TU_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

server.port=8080
```

### 4. Ejecutar el backend

Desde IntelliJ IDEA dale clic en **Run** sobre la clase `LogitrackSAApplication.java`, o desde terminal:

```bash
mvn spring-boot:run
```

El servidor arrancará en `http://localhost:8080`.

### 5. Crear el primer usuario ADMIN

Con el backend corriendo, inserta un usuario administrador directamente en MySQL:

```sql
INSERT INTO persona (nombre, apellido, edad, documento, email, password, rol)
VALUES ('Admin', 'LogiTrack', 25, '1000000001', 'admin@logitrack.com', '123456', 'ADMIN');
```

### 6. Ejecutar el frontend

Abre la carpeta `frontend/` en VS Code, clic derecho sobre `index.html` y selecciona **Open with Live Server**.

El frontend estará disponible en `http://127.0.0.1:5500`.

---

## Base de datos

```text
logitrack/
├── persona              Usuarios del sistema (ADMIN / TRABAJADOR)
├── bodegas              Almacenes con encargado asignado
├── productos            Catalogo de productos
├── movimientos          ENTRADA / SALIDA / TRANSFERENCIA
├── movimiento_detalles  Productos y cantidades por movimiento
└── auditorias           Trazabilidad de operaciones
```

El script completo se encuentra en `DATABASE/executable.sql`.

---

## Estructura del proyecto

```text
LogitrackSA/
├── DATABASE/
│   └── executable.sql
├── frontend/
│   ├── css/
│   │   ├── estilos.css
│   │   ├── index.css
│   │   ├── login.css
│   │   ├── welcome.css
│   │   └── dashboard.css
│   ├── scripts/
│   │   ├── login.js
│   │   ├── welcome.js
│   │   └── dashboard.js
│   ├── src/
│   │   ├── LogiTrack.png
│   │   └── imagenPFP.png
│   ├── index.html
│   ├── login.html
│   ├── welcome.html
│   └── dashboard.html
└── src/main/java/com/s1/Logitrack/
    ├── auth/
    │   ├── AuthController.java
    │   ├── LoginRequest.java
    │   └── LoginResponse.java
    ├── config/
    │   ├── JwtFilter.java
    │   ├── JwtService.java
    │   ├── OpenAPIConfig.java
    │   └── SecurityConfig.java
    ├── controller/
    │   ├── AuditoriaController.java
    │   ├── BodegaController.java
    │   ├── MovimientoController.java
    │   ├── MovimientoDetalleController.java
    │   ├── PersonaController.java
    │   └── ProductoController.java
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
    ├── exception/
    │   ├── BusinessRuleException.java
    │   ├── ErrorResponse.java
    │   └── GlobalExceptionHandler.java
    ├── mapper/
    │   ├── AuditoriaMapper.java
    │   ├── BodegaMapper.java
    │   ├── MovimientoDetalleMapper.java
    │   ├── MovimientoMapper.java
    │   ├── PersonaMapper.java
    │   └── ProductoMapper.java
    ├── model/
    │   ├── Auditorias.java
    │   ├── Bodegas.java
    │   ├── MovimientoDetalles.java
    │   ├── Movimientos.java
    │   ├── Persona.java
    │   ├── Productos.java
    │   ├── TipoMovimiento.java
    │   └── TipoOperacion.java
    ├── repository/
    │   ├── AuditoriaRepository.java
    │   ├── BodegaRepository.java
    │   ├── MovimientoDetalleRepository.java
    │   ├── MovimientoRepository.java
    │   ├── PersonaRepository.java
    │   └── ProductoRepository.java
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

---

## Endpoints disponibles

### Auth
| Método | Endpoint | Auth |
|--------|----------|------|
| POST | `/auth/login` | No |

### Persona
| Método | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/persona` | Si |
| PUT | `/api/persona/{id}` | Si |
| GET | `/api/persona` | Si |
| GET | `/api/persona/{id}` | Si |
| GET | `/api/persona/edad?edad=X` | Si |
| DELETE | `/api/persona/{id}` | Si |

### Productos
| Método | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/producto` | Si |
| PUT | `/api/producto/{id}` | Si |
| GET | `/api/producto` | Si |
| GET | `/api/producto/{id}` | Si |
| GET | `/api/producto/categoria?categoria=X` | Si |
| DELETE | `/api/producto/{id}` | Si |

### Bodegas
| Método | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/bodega` | Si |
| PUT | `/api/bodega/{id}` | Si |
| GET | `/api/bodega` | Si |
| GET | `/api/bodega/{id}` | Si |
| GET | `/api/bodega/nombre?nombre=X` | Si |
| GET | `/api/bodega/encargado/{id}` | Si |
| DELETE | `/api/bodega/{id}` | Si |

### Movimientos
| Método | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/movimiento` | Si |
| PUT | `/api/movimiento/{id}` | Si |
| GET | `/api/movimiento` | Si |
| GET | `/api/movimiento/{id}` | Si |
| GET | `/api/movimiento/tipo?tipo=X` | Si |
| GET | `/api/movimiento/usuario/{id}` | Si |
| DELETE | `/api/movimiento/{id}` | Si |

### Movimiento Detalles
| Método | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/movimiento-detalle` | Si |
| PUT | `/api/movimiento-detalle/{id}` | Si |
| GET | `/api/movimiento-detalle` | Si |
| GET | `/api/movimiento-detalle/{id}` | Si |
| GET | `/api/movimiento-detalle/movimiento/{id}` | Si |
| GET | `/api/movimiento-detalle/producto/{id}` | Si |
| DELETE | `/api/movimiento-detalle/{id}` | Si |

### Auditorias
| Método | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/auditoria` | Si |
| GET | `/api/auditoria` | Si |
| GET | `/api/auditoria/{id}` | Si |
| GET | `/api/auditoria/entidad?entidad=X` | Si |
| GET | `/api/auditoria/operacion?operacion=X` | Si |
| GET | `/api/auditoria/usuario/{id}` | Si |
| DELETE | `/api/auditoria/{id}` | Si |

---

## Frontend

El frontend consta de 4 paginas:

- **index.html** — Splash screen con animacion y barra de progreso
- **login.html** — Formulario de autenticacion con email y contrasena
- **welcome.html** — Pantalla de bienvenida con nombre y rol del usuario
- **dashboard.html** — Panel principal con todas las entidades y sus operaciones CRUD

---

## Autor

Santiago Uribe Duarte — CampusLands 2026.
