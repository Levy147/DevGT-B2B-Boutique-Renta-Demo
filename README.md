# 👗 Nicol Dress Rental

**Sistema Demo de Alquiler de Vestidos** — Portal de Cliente + Panel Administrativo B2B

> 📍 7av 16-21 zona 9, Guatemala · ☎️ 2339-4963 · ✉️ info@nicoldressrental.com

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Requisitos](#-requisitos)
- [Instalación y Uso](#-instalación-y-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Guía Rápida para Clientes](#-guía-rápida-para-clientes)
- [Guía Rápida para Administradores](#-guía-rápida-para-administradores)
- [Funcionalidades Clave](#-funcionalidades-clave)
- [Credenciales de Prueba](#-credenciales-de-prueba)
- [Paleta de Colores Estratégica](#-paleta-de-colores-estratégica)
- [Detalles Técnicos](#-detalles-técnicos)

---

## 🎯 Descripción

**Nicol Dress Rental** es una demo interactiva de un sistema completo de alquiler de vestidos para una boutique. Está dividido en dos experiencias:

| Portal del Cliente | Panel del Admin |
|-------------------|-----------------|
| Landing page con catálogo | Dashboard con métricas |
| Filtros por categoría, color, talla, precio y **tipo de cuerpo** | Gestión de citas (aprobar/rechazar) |
| Detalle del vestido con galería y reseñas | **CRUD completo** de inventario |
| Calendario para **agendar citas de prueba** | **Generador de códigos QR** por vestido |
| Favoritos y mis citas | **Simulador de WhatsApp** para recordatorios |
| Módulo **"Completa tu Look"** (cross-selling) | Control de **tintorería y daños** |
| Reseñas reales de clientas | **Estadísticas** de rentabilidad |

---

## 💻 Requisitos

- Un navegador web moderno (Chrome, Firefox, Edge, Safari)
- **No requiere servidor** — todo funciona 100% del lado del cliente
- **No requiere internet** para funcionalidad base (solo para imágenes placeholder y QR)
- **No requiere instalación de dependencias**

---

## 🚀 Instalación y Uso

### 1. Descargar el proyecto
```bash
git clone <tu-repositorio>  # o descarga el ZIP
```

### 2. Abrir en el navegador
Simplemente abre el archivo **`index.html`** en tu navegador:

```bash
# En Windows (doble clic en index.html)
# O desde terminal:
start index.html
```

> ⚠️ **Importante**: Para evitar problemas de CORS con `localStorage`, abre los archivos directamente (protocolo `file://`) o súbelos a cualquier servidor estático (Netlify, Vercel, GitHub Pages, etc.).

### 3. ¡Listo!
La base de datos se inicializa automáticamente en `localStorage` al cargar cualquier página. No necesitas hacer nada más.

---

## 📁 Estructura del Proyecto

```
📦 Nicol-Dress-Rental/
│
├── 📄 index.html              # 🌐 Landing Page (Hero, Slider, Cómo funciona)
├── 📄 catalogo.html           # 🔍 Catálogo con filtros
├── 📄 vestido.html            # 👗 Detalle del vestido + calendario
├── 📄 README.md               # 📖 Este archivo
│
├── 📁 admin/                  # 🔐 Panel de Administración
│   ├── 📄 dashboard.html      # 📊 Métricas, citas, estadísticas, daños
│   ├── 📄 inventario.html     # 📦 CRUD de vestidos + QR
│   └── 📄 scanner.html        # 📷 Escáner QR + ID manual
│
└── 📁 public/
    ├── 📁 css/
    │   ├── 📄 main.css        # Estilos globales (paleta de colores)
    │   ├── 📄 cliente.css     # Estilos del portal cliente
    │   └── 📄 admin.css       # Estilos del panel admin
    │
    ├── 📁 img/                # (vacío - usa imágenes placeholder)
    │
    └── 📁 js/
        ├── 📄 data.js         # 🗄️ Base de datos falsa (15 vestidos, 4 usuarios, reseñas, accesorios)
        ├── 📄 catalogo.js     # 🔎 Filtros combinados + tipo de cuerpo
        ├── 📄 carrito.js      # 👤 Auth, favoritos, citas, calendario, reseñas, cross-selling
        ├── 📄 admin.js        # ⚙️ Dashboard, CRUD, WhatsApp, estadísticas, tintorería
        └── 📄 qr-scanner.js   # 📷 Lector QR con cámara
```

---

## 👗 Guía Rápida para Clientes

### 1. Explorar el catálogo
1. Abre **`index.html`**
2. Haz clic en **"Explorar Catálogo"** o ve a **`catalogo.html`**

### 2. Filtrar vestidos
Usa la barra lateral de filtros:
- **Categoría**: Boda, 15 Años, Graduación, Cóctel
- **Color**: Selecciona por círculos de color
- **Talla**: XS, S, M, L, XL
- **Precio**: Rango mínimo y máximo
- **Tipo de Cuerpo**: ⏳ Reloj de Arena, 🍐 Pera, 🔻 Triángulo Invertido, ▬ Rectángulo
- **Tipo**: Solo Alquiler / Solo Venta

### 3. Ver detalle del vestido
Haz clic en cualquier tarjeta para ver:
- 📸 Galería de fotos con thumbnails
- 📏 Tallas disponibles y tipo de cuerpo recomendado
- ⭐ Reseñas de clientas reales
- 💍 **"Completa tu Look"** — accesorios sugeridos

### 4. Agendar una cita
1. Inicia sesión (ver credenciales abajo)
2. En el detalle del vestido, haz clic en **"Agendar Cita de Prueba"**
3. Selecciona una **fecha** en el calendario interactivo
4. Selecciona un **horario** disponible
5. Confirma la cita

### 5. Gestionar favoritos
- Haz clic en el ❤️ de cualquier tarjeta para agregar/quitar favoritos
- Ve a **"Mis Favoritos"** desde el menú de usuario
- También desde el icono ♡ en la barra de navegación

### 6. Ver mis citas
Desde el menú de usuario (haciendo clic en tu nombre), selecciona **"Mis Citas"** para ver el estado de tus reservas.

---

## ⚙️ Guía Rápida para Administradores

### Acceso al panel
1. Inicia sesión con las credenciales de admin (abajo)
2. Desde el menú de usuario, selecciona **"Panel Admin"**
3. O directamente abre **`admin/dashboard.html`**
4. También hay un botón **"⚙️ Cambiar a Vista Admin"** en el footer

### 📊 Dashboard
- **Métricas rápidas**: Citas hoy, vestidos disponibles, en lavandería, en reparación
- **Citas del día**: Con botón 📲 **WhatsApp** para enviar recordatorio
- **Citas pendientes**: Aprobar ✅ / Rechazar ❌ / Asistió ✅
- **Top 5 más rentados**: Barras animadas con ingresos totales
- **Vestidos en tintorería**: Lista con fecha estimada de retorno
- **Control de daños**: Registro de daños reportados y depósitos a retener

### 📦 Inventario
- **Tabla completa** de todos los vestidos con estado
- **➕ Agregar**: Formulario completo para nuevo vestido
- **✏️ Editar**: Haz clic en el lápiz para modificar cualquier vestido
- **🗑️ Eliminar**: Botón rojo para eliminar del catálogo
- **📱 QR**: Genera un código QR para cada vestido (escanea para ver detalle)
- **Estado inline**: Cambia el estado directamente desde la tabla (disponible, agotado, lavandería, reparación)
- **🔍 Buscar**: Filtro de búsqueda en tiempo real

### 📷 Scanner QR
1. Abre **`admin/scanner.html`**
2. Haz clic en **"Iniciar Cámara"** para escanear QRs
3. O usa **"Ingresar ID Manual"** para buscar por número
4. Al detectar un vestido, puedes **cambiar su estado** directamente

---

## 🎯 Funcionalidades Clave

### 🧬 Filtro por Tipo de Cuerpo
Cada vestido tiene etiquetas de **tipo de cuerpo recomendado**:
| Tipo de Cuerpo | Cortes que Favorecen |
|----------------|---------------------|
| ⏳ **Reloj de Arena** | Sirena, Corte princesa, Ajustado |
| 🍐 **Pera** | Princesa, Evasé, Imperio |
| 🔻 **Triángulo Invertido** | Sirena, Asimétrico, Mini |
| ▬ **Rectángulo** | Princesa, Imperio, Recto |

### 💍 Módulo "Completa tu Look"
En la página de detalle del vestido, se muestran **8 accesorios** sugeridos:
- 👑 Tiara de Cristal ($350)
- 👜 Bolso de Noche ($450)
- 🧣 Chal de Seda ($380)
- 📿 Collar de Perlas ($290)
- 🧤 Guantes Largos ($280)
- 👒 Pamela Elegante ($320)
- 👠 Zapatos Talla 36 ($550)
- 💎 Aretes de Strass ($220)

### ⭐ Reseñas Reales (Social Proof)
Cada vestido muestra reseñas escritas por clientas que ya lo usaron, con fotos reales y calificación de estrellas.

### 🔥 Gatillos de Urgencia
Los vestidos con alta demanda (>20 rentas) y pocas unidades disponibles muestran un badge **"🔥 Alta demanda"** con animación pulsante.

### 📲 Simulador de WhatsApp
Desde el dashboard admin, cada cita del día tiene un botón que abre WhatsApp con un mensaje pre-llenado:
> "¡Hola [Nombre]! Te esperamos mañana a las [Hora] para tu [Tipo de Cita] de [Vestido] en Nicol Dress Rental. 📍 7av 16-21 zona 9, Guatemala."

### 🔄 Switch Rápido Admin/Cliente
En el footer de todas las páginas hay un botón **"⚙️ Cambiar a Vista Admin"** para cambiar entre la vista de cliente y el panel administrativo instantáneamente.

---

## 🔑 Credenciales de Prueba

| Rol | Email | Contraseña | ¿Qué puedes hacer? |
|-----|-------|-----------|-------------------|
| 💼 **Admin** | `admin@boutique.com` | `admin123` | Dashboard, inventario, QR, citas |
| 👩 **Cliente** | `maria@demo.com` | `123456` | Favoritos [1,5,10], citas programadas |
| 👩 **Cliente** | `ana@demo.com` | `123456` | Favoritos [7,8,13], citas programadas |
| 👩 **Cliente** | `carmen@demo.com` | `123456` | Favoritos [4,11], citas programadas |

---

## 🎨 Paleta de Colores Estratégica

La paleta sigue la regla **60-30-10** del diseño visual:

| Color | Código | Uso | Proporción |
|-------|--------|-----|------------|
| Blanco Roto | `#F7F7F7` | Fondo principal | 60% |
| Vino Tinto | `#41110D` | Textos y títulos | Lectura |
| Rojo Óxido | `#5C1F14` | Botones CTA | 10% (acento fuerte) |
| Rosado Claro | `#FFD6DB` | Fondos secundarios | Tarjetas |
| Beige | `#D9C1C1` | Fondos alternos | Tarjetas |
| Acento | `#CCAB9A` | Bordes, filtros | Bordes |
| Acento oscuro | `#8C5E5E` | Badges, etiquetas | Detalles |

---

## 🔧 Detalles Técnicos

### Tecnologías
- **HTML5** semántico
- **CSS3** con variables personalizadas y diseño responsive
- **JavaScript** vanilla (sin frameworks)
- **localStorage** para persistencia de datos
- **sessionStorage** para sesión de usuario

### Base de Datos (localStorage)
El sistema crea automáticamente estas "tablas" en el navegador:

| Tabla | Contenido |
|-------|-----------|
| `db_vestidos` | 15 vestidos con fotos, precios, tallas, tipo_cuerpo |
| `db_usuarios` | 4 usuarios con favoritos |
| `db_citas` | 5 citas de ejemplo con diferentes estados |
| `db_resenas` | 6 reseñas con fotos y calificaciones |
| `db_accesorios` | 8 accesorios para cross-selling |
| `db_danos` | Registro de daños y depósitos |

### Notas
- Las imágenes usan **picsum.photos** (imágenes placeholder)
- Los códigos QR se generan con **api.qrserver.com** (API gratuita)
- El escáner QR usa la **cámara del dispositivo** vía `getUserMedia`
- Para reiniciar los datos demo: abre la consola del navegador y ejecuta:
  ```js
  localStorage.clear(); location.reload();
  ```

---

## 📄 Licencia

Demo educativa y de ventas. Proyecto libre para presentaciones comerciales.

---

*Creado con ❤️ para Nicol Dress Rental — Guatemala*
