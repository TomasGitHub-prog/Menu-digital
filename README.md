# Sunsets Beach – prototipo de portada y carta

Ejemplo para el pitch, estilo "Playa y atardecer". Son dos páginas que comparten estilo y datos. Se abre con doble clic en `index.html` (necesita internet solo para las tipografías de Google Fonts).

## Archivos
- `index.html`: portada (info del local, horario, cómo llegar, reservar, botón "Ver la carta"). Incluye datos estructurados `Restaurant` para Google y un estado "Abierto ahora / Cerrado ahora" calculado con la hora de Mallorca (constantes de horario al inicio de `portada.js`).
- `carta.html`: carta con pestañas Comida / Bebidas, selección de platos con total aproximado y alérgenos.
  - Los alérgenos se escriben en cursiva bajo cada plato. Un interruptor los muestra u oculta.
  - Botón **Filtros**: "Mi dieta" (vegetariano, vegano, sin gluten, sin lactosa) y "Evitar alérgenos". Los platos que no encajan se atenúan, no se ocultan, para no sugerir que el resto es seguro. "Sin gluten" y "sin lactosa" se deducen de los alérgenos; vegetariano y vegano son datos del plato (`DIET` en `data.js`).
  - Los filtros, el interruptor y el idioma se recuerdan en el navegador del cliente (`localStorage`).
  - **Buscador** de platos y bebidas (sin distinguir tildes ni mayúsculas; también busca por nombre de categoría).
  - **Selección** con cantidades y total aproximado, en un panel desplegable (flecha y texto "Ver detalle").
  - **Favoritos de la casa:** tarjetas arriba de la carta; al tocar una, salta al plato (lista `STARS` en `data.js`). Selección orientativa, a confirmar con el restaurante.
  - **Modo camarero:** pantalla completa con los platos elegidos, siempre en español y con la traducción debajo, más los alérgenos y la dieta que el cliente quiere evitar. No envía ningún pedido.
- `style.css`: colores (claro y oscuro, gama de azules con el atardecer como único elemento cálido) y tipografías en variables CSS al inicio. Para cambiar de estilo por restaurante, se tocan esas variables.
- `data.js`: textos (es / en), alérgenos y toda la carta (`MENU`). Cada plato es `[nombre es, descripción es, nombre en, descripción en, precio, porPersona, alérgenos]`.
- `portada.js`, `carta.js`: lógica de cada página.

## Idioma
La primera vez se elige según el navegador del cliente: español o catalán → español; inglés → inglés; cualquier otro (alemán, francés…) → inglés, hasta que existan esas traducciones. Si el cliente elige un idioma, se recuerda.

## De dónde salen los datos
Nombres y precios: carta publicada en mallorca-touristguide.co.uk (versión en español, 4-10-2026). Horario y contacto: esa misma web. Valoración, precio medio y servicios: ficha de Google Maps. Las descripciones y las traducciones al inglés están reescritas. No se ha usado ninguna foto de terceros.

## Pendiente
- **Alérgenos orientativos:** asignados por criterio culinario, hay que confirmarlos con el restaurante. La carta lleva un aviso visible; para quitarlo, borrar la línea `demo-note` en `renderControls()` de `carta.js`.
- **WhatsApp:** el botón usa el teléfono fijo (971 76 96 05), que probablemente no tiene WhatsApp. Confirmar con el dueño (constante en `waLink()` de `data.js`).
- **Fotos:** la portada tiene tres huecos "Foto del local". Las aporta el dueño.
- Catalán, alemán y francés: desactivados en el selector.
- Revisar con el dueño nombres de bebidas y marcas (se corrigieron erratas evidentes de la fuente).

## Tema
Oscuro por defecto (más acorde con el local de playa y atardecer). El claro se elige en Filtros → Tema y se recuerda (`sb-theme`).

## Resumen inferior y ficha de plato
- El resumen de la selección tiene tres estados (cerrado, abierto, ampliado): se cambian tocando o arrastrando el asa.
- **Ficha de plato** (opcional): `FICHAS_ON` y `DETAIL` en `data.js`. Al tocar un plato con ficha se abre una hoja con foto, descripción corta, ingredientes y alérgenos. Ejemplo: Paella ciega. La foto (`plato-paella-ciega.jpg`) es de ejemplo y viene de Google Maps: no se publica en GitHub; sin ella la ficha muestra "Foto próximamente". Sustituir por una foto propia del restaurante.
