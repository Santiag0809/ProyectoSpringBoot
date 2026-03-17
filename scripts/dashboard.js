const BASE_URL = 'http://localhost:8080';
const token    = localStorage.getItem('token');

if (!token) window.location.href = 'login.html';

let entidadActual = null;

function seleccionarEntidad(entidad, el) {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('activo'));
    el.classList.add('activo');

    document.querySelectorAll('.subnav').forEach(s => s.classList.remove('visible'));
    document.querySelectorAll('[id^="vista-"]').forEach(v => v.style.display = 'none');

    document.getElementById(`subnav-${entidad}`).classList.add('visible');
    document.getElementById(`vista-${entidad}`).style.display = 'block';
    document.getElementById('vista-inicio').style.display = 'none';

    entidadActual = entidad;
    document.querySelectorAll('.accion').forEach(a => a.classList.remove('activo'));
    ocultarSubvistas(entidad);
}

function seleccionarAccion(entidad, accion, el) {
    document.querySelectorAll(`#subnav-${entidad} .accion`).forEach(a => a.classList.remove('activo'));
    el.classList.add('activo');
    ocultarSubvistas(entidad);
    const subvista = document.getElementById(`${entidad}-${accion}`);
    if (subvista) subvista.style.display = 'block';
}

function ocultarSubvistas(entidad) {
    const vista = document.getElementById(`vista-${entidad}`);
    if (vista) vista.querySelectorAll(':scope > div').forEach(d => d.style.display = 'none');
}

function headers() {
    return {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`
    };
}

function mostrarFila(datos, clase, campos) {
    if (!Array.isArray(datos) || datos.length === 0) return '<p class="vacio">No hay datos para mostrar.</p>';
    return datos.map(item => {
        const celdas = campos.map(c => {
            const valor = c.split('.').reduce((o, k) => o?.[k], item);
            return `<p>${valor ?? '—'}</p>`;
        }).join('');
        return `<div class="fila ${clase}">${celdas}</div>`;
    }).join('');
}

function mostrarError(contenedor, mensaje) {
    document.getElementById(contenedor).innerHTML = `<p class="vacio" style="color:#ef4444">${mensaje}</p>`;
}

// ── PERSONAS ─────────────────────────────────────────────────

async function listarPersonas() {
    try {
        const res = await fetch(`${BASE_URL}/api/persona/public`, { headers: headers() });
        if (!res.ok) throw new Error(res.status);
        const datos = await res.json();
        document.getElementById('tabla-persona').innerHTML =
            mostrarFila(datos, 'cols-persona', ['id','documento','nombre','apellido','edad','email']);
    } catch (e) {
        mostrarError('tabla-persona', `Error al cargar personas. (${e.message})`);
    }
}

async function buscarPersonaPorId() {
    const id = document.getElementById('p-get-id').value.trim();
    if (!id) return;
    try {
        const res = await fetch(`${BASE_URL}/api/persona/${id}`, { headers: headers() });
        if (!res.ok) throw new Error(res.status);
        const dato = await res.json();
        document.getElementById('tabla-persona-id').innerHTML =
            mostrarFila([dato], 'cols-persona', ['id','documento','nombre','apellido','edad','email']);
    } catch (e) {
        mostrarError('tabla-persona-id', `No se encontró la persona. (${e.message})`);
    }
}

async function buscarPersonaPorEdad() {
    const edad = document.getElementById('p-get-edad').value.trim();
    if (!edad) return;
    try {
        const res = await fetch(`${BASE_URL}/api/persona/edad?edad=${edad}`, { headers: headers() });
        if (!res.ok) throw new Error(res.status);
        const datos = await res.json();
        document.getElementById('tabla-persona-edad').innerHTML =
            mostrarFila(datos, 'cols-persona', ['id','documento','nombre','apellido','edad','email']);
    } catch (e) {
        mostrarError('tabla-persona-edad', `Error al buscar personas. (${e.message})`);
    }
}

async function crearPersona() {
    const body = {
        nombre:    document.getElementById('p-nombre').value,
        apellido:  document.getElementById('p-apellido').value,
        edad:      parseInt(document.getElementById('p-edad').value),
        documento: document.getElementById('p-documento').value,
        email:     document.getElementById('p-email').value,
        password:  document.getElementById('p-password').value,
        rol:       document.getElementById('p-rol').value
    };
    try {
        const res = await fetch(`${BASE_URL}/api/persona`, {
            method: 'POST', headers: headers(), body: JSON.stringify(body)
        });
        if (!res.ok) {
            const err = await res.json();
            alert(`Error: ${JSON.stringify(err)}`);
            return;
        }
        alert('Persona creada exitosamente.');
    } catch (e) {
        alert(`Error al crear la persona. (${e.message})`);
    }
}

async function actualizarPersona() {
    const id = document.getElementById('p-upd-id').value;
    const body = {
        nombre:    document.getElementById('p-upd-nombre').value,
        apellido:  document.getElementById('p-upd-apellido').value,
        edad:      parseInt(document.getElementById('p-upd-edad').value),
        documento: document.getElementById('p-upd-documento').value,
        email:     document.getElementById('p-upd-email').value,
        password:  document.getElementById('p-upd-password').value,
        rol:       document.getElementById('p-upd-rol').value
    };
    try {
        const res = await fetch(`${BASE_URL}/api/persona/${id}`, {
            method: 'PUT', headers: headers(), body: JSON.stringify(body)
        });
        if (!res.ok) {
            const err = await res.json();
            alert(`Error: ${JSON.stringify(err)}`);
            return;
        }
        alert('Persona actualizada exitosamente.');
    } catch (e) {
        alert(`Error al actualizar la persona. (${e.message})`);
    }
}

async function eliminarPersona() {
    const id = document.getElementById('p-del-id').value;
    if (!id) { alert('Ingresa un ID.'); return; }
    if (!confirm(`¿Eliminar la persona con ID ${id}?`)) return;
    try {
        const res = await fetch(`${BASE_URL}/api/persona/${id}`, {
            method: 'DELETE', headers: headers()
        });
        if (!res.ok) throw new Error(res.status);
        alert('Persona eliminada exitosamente.');
    } catch (e) {
        alert(`Error al eliminar la persona. (${e.message})`);
    }
}

// ── PRODUCTOS ────────────────────────────────────────────────

async function listarProductos() {
    try {
        const res = await fetch(`${BASE_URL}/api/producto`, { headers: headers() });
        if (!res.ok) throw new Error(res.status);
        const datos = await res.json();
        document.getElementById('tabla-producto').innerHTML =
            mostrarFila(datos, 'cols-producto', ['id','nombre','categoria','precio']);
    } catch (e) {
        mostrarError('tabla-producto', `Error al cargar productos. (${e.message})`);
    }
}

async function buscarProductoPorId() {
    const id = document.getElementById('prod-get-id').value.trim();
    if (!id) return;
    try {
        const res = await fetch(`${BASE_URL}/api/producto/${id}`, { headers: headers() });
        if (!res.ok) throw new Error(res.status);
        const dato = await res.json();
        document.getElementById('tabla-producto-id').innerHTML =
            mostrarFila([dato], 'cols-producto', ['id','nombre','categoria','precio']);
    } catch (e) {
        mostrarError('tabla-producto-id', `No se encontró el producto. (${e.message})`);
    }
}

async function buscarProductoPorCategoria() {
    const cat = document.getElementById('prod-get-categoria').value.trim();
    if (!cat) return;
    try {
        const res = await fetch(`${BASE_URL}/api/producto/categoria?categoria=${cat}`, { headers: headers() });
        if (!res.ok) throw new Error(res.status);
        const datos = await res.json();
        document.getElementById('tabla-producto-categoria').innerHTML =
            mostrarFila(datos, 'cols-producto', ['id','nombre','categoria','precio']);
    } catch (e) {
        mostrarError('tabla-producto-categoria', `Error al buscar productos. (${e.message})`);
    }
}

async function crearProducto() {
    const body = {
        nombre:    document.getElementById('prod-nombre').value,
        categoria: document.getElementById('prod-categoria').value,
        precio:    parseFloat(document.getElementById('prod-precio').value)
    };
    try {
        const res = await fetch(`${BASE_URL}/api/producto`, {
            method: 'POST', headers: headers(), body: JSON.stringify(body)
        });
        if (!res.ok) {
            const err = await res.json();
            alert(`Error: ${JSON.stringify(err)}`);
            return;
        }
        alert('Producto creado exitosamente.');
    } catch (e) {
        alert(`Error al crear el producto. (${e.message})`);
    }
}

async function actualizarProducto() {
    const id = document.getElementById('prod-upd-id').value;
    const body = {
        nombre:    document.getElementById('prod-upd-nombre').value,
        categoria: document.getElementById('prod-upd-categoria').value,
        precio:    parseFloat(document.getElementById('prod-upd-precio').value)
    };
    try {
        const res = await fetch(`${BASE_URL}/api/producto/${id}`, {
            method: 'PUT', headers: headers(), body: JSON.stringify(body)
        });
        if (!res.ok) {
            const err = await res.json();
            alert(`Error: ${JSON.stringify(err)}`);
            return;
        }
        alert('Producto actualizado exitosamente.');
    } catch (e) {
        alert(`Error al actualizar el producto. (${e.message})`);
    }
}

async function eliminarProducto() {
    const id = document.getElementById('prod-del-id').value;
    if (!id) { alert('Ingresa un ID.'); return; }
    if (!confirm(`¿Eliminar el producto con ID ${id}?`)) return;
    try {
        const res = await fetch(`${BASE_URL}/api/producto/${id}`, {
            method: 'DELETE', headers: headers()
        });
        if (!res.ok) throw new Error(res.status);
        alert('Producto eliminado exitosamente.');
    } catch (e) {
        alert(`Error al eliminar el producto. (${e.message})`);
    }
}

// ── BODEGAS ──────────────────────────────────────────────────

async function listarBodegas() {
    try {
        const res = await fetch(`${BASE_URL}/api/bodega`, { headers: headers() });
        if (!res.ok) throw new Error(res.status);
        const datos = await res.json();
        document.getElementById('tabla-bodega').innerHTML =
            mostrarFila(datos, 'cols-bodega', ['id','nombre','ubicacion','capacidad','encargado.nombre']);
    } catch (e) {
        mostrarError('tabla-bodega', `Error al cargar bodegas. (${e.message})`);
    }
}

async function buscarBodegaPorId() {
    const id = document.getElementById('bod-get-id').value.trim();
    if (!id) return;
    try {
        const res = await fetch(`${BASE_URL}/api/bodega/${id}`, { headers: headers() });
        if (!res.ok) throw new Error(res.status);
        const dato = await res.json();
        document.getElementById('tabla-bodega-id').innerHTML =
            mostrarFila([dato], 'cols-bodega', ['id','nombre','ubicacion','capacidad','encargado.nombre']);
    } catch (e) {
        mostrarError('tabla-bodega-id', `No se encontró la bodega. (${e.message})`);
    }
}

async function buscarBodegaPorNombre() {
    const nombre = document.getElementById('bod-get-nombre').value.trim();
    if (!nombre) return;
    try {
        const res = await fetch(`${BASE_URL}/api/bodega/nombre?nombre=${nombre}`, { headers: headers() });
        if (!res.ok) throw new Error(res.status);
        const datos = await res.json();
        document.getElementById('tabla-bodega-nombre').innerHTML =
            mostrarFila(datos, 'cols-bodega', ['id','nombre','ubicacion','capacidad','encargado.nombre']);
    } catch (e) {
        mostrarError('tabla-bodega-nombre', `Error al buscar bodegas. (${e.message})`);
    }
}

async function buscarBodegaPorEncargado() {
    const id = document.getElementById('bod-get-encargado').value.trim();
    if (!id) return;
    try {
        const res = await fetch(`${BASE_URL}/api/bodega/encargado/${id}`, { headers: headers() });
        if (!res.ok) throw new Error(res.status);
        const datos = await res.json();
        document.getElementById('tabla-bodega-encargado').innerHTML =
            mostrarFila(datos, 'cols-bodega', ['id','nombre','ubicacion','capacidad','encargado.nombre']);
    } catch (e) {
        mostrarError('tabla-bodega-encargado', `Error al buscar bodegas. (${e.message})`);
    }
}

async function crearBodega() {
    const body = {
        nombre:      document.getElementById('bod-nombre').value,
        ubicacion:   document.getElementById('bod-ubicacion').value,
        capacidad:   parseInt(document.getElementById('bod-capacidad').value),
        encargadoId: parseInt(document.getElementById('bod-encargado').value)
    };
    try {
        const res = await fetch(`${BASE_URL}/api/bodega`, {
            method: 'POST', headers: headers(), body: JSON.stringify(body)
        });
        if (!res.ok) {
            const err = await res.json();
            alert(`Error: ${JSON.stringify(err)}`);
            return;
        }
        alert('Bodega creada exitosamente.');
    } catch (e) {
        alert(`Error al crear la bodega. (${e.message})`);
    }
}

async function actualizarBodega() {
    const id = document.getElementById('bod-upd-id').value;
    const body = {
        nombre:      document.getElementById('bod-upd-nombre').value,
        ubicacion:   document.getElementById('bod-upd-ubicacion').value,
        capacidad:   parseInt(document.getElementById('bod-upd-capacidad').value),
        encargadoId: parseInt(document.getElementById('bod-upd-encargado').value)
    };
    try {
        const res = await fetch(`${BASE_URL}/api/bodega/${id}`, {
            method: 'PUT', headers: headers(), body: JSON.stringify(body)
        });
        if (!res.ok) {
            const err = await res.json();
            alert(`Error: ${JSON.stringify(err)}`);
            return;
        }
        alert('Bodega actualizada exitosamente.');
    } catch (e) {
        alert(`Error al actualizar la bodega. (${e.message})`);
    }
}

async function eliminarBodega() {
    const id = document.getElementById('bod-del-id').value;
    if (!id) { alert('Ingresa un ID.'); return; }
    if (!confirm(`¿Eliminar la bodega con ID ${id}?`)) return;
    try {
        const res = await fetch(`${BASE_URL}/api/bodega/${id}`, {
            method: 'DELETE', headers: headers()
        });
        if (!res.ok) throw new Error(res.status);
        alert('Bodega eliminada exitosamente.');
    } catch (e) {
        alert(`Error al eliminar la bodega. (${e.message})`);
    }
}

// ── MOVIMIENTOS ──────────────────────────────────────────────

async function listarMovimientos() {
    try {
        const res = await fetch(`${BASE_URL}/api/movimiento`, { headers: headers() });
        if (!res.ok) throw new Error(res.status);
        const datos = await res.json();
        document.getElementById('tabla-movimiento').innerHTML =
            mostrarFila(datos, 'cols-movimiento', ['id','fecha','tipoMovimiento','usuario.nombre','bodegaOrigen.nombre']);
    } catch (e) {
        mostrarError('tabla-movimiento', `Error al cargar movimientos. (${e.message})`);
    }
}

async function buscarMovimientoPorId() {
    const id = document.getElementById('mov-get-id').value.trim();
    if (!id) return;
    try {
        const res = await fetch(`${BASE_URL}/api/movimiento/${id}`, { headers: headers() });
        if (!res.ok) throw new Error(res.status);
        const dato = await res.json();
        document.getElementById('tabla-movimiento-id').innerHTML =
            mostrarFila([dato], 'cols-movimiento', ['id','fecha','tipoMovimiento','usuario.nombre','bodegaOrigen.nombre']);
    } catch (e) {
        mostrarError('tabla-movimiento-id', `No se encontró el movimiento. (${e.message})`);
    }
}

async function buscarMovimientoPorTipo() {
    const tipo = document.getElementById('mov-get-tipo').value;
    if (!tipo) return;
    try {
        const res = await fetch(`${BASE_URL}/api/movimiento/tipo?tipo=${tipo}`, { headers: headers() });
        if (!res.ok) throw new Error(res.status);
        const datos = await res.json();
        document.getElementById('tabla-movimiento-tipo').innerHTML =
            mostrarFila(datos, 'cols-movimiento', ['id','fecha','tipoMovimiento','usuario.nombre','bodegaOrigen.nombre']);
    } catch (e) {
        mostrarError('tabla-movimiento-tipo', `Error al buscar movimientos. (${e.message})`);
    }
}

async function buscarMovimientoPorUsuario() {
    const id = document.getElementById('mov-get-usuario').value.trim();
    if (!id) return;
    try {
        const res = await fetch(`${BASE_URL}/api/movimiento/usuario/${id}`, { headers: headers() });
        if (!res.ok) throw new Error(res.status);
        const datos = await res.json();
        document.getElementById('tabla-movimiento-usuario').innerHTML =
            mostrarFila(datos, 'cols-movimiento', ['id','fecha','tipoMovimiento','usuario.nombre','bodegaOrigen.nombre']);
    } catch (e) {
        mostrarError('tabla-movimiento-usuario', `Error al buscar movimientos. (${e.message})`);
    }
}

async function crearMovimiento() {
    const body = {
        fecha:           document.getElementById('mov-fecha').value,
        tipoMovimiento:  document.getElementById('mov-tipo').value,
        usuarioId:       parseInt(document.getElementById('mov-usuario').value),
        bodegaOrigenId:  document.getElementById('mov-origen').value  ? parseInt(document.getElementById('mov-origen').value)  : null,
        bodegaDestinoId: document.getElementById('mov-destino').value ? parseInt(document.getElementById('mov-destino').value) : null
    };
    try {
        const res = await fetch(`${BASE_URL}/api/movimiento`, {
            method: 'POST', headers: headers(), body: JSON.stringify(body)
        });
        if (!res.ok) {
            const err = await res.json();
            alert(`Error: ${JSON.stringify(err)}`);
            return;
        }
        alert('Movimiento creado exitosamente.');
    } catch (e) {
        alert(`Error al crear el movimiento. (${e.message})`);
    }
}

async function actualizarMovimiento() {
    const id = document.getElementById('mov-upd-id').value;
    const body = {
        fecha:           document.getElementById('mov-upd-fecha').value,
        tipoMovimiento:  document.getElementById('mov-upd-tipo').value,
        usuarioId:       parseInt(document.getElementById('mov-upd-usuario').value),
        bodegaOrigenId:  document.getElementById('mov-upd-origen').value  ? parseInt(document.getElementById('mov-upd-origen').value)  : null,
        bodegaDestinoId: document.getElementById('mov-upd-destino').value ? parseInt(document.getElementById('mov-upd-destino').value) : null
    };
    try {
        const res = await fetch(`${BASE_URL}/api/movimiento/${id}`, {
            method: 'PUT', headers: headers(), body: JSON.stringify(body)
        });
        if (!res.ok) {
            const err = await res.json();
            alert(`Error: ${JSON.stringify(err)}`);
            return;
        }
        alert('Movimiento actualizado exitosamente.');
    } catch (e) {
        alert(`Error al actualizar el movimiento. (${e.message})`);
    }
}

async function eliminarMovimiento() {
    const id = document.getElementById('mov-del-id').value;
    if (!id) { alert('Ingresa un ID.'); return; }
    if (!confirm(`¿Eliminar el movimiento con ID ${id}?`)) return;
    try {
        const res = await fetch(`${BASE_URL}/api/movimiento/${id}`, {
            method: 'DELETE', headers: headers()
        });
        if (!res.ok) throw new Error(res.status);
        alert('Movimiento eliminado exitosamente.');
    } catch (e) {
        alert(`Error al eliminar el movimiento. (${e.message})`);
    }
}

// ── DETALLES ─────────────────────────────────────────────────

async function listarDetalles() {
    try {
        const res = await fetch(`${BASE_URL}/api/movimiento-detalle`, { headers: headers() });
        if (!res.ok) throw new Error(res.status);
        const datos = await res.json();
        document.getElementById('tabla-detalle').innerHTML =
            mostrarFila(datos, 'cols-detalle', ['id','movimiento.id','producto.nombre','cantidad']);
    } catch (e) {
        mostrarError('tabla-detalle', `Error al cargar detalles. (${e.message})`);
    }
}

async function buscarDetallePorId() {
    const id = document.getElementById('det-get-id').value.trim();
    if (!id) return;
    try {
        const res = await fetch(`${BASE_URL}/api/movimiento-detalle/${id}`, { headers: headers() });
        if (!res.ok) throw new Error(res.status);
        const dato = await res.json();
        document.getElementById('tabla-detalle-id').innerHTML =
            mostrarFila([dato], 'cols-detalle', ['id','movimiento.id','producto.nombre','cantidad']);
    } catch (e) {
        mostrarError('tabla-detalle-id', `No se encontró el detalle. (${e.message})`);
    }
}

async function buscarDetallePorMovimiento() {
    const id = document.getElementById('det-get-movimiento').value.trim();
    if (!id) return;
    try {
        const res = await fetch(`${BASE_URL}/api/movimiento-detalle/movimiento/${id}`, { headers: headers() });
        if (!res.ok) throw new Error(res.status);
        const datos = await res.json();
        document.getElementById('tabla-detalle-movimiento').innerHTML =
            mostrarFila(datos, 'cols-detalle', ['id','movimiento.id','producto.nombre','cantidad']);
    } catch (e) {
        mostrarError('tabla-detalle-movimiento', `Error al buscar detalles. (${e.message})`);
    }
}

async function buscarDetallePorProducto() {
    const id = document.getElementById('det-get-producto').value.trim();
    if (!id) return;
    try {
        const res = await fetch(`${BASE_URL}/api/movimiento-detalle/producto/${id}`, { headers: headers() });
        if (!res.ok) throw new Error(res.status);
        const datos = await res.json();
        document.getElementById('tabla-detalle-producto').innerHTML =
            mostrarFila(datos, 'cols-detalle', ['id','movimiento.id','producto.nombre','cantidad']);
    } catch (e) {
        mostrarError('tabla-detalle-producto', `Error al buscar detalles. (${e.message})`);
    }
}

async function crearDetalle() {
    const body = {
        movimientoId: parseInt(document.getElementById('det-movimiento').value),
        productoId:   parseInt(document.getElementById('det-producto').value),
        cantidad:     parseInt(document.getElementById('det-cantidad').value)
    };
    try {
        const res = await fetch(`${BASE_URL}/api/movimiento-detalle`, {
            method: 'POST', headers: headers(), body: JSON.stringify(body)
        });
        if (!res.ok) {
            const err = await res.json();
            alert(`Error: ${JSON.stringify(err)}`);
            return;
        }
        alert('Detalle creado exitosamente.');
    } catch (e) {
        alert(`Error al crear el detalle. (${e.message})`);
    }
}

async function actualizarDetalle() {
    const id = document.getElementById('det-upd-id').value;
    const body = {
        movimientoId: parseInt(document.getElementById('det-upd-movimiento').value),
        productoId:   parseInt(document.getElementById('det-upd-producto').value),
        cantidad:     parseInt(document.getElementById('det-upd-cantidad').value)
    };
    try {
        const res = await fetch(`${BASE_URL}/api/movimiento-detalle/${id}`, {
            method: 'PUT', headers: headers(), body: JSON.stringify(body)
        });
        if (!res.ok) {
            const err = await res.json();
            alert(`Error: ${JSON.stringify(err)}`);
            return;
        }
        alert('Detalle actualizado exitosamente.');
    } catch (e) {
        alert(`Error al actualizar el detalle. (${e.message})`);
    }
}

async function eliminarDetalle() {
    const id = document.getElementById('det-del-id').value;
    if (!id) { alert('Ingresa un ID.'); return; }
    if (!confirm(`¿Eliminar el detalle con ID ${id}?`)) return;
    try {
        const res = await fetch(`${BASE_URL}/api/movimiento-detalle/${id}`, {
            method: 'DELETE', headers: headers()
        });
        if (!res.ok) throw new Error(res.status);
        alert('Detalle eliminado exitosamente.');
    } catch (e) {
        alert(`Error al eliminar el detalle. (${e.message})`);
    }
}

// ── AUDITORÍAS ───────────────────────────────────────────────

async function listarAuditorias() {
    try {
        const res = await fetch(`${BASE_URL}/api/auditoria`, { headers: headers() });
        if (!res.ok) throw new Error(res.status);
        const datos = await res.json();
        document.getElementById('tabla-auditoria').innerHTML =
            mostrarFila(datos, 'cols-auditoria', ['id','entidad','operacion','usuario.nombre','valorAnterior','valorNuevo']);
    } catch (e) {
        mostrarError('tabla-auditoria', `Error al cargar auditorías. (${e.message})`);
    }
}

async function buscarAuditoriaPorId() {
    const id = document.getElementById('aud-get-id').value.trim();
    if (!id) return;
    try {
        const res = await fetch(`${BASE_URL}/api/auditoria/${id}`, { headers: headers() });
        if (!res.ok) throw new Error(res.status);
        const dato = await res.json();
        document.getElementById('tabla-auditoria-id').innerHTML =
            mostrarFila([dato], 'cols-auditoria', ['id','entidad','operacion','usuario.nombre','valorAnterior','valorNuevo']);
    } catch (e) {
        mostrarError('tabla-auditoria-id', `No se encontró la auditoría. (${e.message})`);
    }
}

async function buscarAuditoriaPorEntidad() {
    const entidad = document.getElementById('aud-get-entidad').value.trim();
    if (!entidad) return;
    try {
        const res = await fetch(`${BASE_URL}/api/auditoria/entidad?entidad=${entidad}`, { headers: headers() });
        if (!res.ok) throw new Error(res.status);
        const datos = await res.json();
        document.getElementById('tabla-auditoria-entidad').innerHTML =
            mostrarFila(datos, 'cols-auditoria', ['id','entidad','operacion','usuario.nombre','valorAnterior','valorNuevo']);
    } catch (e) {
        mostrarError('tabla-auditoria-entidad', `Error al buscar auditorías. (${e.message})`);
    }
}

async function buscarAuditoriaPorOperacion() {
    const op = document.getElementById('aud-get-operacion').value;
    if (!op) return;
    try {
        const res = await fetch(`${BASE_URL}/api/auditoria/operacion?operacion=${op}`, { headers: headers() });
        if (!res.ok) throw new Error(res.status);
        const datos = await res.json();
        document.getElementById('tabla-auditoria-operacion').innerHTML =
            mostrarFila(datos, 'cols-auditoria', ['id','entidad','operacion','usuario.nombre','valorAnterior','valorNuevo']);
    } catch (e) {
        mostrarError('tabla-auditoria-operacion', `Error al buscar auditorías. (${e.message})`);
    }
}

async function buscarAuditoriaPorUsuario() {
    const id = document.getElementById('aud-get-usuario').value.trim();
    if (!id) return;
    try {
        const res = await fetch(`${BASE_URL}/api/auditoria/usuario/${id}`, { headers: headers() });
        if (!res.ok) throw new Error(res.status);
        const datos = await res.json();
        document.getElementById('tabla-auditoria-usuario').innerHTML =
            mostrarFila(datos, 'cols-auditoria', ['id','entidad','operacion','usuario.nombre','valorAnterior','valorNuevo']);
    } catch (e) {
        mostrarError('tabla-auditoria-usuario', `Error al buscar auditorías. (${e.message})`);
    }
}

async function crearAuditoria() {
    const body = {
        entidad:       document.getElementById('aud-entidad').value,
        operacion:     document.getElementById('aud-operacion').value,
        usuarioId:     parseInt(document.getElementById('aud-usuario').value),
        valorAnterior: document.getElementById('aud-anterior').value || null,
        valorNuevo:    document.getElementById('aud-nuevo').value    || null
    };
    try {
        const res = await fetch(`${BASE_URL}/api/auditoria`, {
            method: 'POST', headers: headers(), body: JSON.stringify(body)
        });
        if (!res.ok) {
            const err = await res.json();
            alert(`Error: ${JSON.stringify(err)}`);
            return;
        }
        alert('Auditoría creada exitosamente.');
    } catch (e) {
        alert(`Error al crear la auditoría. (${e.message})`);
    }
}

async function eliminarAuditoria() {
    const id = document.getElementById('aud-del-id').value;
    if (!id) { alert('Ingresa un ID.'); return; }
    if (!confirm(`¿Eliminar la auditoría con ID ${id}?`)) return;
    try {
        const res = await fetch(`${BASE_URL}/api/auditoria/${id}`, {
            method: 'DELETE', headers: headers()
        });
        if (!res.ok) throw new Error(res.status);
        alert('Auditoría eliminada exitosamente.');
    } catch (e) {
        alert(`Error al eliminar la auditoría. (${e.message})`);
    }
}
