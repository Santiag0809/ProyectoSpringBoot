const BASE_URL = 'http://localhost:8080';
const token    = localStorage.getItem('token');


if (!token) window.location.href = 'login.html';

// NAVEGACIÓN

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
    if (vista) {
        vista.querySelectorAll(':scope > div').forEach(d => d.style.display = 'none');
    }
}

// HELPERS

function headers() {
    return {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`
    };
}

function mostrarFila(datos, clase, campos) {
    return datos.map(item => {
        const celdas = campos.map(c => {
            const valor = c.split('.').reduce((o, k) => o?.[k], item);
            return `<p>${valor ?? '—'}</p>`;
        }).join('');
        return `<div class="fila ${clase}">${celdas}</div>`;
    }).join('');
}

function mostrarError(contenedor, mensaje) {
    document.getElementById(contenedor).innerHTML =
        `<p class="vacio" style="color:#ef4444">${mensaje}</p>`;
}

// PERSONAS

async function listarPersonas() {
    try {
        const res   = await fetch(`${BASE_URL}/api/persona`, { headers: headers() });
        const datos = await res.json();
        document.getElementById('tabla-persona').innerHTML =
            mostrarFila(datos, 'cols-persona', ['id','documento','nombre','apellido','edad','email']);
    } catch {
        mostrarError('tabla-persona', 'Error al cargar personas.');
    }
}

async function buscarPersonaPorId() {
    const id = document.getElementById('p-get-id').value.trim();
    if (!id) return;
    try {
        const res  = await fetch(`${BASE_URL}/api/persona/${id}`, { headers: headers() });
        const dato = await res.json();
        document.getElementById('tabla-persona-id').innerHTML =
            mostrarFila([dato], 'cols-persona', ['id','documento','nombre','apellido','edad','email']);
    } catch {
        mostrarError('tabla-persona-id', 'No se encontró la persona.');
    }
}

async function buscarPersonaPorEdad() {
    const edad = document.getElementById('p-get-edad').value.trim();
    if (!edad) return;
    try {
        const res   = await fetch(`${BASE_URL}/api/persona/edad?edad=${edad}`, { headers: headers() });
        const datos = await res.json();
        document.getElementById('tabla-persona-edad').innerHTML =
            mostrarFila(datos, 'cols-persona', ['id','documento','nombre','apellido','edad','email']);
    } catch {
        mostrarError('tabla-persona-edad', 'Error al buscar personas.');
    }
}

async function crearPersona() {
    const body = {
        nombre:    document.getElementById('p-nombre').value,
        apellido:  document.getElementById('p-apellido').value,
        edad:      parseInt(document.getElementById('p-edad').value),
        documento: document.getElementById('p-documento').value,
        email:     document.getElementById('p-email').value,
        password:  document.getElementById('p-password').value
    };
    try {
        const res = await fetch(`${BASE_URL}/api/persona`, {
            method: 'POST', headers: headers(), body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error();
        alert('Persona creada exitosamente.');
    } catch {
        alert('Error al crear la persona.');
    }
}

async function actualizarPersona() {
    const id   = document.getElementById('p-upd-id').value;
    const body = {
        nombre:    document.getElementById('p-upd-nombre').value,
        apellido:  document.getElementById('p-upd-apellido').value,
        edad:      parseInt(document.getElementById('p-upd-edad').value),
        documento: document.getElementById('p-upd-documento').value,
        email:     document.getElementById('p-upd-email').value,
        password:  document.getElementById('p-upd-password').value
    };
    try {
        const res = await fetch(`${BASE_URL}/api/persona/${id}`, {
            method: 'PUT', headers: headers(), body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error();
        alert('Persona actualizada exitosamente.');
    } catch {
        alert('Error al actualizar la persona.');
    }
}

async function eliminarPersona() {
    const id = document.getElementById('p-del-id').value;
    if (!confirm(`¿Estás seguro de eliminar la persona con ID ${id}?`)) return;
    try {
        await fetch(`${BASE_URL}/api/persona/${id}`, {
            method: 'DELETE', headers: headers()
        });
        alert('Persona eliminada exitosamente.');
    } catch {
        alert('Error al eliminar la persona.');
    }
}

// PRODUCTOS

async function listarProductos() {
    try {
        const res   = await fetch(`${BASE_URL}/api/producto`, { headers: headers() });
        const datos = await res.json();
        document.getElementById('tabla-producto').innerHTML =
            mostrarFila(datos, 'cols-producto', ['id','nombre','categoria','precio']);
    } catch {
        mostrarError('tabla-producto', 'Error al cargar productos.');
    }
}

async function buscarProductoPorId() {
    const id = document.getElementById('prod-get-id').value.trim();
    if (!id) return;
    try {
        const res  = await fetch(`${BASE_URL}/api/producto/${id}`, { headers: headers() });
        const dato = await res.json();
        document.getElementById('tabla-producto-id').innerHTML =
            mostrarFila([dato], 'cols-producto', ['id','nombre','categoria','precio']);
    } catch {
        mostrarError('tabla-producto-id', 'No se encontró el producto.');
    }
}

async function buscarProductoPorCategoria() {
    const cat = document.getElementById('prod-get-categoria').value.trim();
    if (!cat) return;
    try {
        const res   = await fetch(`${BASE_URL}/api/producto/categoria?categoria=${cat}`, { headers: headers() });
        const datos = await res.json();
        document.getElementById('tabla-producto-categoria').innerHTML =
            mostrarFila(datos, 'cols-producto', ['id','nombre','categoria','precio']);
    } catch {
        mostrarError('tabla-producto-categoria', 'Error al buscar productos.');
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
        if (!res.ok) throw new Error();
        alert('Producto creado exitosamente.');
    } catch {
        alert('Error al crear el producto.');
    }
}

async function actualizarProducto() {
    const id   = document.getElementById('prod-upd-id').value;
    const body = {
        nombre:    document.getElementById('prod-upd-nombre').value,
        categoria: document.getElementById('prod-upd-categoria').value,
        precio:    parseFloat(document.getElementById('prod-upd-precio').value)
    };
    try {
        const res = await fetch(`${BASE_URL}/api/producto/${id}`, {
            method: 'PUT', headers: headers(), body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error();
        alert('Producto actualizado exitosamente.');
    } catch {
        alert('Error al actualizar el producto.');
    }
}

async function eliminarProducto() {
    const id = document.getElementById('prod-del-id').value;
    if (!confirm(`¿Estás seguro de eliminar el producto con ID ${id}?`)) return;
    try {
        await fetch(`${BASE_URL}/api/producto/${id}`, {
            method: 'DELETE', headers: headers()
        });
        alert('Producto eliminado exitosamente.');
    } catch {
        alert('Error al eliminar el producto.');
    }
}

// BODEGAS
async function listarBodegas() {
    try {
        const res   = await fetch(`${BASE_URL}/api/bodega`, { headers: headers() });
        const datos = await res.json();
        document.getElementById('tabla-bodega').innerHTML =
            mostrarFila(datos, 'cols-bodega', ['id','nombre','ubicacion','capacidad','encargado.nombre']);
    } catch {
        mostrarError('tabla-bodega', 'Error al cargar bodegas.');
    }
}

async function buscarBodegaPorId() {
    const id = document.getElementById('bod-get-id').value.trim();
    if (!id) return;
    try {
        const res  = await fetch(`${BASE_URL}/api/bodega/${id}`, { headers: headers() });
        const dato = await res.json();
        document.getElementById('tabla-bodega-id').innerHTML =
            mostrarFila([dato], 'cols-bodega', ['id','nombre','ubicacion','capacidad','encargado.nombre']);
    } catch {
        mostrarError('tabla-bodega-id', 'No se encontró la bodega.');
    }
}

async function buscarBodegaPorNombre() {
    const nombre = document.getElementById('bod-get-nombre').value.trim();
    if (!nombre) return;
    try {
        const res   = await fetch(`${BASE_URL}/api/bodega/nombre?nombre=${nombre}`, { headers: headers() });
        const datos = await res.json();
        document.getElementById('tabla-bodega-nombre').innerHTML =
            mostrarFila(datos, 'cols-bodega', ['id','nombre','ubicacion','capacidad','encargado.nombre']);
    } catch {
        mostrarError('tabla-bodega-nombre', 'Error al buscar bodegas.');
    }
}

async function buscarBodegaPorEncargado() {
    const id = document.getElementById('bod-get-encargado').value.trim();
    if (!id) return;
    try {
        const res   = await fetch(`${BASE_URL}/api/bodega/encargado/${id}`, { headers: headers() });
        const datos = await res.json();
        document.getElementById('tabla-bodega-encargado').innerHTML =
            mostrarFila(datos, 'cols-bodega', ['id','nombre','ubicacion','capacidad','encargado.nombre']);
    } catch {
        mostrarError('tabla-bodega-encargado', 'Error al buscar bodegas.');
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
        if (!res.ok) throw new Error();
        alert('Bodega creada exitosamente.');
    } catch {
        alert('Error al crear la bodega.');
    }
}

async function actualizarBodega() {
    const id   = document.getElementById('bod-upd-id').value;
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
        if (!res.ok) throw new Error();
        alert('Bodega actualizada exitosamente.');
    } catch {
        alert('Error al actualizar la bodega.');
    }
}

async function eliminarBodega() {
    const id = document.getElementById('bod-del-id').value;
    if (!confirm(`¿Estás seguro de eliminar la bodega con ID ${id}?`)) return;
    try {
        await fetch(`${BASE_URL}/api/bodega/${id}`, {
            method: 'DELETE', headers: headers()
        });
        alert('Bodega eliminada exitosamente.');
    } catch {
        alert('Error al eliminar la bodega.');
    }
}

// MOVIMIENTOS

async function listarMovimientos() {
    try {
        const res   = await fetch(`${BASE_URL}/api/movimiento`, { headers: headers() });
        const datos = await res.json();
        document.getElementById('tabla-movimiento').innerHTML =
            mostrarFila(datos, 'cols-movimiento', ['id','fecha','tipoMovimiento','usuario.nombre','bodegaOrigen.nombre']);
    } catch {
        mostrarError('tabla-movimiento', 'Error al cargar movimientos.');
    }
}

async function buscarMovimientoPorId() {
    const id = document.getElementById('mov-get-id').value.trim();
    if (!id) return;
    try {
        const res  = await fetch(`${BASE_URL}/api/movimiento/${id}`, { headers: headers() });
        const dato = await res.json();
        document.getElementById('tabla-movimiento-id').innerHTML =
            mostrarFila([dato], 'cols-movimiento', ['id','fecha','tipoMovimiento','usuario.nombre','bodegaOrigen.nombre']);
    } catch {
        mostrarError('tabla-movimiento-id', 'No se encontró el movimiento.');
    }
}

async function buscarMovimientoPorTipo() {
    const tipo = document.getElementById('mov-get-tipo').value;
    if (!tipo) return;
    try {
        const res   = await fetch(`${BASE_URL}/api/movimiento/tipo?tipo=${tipo}`, { headers: headers() });
        const datos = await res.json();
        document.getElementById('tabla-movimiento-tipo').innerHTML =
            mostrarFila(datos, 'cols-movimiento', ['id','fecha','tipoMovimiento','usuario.nombre','bodegaOrigen.nombre']);
    } catch {
        mostrarError('tabla-movimiento-tipo', 'Error al buscar movimientos.');
    }
}

async function buscarMovimientoPorUsuario() {
    const id = document.getElementById('mov-get-usuario').value.trim();
    if (!id) return;
    try {
        const res   = await fetch(`${BASE_URL}/api/movimiento/usuario/${id}`, { headers: headers() });
        const datos = await res.json();
        document.getElementById('tabla-movimiento-usuario').innerHTML =
            mostrarFila(datos, 'cols-movimiento', ['id','fecha','tipoMovimiento','usuario.nombre','bodegaOrigen.nombre']);
    } catch {
        mostrarError('tabla-movimiento-usuario', 'Error al buscar movimientos.');
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
        if (!res.ok) throw new Error();
        alert('Movimiento creado exitosamente.');
    } catch {
        alert('Error al crear el movimiento.');
    }
}

async function actualizarMovimiento() {
    const id   = document.getElementById('mov-upd-id').value;
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
        if (!res.ok) throw new Error();
        alert('Movimiento actualizado exitosamente.');
    } catch {
        alert('Error al actualizar el movimiento.');
    }
}

async function eliminarMovimiento() {
    const id = document.getElementById('mov-del-id').value;
    if (!confirm(`¿Estás seguro de eliminar el movimiento con ID ${id}?`)) return;
    try {
        await fetch(`${BASE_URL}/api/movimiento/${id}`, {
            method: 'DELETE', headers: headers()
        });
        alert('Movimiento eliminado exitosamente.');
    } catch {
        alert('Error al eliminar el movimiento.');
    }
}

// DETALLES

async function listarDetalles() {
    try {
        const res   = await fetch(`${BASE_URL}/api/movimiento-detalle`, { headers: headers() });
        const datos = await res.json();
        document.getElementById('tabla-detalle').innerHTML =
            mostrarFila(datos, 'cols-detalle', ['id','movimiento.id','producto.nombre','cantidad']);
    } catch {
        mostrarError('tabla-detalle', 'Error al cargar detalles.');
    }
}

async function buscarDetallePorId() {
    const id = document.getElementById('det-get-id').value.trim();
    if (!id) return;
    try {
        const res  = await fetch(`${BASE_URL}/api/movimiento-detalle/${id}`, { headers: headers() });
        const dato = await res.json();
        document.getElementById('tabla-detalle-id').innerHTML =
            mostrarFila([dato], 'cols-detalle', ['id','movimiento.id','producto.nombre','cantidad']);
    } catch {
        mostrarError('tabla-detalle-id', 'No se encontró el detalle.');
    }
}

async function buscarDetallePorMovimiento() {
    const id = document.getElementById('det-get-movimiento').value.trim();
    if (!id) return;
    try {
        const res   = await fetch(`${BASE_URL}/api/movimiento-detalle/movimiento/${id}`, { headers: headers() });
        const datos = await res.json();
        document.getElementById('tabla-detalle-movimiento').innerHTML =
            mostrarFila(datos, 'cols-detalle', ['id','movimiento.id','producto.nombre','cantidad']);
    } catch {
        mostrarError('tabla-detalle-movimiento', 'Error al buscar detalles.');
    }
}

async function buscarDetallePorProducto() {
    const id = document.getElementById('det-get-producto').value.trim();
    if (!id) return;
    try {
        const res   = await fetch(`${BASE_URL}/api/movimiento-detalle/producto/${id}`, { headers: headers() });
        const datos = await res.json();
        document.getElementById('tabla-detalle-producto').innerHTML =
            mostrarFila(datos, 'cols-detalle', ['id','movimiento.id','producto.nombre','cantidad']);
    } catch {
        mostrarError('tabla-detalle-producto', 'Error al buscar detalles.');
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
        if (!res.ok) throw new Error();
        alert('Detalle creado exitosamente.');
    } catch {
        alert('Error al crear el detalle.');
    }
}

async function actualizarDetalle() {
    const id   = document.getElementById('det-upd-id').value;
    const body = {
        movimientoId: parseInt(document.getElementById('det-upd-movimiento').value),
        productoId:   parseInt(document.getElementById('det-upd-producto').value),
        cantidad:     parseInt(document.getElementById('det-upd-cantidad').value)
    };
    try {
        const res = await fetch(`${BASE_URL}/api/movimiento-detalle/${id}`, {
            method: 'PUT', headers: headers(), body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error();
        alert('Detalle actualizado exitosamente.');
    } catch {
        alert('Error al actualizar el detalle.');
    }
}

async function eliminarDetalle() {
    const id = document.getElementById('det-del-id').value;
    if (!confirm(`¿Estás seguro de eliminar el detalle con ID ${id}?`)) return;
    try {
        await fetch(`${BASE_URL}/api/movimiento-detalle/${id}`, {
            method: 'DELETE', headers: headers()
        });
        alert('Detalle eliminado exitosamente.');
    } catch {
        alert('Error al eliminar el detalle.');
    }
}

// AUDITORÍAS

async function listarAuditorias() {
    try {
        const res   = await fetch(`${BASE_URL}/api/auditoria`, { headers: headers() });
        const datos = await res.json();
        document.getElementById('tabla-auditoria').innerHTML =
            mostrarFila(datos, 'cols-auditoria', ['id','entidad','operacion','usuario.nombre','valorAnterior','valorNuevo']);
    } catch {
        mostrarError('tabla-auditoria', 'Error al cargar auditorías.');
    }
}

async function buscarAuditoriaPorId() {
    const id = document.getElementById('aud-get-id').value.trim();
    if (!id) return;
    try {
        const res  = await fetch(`${BASE_URL}/api/auditoria/${id}`, { headers: headers() });
        const dato = await res.json();
        document.getElementById('tabla-auditoria-id').innerHTML =
            mostrarFila([dato], 'cols-auditoria', ['id','entidad','operacion','usuario.nombre','valorAnterior','valorNuevo']);
    } catch {
        mostrarError('tabla-auditoria-id', 'No se encontró la auditoría.');
    }
}

async function buscarAuditoriaPorEntidad() {
    const entidad = document.getElementById('aud-get-entidad').value.trim();
    if (!entidad) return;
    try {
        const res   = await fetch(`${BASE_URL}/api/auditoria/entidad?entidad=${entidad}`, { headers: headers() });
        const datos = await res.json();
        document.getElementById('tabla-auditoria-entidad').innerHTML =
            mostrarFila(datos, 'cols-auditoria', ['id','entidad','operacion','usuario.nombre','valorAnterior','valorNuevo']);
    } catch {
        mostrarError('tabla-auditoria-entidad', 'Error al buscar auditorías.');
    }
}

async function buscarAuditoriaPorOperacion() {
    const op = document.getElementById('aud-get-operacion').value;
    if (!op) return;
    try {
        const res   = await fetch(`${BASE_URL}/api/auditoria/operacion?operacion=${op}`, { headers: headers() });
        const datos = await res.json();
        document.getElementById('tabla-auditoria-operacion').innerHTML =
            mostrarFila(datos, 'cols-auditoria', ['id','entidad','operacion','usuario.nombre','valorAnterior','valorNuevo']);
    } catch {
        mostrarError('tabla-auditoria-operacion', 'Error al buscar auditorías.');
    }
}

async function buscarAuditoriaPorUsuario() {
    const id = document.getElementById('aud-get-usuario').value.trim();
    if (!id) return;
    try {
        const res   = await fetch(`${BASE_URL}/api/auditoria/usuario/${id}`, { headers: headers() });
        const datos = await res.json();
        document.getElementById('tabla-auditoria-usuario').innerHTML =
            mostrarFila(datos, 'cols-auditoria', ['id','entidad','operacion','usuario.nombre','valorAnterior','valorNuevo']);
    } catch {
        mostrarError('tabla-auditoria-usuario', 'Error al buscar auditorías.');
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
        if (!res.ok) throw new Error();
        alert('Auditoría creada exitosamente.');
    } catch {
        alert('Error al crear la auditoría.');
    }
}

async function eliminarAuditoria() {
    const id = document.getElementById('aud-del-id').value;
    if (!confirm(`¿Estás seguro de eliminar la auditoría con ID ${id}?`)) return;
    try {
        await fetch(`${BASE_URL}/api/auditoria/${id}`, {
            method: 'DELETE', headers: headers()
        });
        alert('Auditoría eliminada exitosamente.');
    } catch {
        alert('Error al eliminar la auditoría.');
    }
}
