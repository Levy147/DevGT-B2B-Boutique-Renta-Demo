/**
 * ============================================================
 *  👗 Nicol Dress Rental - Configuración de Imágenes
 *  ============================================================
 *  Sistema que resuelve rutas de imágenes: primero busca
 *  la imagen local, si no existe usa el placeholder online.
 *  
 *  📁 Estructura de carpetas para imágenes locales:
 *    /img/vestidos/boda/NDR-001.jpg
 *    /img/vestidos/15-anos/NDR-006.jpg
 *    /img/vestidos/graduacion/NDR-011.jpg
 *    /img/vestidos/coctel/NDR-016.jpg
 *    /img/vestidos/fiesta/NDR-049.jpg
 *  
 *  🖼️ Convención de nomenclatura:
 *    NDR-XXX.jpg          → Imagen principal
 *    NDR-XXX-a.jpg        → Imagen extra 1
 *    NDR-XXX-b.jpg        → Imagen extra 2
 *    NDR-XXX-c.jpg        → Imagen extra 3
 * ============================================================
 */

// Cache de configuración de imágenes
let _imgConfig = null;

/**
 * Carga el mapa de imágenes desde el archivo JSON de configuración.
 * Si no se puede cargar, retorna un objeto vacío.
 */
async function cargarConfigImagenes() {
  if (_imgConfig) return _imgConfig;
  try {
    // Detectar si estamos en admin/ y ajustar la ruta relativa
    const basePath = window.location.pathname.includes('/admin/') ? '../' : '';
    const resp = await fetch(basePath + 'public/img/config/imagenes.json');
    _imgConfig = await resp.json();
    return _imgConfig;
  } catch (e) {
    console.warn('⚠️ No se pudo cargar imagenes.json, usando placeholders');
    _imgConfig = { vestidos: {} };
    return _imgConfig;
  }
}

/**
 * Obtiene la URL de imagen para un vestido.
 * Si existe la imagen local la usa, si no usa el placeholder.
 * @param {string} sku - El SKU del vestido (ej: "NDR-001")
 * @param {string} tipo - "principal" | "extra" (default: "principal")
 * @param {number} extraIndex - Índice de imagen extra (0, 1, 2)
 */
function getImagenVestido(sku, tipo = 'principal', extraIndex = 0) {
  const config = _imgConfig?.vestidos?.[sku];
  if (!config) {
    // Fallback: generar URL de placeholder
    const seed = sku ? sku.toLowerCase() : 'dress';
    return `https://picsum.photos/seed/${seed}/600/800`;
  }

  if (tipo === 'principal') {
    return config.local || config.placeholder;
  }

  if (tipo === 'extra' && config.imagenes_extra?.[extraIndex]) {
    return config.imagenes_extra[extraIndex];
  }

  // Fallback para imágenes extra
  return `https://picsum.photos/seed/${sku}-extra-${extraIndex}/600/800`;
}

/**
 * Obtiene las URLs de todas las imágenes (principal + extras) para un vestido.
 */
function getTodasLasImagenes(sku) {
  const config = _imgConfig?.vestidos?.[sku];
  const imagenes = [getImagenVestido(sku, 'principal')];
  
  if (config?.imagenes_extra) {
    config.imagenes_extra.forEach((_, i) => {
      const extra = getImagenVestido(sku, 'extra', i);
      if (extra) imagenes.push(extra);
    });
  }
  
  return imagenes;
}

/**
 * Obtiene la URL de imagen para un vestido desde el sistema de configuración.
 * Función sincrónica que usa el cache si está cargado, o fallback al placeholder del vestido.
 * @param {object} vestido - Objeto del vestido (debe tener sku, imagen)
 */
function getImageUrl(vestido) {
  if (!vestido) return 'https://picsum.photos/seed/dress/600/800';
  const sku = vestido.sku || `NDR-${String(vestido.id).padStart(3, '0')}`;
  
  // Si la config ya está cargada, usar ruta local
  if (_imgConfig?.vestidos?.[sku]?.local) {
    const isAdmin = window.location.pathname.includes('/admin/');
    return isAdmin ? '../' + _imgConfig.vestidos[sku].local : _imgConfig.vestidos[sku].local;
  }
  
  // Fallback: usar la imagen del vestido (placeholder de data.js o picsum)
  return vestido.imagen || `https://picsum.photos/seed/${sku.toLowerCase()}/600/800`;
}

/**
 * Inicializa el sistema de imágenes.
 * Debe llamarse al inicio de cada página.
 */
async function inicializarImagenes() {
  await cargarConfigImagenes();
  console.log(`📸 Configuración de imágenes cargada: ${Object.keys(_imgConfig?.vestidos || {}).length} vestidos`);
}

// Inicializar automáticamente
inicializarImagenes();
