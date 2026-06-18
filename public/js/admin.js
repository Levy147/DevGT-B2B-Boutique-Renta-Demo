/**
 * ============================================================
 *  👗 Nicol Dress Rental - Lógica del Panel Admin
 *  ============================================================
 *  Dashboard, citas con WhatsApp, inventario, estadísticas,
 *  tintorería, daños, QR.
 * ============================================================
 */

// ─── DASHBOARD ───
function cargarDashboard() {
  const vestidos = getVestidos();
  const citas = getCitas();
  const today = new Date().toISOString().split('T')[0];

  // Stats
  const citasHoy = citas.filter(c => c.fecha === today);
  const disponibles = vestidos.filter(v => v.estado === 'disponible' && v.disponibles > 0);
  const lavanderia = vestidos.filter(v => v.estado === 'lavanderia');
  const reparacion = vestidos.filter(v => v.estado === 'reparacion');

  document.getElementById('statCitasHoy').textContent = citasHoy.length;
  document.getElementById('statDisponibles').textContent = disponibles.length;
  document.getElementById('statLavanderia').textContent = lavanderia.length;
  document.getElementById('statReparacion').textContent = reparacion.length;

  const citasHoyCount = document.getElementById('citasHoyCount');
  if (citasHoyCount) citasHoyCount.textContent = `${citasHoy.length} cita(s)`;

  // Tabla citas de hoy
  renderizarCitas(citasHoy, 'citasHoyBody');

  // Tabla citas pendientes
  const pendientes = citas.filter(c => c.estado_cita === 'pendiente').sort((a, b) => a.fecha.localeCompare(b.fecha));
  renderizarCitas(pendientes, 'citasPendientesBody');
}

function renderizarCitas(citas, containerId) {
  const body = document.getElementById(containerId);
  if (!body) return;

  const isHoy = containerId === 'citasHoyBody';
  const cols = isHoy ? 7 : 7;

  if (citas.length === 0) {
    body.innerHTML = `<tr><td colspan="${cols}" style="text-align:center;padding:32px;color:var(--text-muted);">No hay citas</td></tr>`;
    return;
  }

  const tipoLabel = { prueba: 'Prueba', renta: 'Alquiler', devolucion: 'Devolución' };
  const statusClass = {
    pendiente: 'badge-warning',
    confirmada: 'badge-success',
    completada: 'badge-info',
    rechazada: 'badge-danger'
  };

  body.innerHTML = citas.map(c => {
    const usuario = getUsuarioById(c.id_usuario);
    const vestido = getVestidoById(c.id_vestido);
    const stClass = statusClass[c.estado_cita] || 'badge-default';
    
    // WhatsApp link para recordatorio
    const waMsg = encodeURIComponent(`¡Hola ${usuario?.nombre || ''}! Te esperamos mañana a las ${c.hora} para tu ${tipoLabel[c.tipo] || c.tipo} de ${vestido?.nombre || ''} en Nicol Dress Rental. 📍 7av 16-21 zona 9, Guatemala.`);
    const waLink = usuario ? `https://wa.me/${usuario.telefono.replace(/[^0-9]/g, '')}?text=${waMsg}` : '#';

    return `
      <tr>
        <td><strong>${usuario ? usuario.nombre : 'Usuario #' + c.id_usuario}</strong><br><span style="font-size:0.75rem;color:var(--text-muted);">${usuario ? usuario.correo : ''}</span></td>
        <td>${vestido ? vestido.nombre : '#' + c.id_vestido}</td>
        <td>${c.fecha}</td>
        <td>${c.hora}</td>
        <td>${tipoLabel[c.tipo] || c.tipo}</td>
        <td><span class="badge ${stClass}">${c.estado_cita.charAt(0).toUpperCase() + c.estado_cita.slice(1)}</span></td>
        ${isHoy ? `
        <td>
          <a href="${waLink}" target="_blank" class="btn btn-sm btn-whatsapp" title="Enviar recordatorio por WhatsApp">📲</a>
        </td>` : ''}
        <td>
          <div class="table-actions">
            ${c.estado_cita === 'pendiente' ? `
              <button class="btn btn-sm btn-primary" onclick="cambiarEstadoCita(${c.id_cita}, 'confirmada')">✅ Aprobar</button>
              <button class="btn btn-sm btn-danger" onclick="cambiarEstadoCita(${c.id_cita}, 'rechazada')">❌ Rechazar</button>
            ` : ''}
            ${c.estado_cita === 'confirmada' ? `
              <button class="btn btn-sm btn-outline" onclick="cambiarEstadoCita(${c.id_cita}, 'completada')">✅ Asistió</button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ─── ESTADÍSTICAS DE RENTABILIDAD ───
function cargarEstadisticas() {
  const chart = document.getElementById('chartBars');
  if (!chart) return;

  const vestidos = getVestidos().filter(v => v.rentas_completadas > 0);
  const topVestidos = vestidos.sort((a, b) => b.rentas_completadas - a.rentas_completadas).slice(0, 5);
  const maxRentas = Math.max(...topVestidos.map(v => v.rentas_completadas));

  chart.innerHTML = '<h4 style="margin-bottom:12px;font-size:0.95rem;color:var(--text-muted);">Top 5 Vestidos Más Rentados</h4>' +
    topVestidos.map((v, i) => {
      const pct = (v.rentas_completadas / maxRentas) * 100;
      const ingresos = v.rentas_completadas * v.precio_renta;
      return `
        <div class="chart-bar-group">
          <span class="chart-bar-label">${v.nombre.split(' ')[0]}</span>
          <div class="chart-bar-track">
            <div class="chart-bar-fill" id="chartBar_${i}" style="width:0%"></div>
          </div>
          <span class="chart-bar-value">${v.rentas_completadas} · $${ingresos.toLocaleString()}</span>
        </div>
      `;
    }).join('');
  // Animar las barras después de renderizar
  setTimeout(() => {
    topVestidos.forEach((v, i) => {
      const bar = document.getElementById(`chartBar_${i}`);
      if (bar) {
        const pct = (v.rentas_completadas / maxRentas) * 100;
        bar.style.width = pct + '%';
      }
    });
  }, 100);
}

// ─── DAÑOS ───
function cargarDanos() {
  const body = document.getElementById('danosBody');
  if (!body) return;

  const danos = getDanos();
  if (danos.length === 0) {
    body.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">🔧 No hay daños registrados</td></tr>`;
    return;
  }

  body.innerHTML = danos.map(d => {
    const v = getVestidoById(d.id_vestido);
    const u = getUsuarioById(d.id_usuario);
    const tipoClass = d.tipo === 'Menor' ? 'badge-warning' : 'badge-danger';
    return `
      <tr>
        <td>${v ? v.nombre : '#' + d.id_vestido}</td>
        <td>${u ? u.nombre : '#' + d.id_usuario}</td>
        <td>${d.descripcion}</td>
        <td><span class="badge ${tipoClass}">${d.tipo}</span></td>
        <td><span class="damage-badge">$${d.deposito_retener.toLocaleString()}</span></td>
        <td><span class="badge ${d.estado === 'pendiente' ? 'badge-danger' : 'badge-success'}">${d.estado}</span></td>
      </tr>
    `;
  }).join('');
}

// ─── TINTORERÍA / LAVANDERÍA ───
function cargarTintoreria() {
  const list = document.getElementById('lavanderiaList');
  if (!list) return;

  const enLavanderia = getVestidos().filter(v => v.estado === 'lavanderia' || v.estado === 'reparacion');

  if (enLavanderia.length === 0) {
    list.innerHTML = `<div style="padding:24px;text-align:center;color:var(--text-muted);">No hay vestidos en tintorería</div>`;
    return;
  }

  list.innerHTML = enLavanderia.map(v => {
    const retorno = v.fecha_retorno_lavanderia || 'Sin fecha estimada';
    const label = v.estado === 'lavanderia' ? 'Lavandería' : 'Reparación';
    return `
      <div class="laundry-card">
        <div class="laundry-info">
          <h4>${v.nombre}</h4>
          <p>${label} · Retorno estimado: <strong>${retorno}</strong></p>
        </div>
        <span class="badge ${v.estado === 'lavanderia' ? 'badge-warning' : 'badge-info'}">${v.estado}</span>
      </div>
    `;
  }).join('');
}

function cambiarEstadoCita(idCita, nuevoEstado) {
  actualizarEstadoCita(idCita, nuevoEstado);
  showToast(`Cita ${nuevoEstado} correctamente`, 'success');
  cargarDashboard();
  cargarEstadisticas();
}

// ─── INVENTARIO ───
function renderizarInventario() {
  const body = document.getElementById('inventarioBody');
  if (!body) return;

  let vestidos = getVestidos();
  const search = document.getElementById('inventarioSearch')?.value.toLowerCase().trim();

  if (search) {
    vestidos = vestidos.filter(v =>
      v.nombre.toLowerCase().includes(search) ||
      v.categoria.toLowerCase().includes(search) ||
      v.color.toLowerCase().includes(search)
    );
  }

  if (vestidos.length === 0) {
    body.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:32px;color:var(--text-muted);">No se encontraron vestidos</td></tr>`;
    return;
  }

  const estadoClass = {
    disponible: 'badge-success',
    agotado: 'badge-danger',
    lavanderia: 'badge-warning',
    reparacion: 'badge-info'
  };

  body.innerHTML = vestidos.map(v => `
    <tr>
      <td><span style="font-family:monospace;font-size:0.8rem;background:var(--bg-light);padding:2px 6px;border-radius:4px;">${v.sku || 'NDR-'+String(v.id).padStart(3,'0')}</span></td>
      <td><strong>${v.nombre}</strong></td>
      <td>${v.categoria}</td>
      <td>${v.color}</td>
      <td>${v.talla.join(', ')}</td>
      <td>$${v.precio_renta.toLocaleString()}</td>
      <td>
        <select class="estado-select" data-id="${v.id}" onchange="cambiarEstadoVestido(${v.id}, this.value)" style="width:auto;padding:4px 8px;font-size:0.8rem;">
          <option value="disponible" ${v.estado === 'disponible' ? 'selected' : ''}>Disponible</option>
          <option value="agotado" ${v.estado === 'agotado' ? 'selected' : ''}>Agotado</option>
          <option value="lavanderia" ${v.estado === 'lavanderia' ? 'selected' : ''}>Lavandería</option>
          <option value="reparacion" ${v.estado === 'reparacion' ? 'selected' : ''}>Reparación</option>
        </select>
      </td>
      <td>${v.disponibles}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-sm btn-secondary" onclick="editarVestido(${v.id})"></button>
          <button class="btn btn-sm btn-outline" onclick="generarQR(${v.id})"> QR</button>
          <button class="btn btn-sm btn-danger" onclick="eliminarVestido(${v.id})"></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function cambiarEstadoVestido(id, nuevoEstado) {
  const vestidos = getVestidos();
  const v = vestidos.find(v => v.id === id);
  if (v) {
    v.estado = nuevoEstado;
    saveVestidos(vestidos);
    showToast(`"${v.nombre}" ahora está: ${nuevoEstado}`, 'info');
  }
}

// ─── CRUD ───
function abrirFormularioNuevo() {
  document.getElementById('formTitle').textContent = '➕ Agregar Nuevo Vestido';
  document.getElementById('editId').value = '';
  document.getElementById('vestidoForm').style.display = 'block';
  document.getElementById('vestidoForm').scrollIntoView({ behavior: 'smooth' });

  // Reset
  ['vNombre', 'vCategoria', 'vColor', 'vTallas', 'vPrecioRenta', 'vPrecioVenta',
   'vDisponibles', 'vImagen', 'vDescripcion', 'vTela'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('vEstado').value = 'disponible';
}

function cerrarFormulario() {
  document.getElementById('vestidoForm').style.display = 'none';
}

function guardarVestido(e) {
  e.preventDefault();

  const editId = document.getElementById('editId').value;
  const tallas = document.getElementById('vTallas').value.split(',').map(t => t.trim()).filter(t => t);

  const data = {
    nombre: document.getElementById('vNombre').value,
    categoria: document.getElementById('vCategoria').value,
    color: document.getElementById('vColor').value,
    talla: tallas,
    precio_renta: parseInt(document.getElementById('vPrecioRenta').value) || 0,
    precio_venta: parseInt(document.getElementById('vPrecioVenta').value) || 0,
    disponibles: parseInt(document.getElementById('vDisponibles').value) || 0,
    estado: document.getElementById('vEstado').value,
    imagen: document.getElementById('vImagen').value || 'https://picsum.photos/seed/dress/600/800',
    descripcion: document.getElementById('vDescripcion').value,
    tela: document.getElementById('vTela').value,
    imagenes_extra: []
  };

  let vestidos = getVestidos();

  if (editId) {
    // Editar
    const idx = vestidos.findIndex(v => v.id === parseInt(editId));
    if (idx !== -1) {
      vestidos[idx] = { ...vestidos[idx], ...data };
    }
    showToast('✅ Vestido actualizado', 'success');
  } else {
    // Nuevo
    data.id = Date.now();
    vestidos.push(data);
    showToast('✅ Vestido agregado al catálogo', 'success');
  }

  saveVestidos(vestidos);
  cerrarFormulario();
  renderizarInventario();
}

function editarVestido(id) {
  const v = getVestidoById(id);
  if (!v) return;

  document.getElementById('formTitle').textContent = 'Editar Vestido';
  document.getElementById('editId').value = id;
  document.getElementById('vNombre').value = v.nombre;
  document.getElementById('vCategoria').value = v.categoria;
  document.getElementById('vColor').value = v.color;
  document.getElementById('vTallas').value = v.talla.join(', ');
  document.getElementById('vPrecioRenta').value = v.precio_renta;
  document.getElementById('vPrecioVenta').value = v.precio_venta || 0;
  document.getElementById('vDisponibles').value = v.disponibles;
  document.getElementById('vEstado').value = v.estado;
  document.getElementById('vImagen').value = v.imagen;
  document.getElementById('vDescripcion').value = v.descripcion;
  document.getElementById('vTela').value = v.tela;

  document.getElementById('vestidoForm').style.display = 'block';
  document.getElementById('vestidoForm').scrollIntoView({ behavior: 'smooth' });
}

function eliminarVestido(id) {
  const v = getVestidoById(id);
  if (!v) return;
  if (!confirm(`¿Eliminar "${v.nombre}" del catálogo?`)) return;

  let vestidos = getVestidos();
  vestidos = vestidos.filter(v => v.id !== id);
  saveVestidos(vestidos);
  showToast(`🗑️ "${v.nombre}" eliminado`, 'info');
  renderizarInventario();
}

// ─── QR GENERATOR ───
function generarQR(id) {
  const v = getVestidoById(id);
  if (!v) return;

  const qrSection = document.getElementById('qrSection');
  const qrContainer = document.getElementById('qrCode');
  const qrInfo = document.getElementById('qrInfo');

  qrSection.style.display = 'block';
  qrSection.scrollIntoView({ behavior: 'smooth' });

  const sku = v.sku || `NDR-${String(v.id).padStart(3, '0')}`;
  const vestidoUrl = `${window.location.origin}/vestido.html?id=${v.id}&sku=${sku}`;

  // Generar QR: el QR contiene la URL del vestido + SKU
  qrContainer.innerHTML = `
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(vestidoUrl)}" 
         alt="QR ${sku} - ${v.nombre}"
         style="margin:0 auto;border-radius:8px;">
    <p style="margin-top:12px;padding:6px 12px;background:var(--bg-light);border-radius:6px;font-size:0.85rem;font-weight:700;color:var(--primary);font-family:monospace;">${sku}</p>
  `;

  qrInfo.innerHTML = `
    <strong>${v.nombre}</strong><br>
    <strong>SKU:</strong> ${sku}<br>
    ID: #${v.id} · ${v.categoria} · $${v.precio_renta.toLocaleString()}<br>
    <a href="${vestidoUrl}" target="_blank" style="font-size:0.8rem;">Ver ficha del vestido</a>
  `;
}

function cerrarQR() {
  document.getElementById('qrSection').style.display = 'none';
}

// ─── ID Manual ───
function entrarIdManual() {
  const id = prompt('Ingresa el ID del vestido (número):');
  if (id && !isNaN(parseInt(id))) {
    const v = getVestidoById(parseInt(id));
    if (v) {
      mostrarResultadoScanner(v);
    } else {
      const err = document.getElementById('scannerError');
      const msg = document.getElementById('scannerErrorMessage');
      if (err && msg) {
        err.style.display = 'block';
        msg.textContent = `❌ No se encontró un vestido con ID #${id}`;
      }
    }
  }
}
