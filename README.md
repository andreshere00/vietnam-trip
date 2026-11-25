# Vietnam 5–21 de febrero de 2027

Itinerario interactivo de quince noches por Vietnam (Ho Chi Minh, delta del Mekong, Hội An, Huế, Hà Nội, Ninh Bình y bahía de Hạ Long), pensado para el Tết, el Año Nuevo lunar, y publicado como página estática en GitHub Pages.

**Web:** https://andreshere00.github.io/vietnam-trip/

## Vuelos

| Tramo | Salida | Llegada |
| --- | --- | --- |
| Madrid → Ciudad Ho Chi Minh (SGN) | viernes 5 feb · 00:40 | sábado 6 feb · 01:10 |
| Ciudad Ho Chi Minh (SGN) → Madrid | domingo 21 feb · 02:30 | domingo 21 feb · 20:30 |

Horas locales de cada ciudad (Vietnam va 6 h por delante de Madrid). La ida dura 18 h 30 min y la vuelta 24 h; se sale de casa la noche del jueves 4 y se aterriza en Vietnam ya en mùng 1, tras la medianoche del Tết. Entre medias hay tres vuelos internos: Ho Chi Minh → Đà Nẵng (8 feb), Huế → Hà Nội (13 feb) y Hà Nội → Ho Chi Minh (20 feb).

## Qué incluye

- **Noche de fiesta** en el plan base (jueves 18, Old Quarter de Hà Nội) y **Củ Chi + campo de tiro + Mekong** el domingo 7.
- **Iconografía con Material Symbols** (Google Fonts) en eventos, costes, pestañas, opciones, flechas y secciones, para leer el itinerario de un vistazo. Se asignan por palabras clave del título en `index.html` (bloque «Iconografía»).
- **Página «Línea de tiempo»** (`itinerario.html`, enlazada desde la barra y el menú): cada día es un tramo de una línea de tiempo con sus paradas numeradas, y a la derecha un mapa fijo que sigue al día que se lee (o al pulsar su cabecera o un número). «Mi elección» muestra el plan con las alternativas que habéis elegido en la web principal (la elección se comparte por `localStorage`); «Plan base» las ignora. Cada día lleva «Otras opciones» con todas las alternativas y extras como ramas, con su minilínea de tiempo y un botón «Ver en el mapa» para previsualizar su recorrido (línea y pines discontinuos). Las paradas de las alternativas que no están en el plan base son aproximadas. Cada parada con lugar conocido lleva una **miniatura** que se agranda y muestra su autor y licencia al abrir el evento; las alternativas (Sa Pa, Hà Giang, Cát Bà, Đà Lạt, Bà Nà, etc.) usan 22 fotos propias (`XIMG`). En móvil el mapa queda fijo arriba y se puede plegar.
- **Reservar y descargar** (sección «Reservar» de la web principal y menú de reservas de la línea de tiempo): tres páginas que dependen de las alternativas elegidas.
  - **Estancia** (`estancia.html`): cada tramo de alojamiento (con fechas de entrada y salida) con **4 categorías de precio** por habitación triple (económico, medio = plan base, confort, superior), 3 en homestays de montaña y en el crucero. Cada categoría abre una búsqueda en Booking.com con fechas, tres personas y rango de precio ya puestos, y otra en Google Hoteles. Muestra el coste por persona y la diferencia con el presupuesto.
  - **Transporte** (`transporte.html`): cada traslado del itinerario (vuelos internos, tren, autobús, coche, Grab) con **2–3 opciones**, precio, duración y enlaces de compra (Google Flights/Skyscanner y aerolínea, Vietnam Railways y Vexere, 12Go, Klook, Grab). Para los trenes indica cuándo se abre la venta (unos 60 días antes). Incluye una tarjeta de **seguro de viaje** con tres niveles (Esencial, Completo, Premium), enlaces a las webs de IATI, Intermundial, Heymondo, Mapfre y Allianz, avisos según las alternativas elegidas (moto en Hà Giang, trekking en Fansipan) y una casilla «Contratado» que cuenta como una reserva más.
  - **Eventos** (`eventos.html`): entradas y excursiones del itinerario elegido, con el mejor sitio para comprar cada una (web oficial cuando existe, o GetYourGuide, Viator y Klook), y lo que se paga en la taquilla. Filtro «Por reservar» / «En la entrada».
  - Cada ficha tiene una casilla «Reservado» (se guarda en `localStorage`), y la línea de tiempo añade a cada día un bloque «Reservar para este día».
  - **Descargar itinerario**: icono de descarga (⬇) en la barra superior de la web principal, de la línea de tiempo y de las páginas de reservas, y botón en la sección «Reservar». Ofrece calendario `.ics` (Google, Apple, Outlook; horas locales de cada lugar, y los alojamientos como eventos de día completo) y texto `.txt`, ambos con las alternativas elegidas.
- **Menú modal de secciones** (botón de cuadrícula en la barra superior): Ruta, Actividades, Alternativas, Presupuesto y Notas, cada una con su icono y un dato en vivo (marcadas, elegidas, total).
- **Elección predilecta por defecto**: la web se abre con **Sa Pa + Fansipan (18–19)** y **copas en Hội An/Đà Nẵng (jueves 11)** ya elegidas, marcadas con ★ «Predilecta». Se cambian en cualquier momento y el botón «Restaurar elección recomendada» vuelve a ellas. Se definen con `pref: true` en `ALTS`.
- **Clima por zona** (medias históricas de febrero, no una previsión): cada día lleva una insignia con el rango de temperatura y, al abrirlo, una ficha con el tipo de tiempo (calor seco, calor húmedo, fresco con lloviznas, frío con niebla…), temperatura, humedad, lluvia y qué ropa llevar. Cada caso tiene su icono y su color; las alternativas que cambian de zona (Sa Pa, Hà Giang, Mai Châu, Đà Lạt, Bà Nà) cambian también el clima. La ruta general muestra el rango de cada base. Los datos están en el bloque `WX` de `index.html`.
- **Barra de días**: la rueda del ratón sobre la barra la desplaza en horizontal; en el resto de la página, en vertical.
- **Plegar y desplegar**: los días empiezan plegados con un resumen de horas y actividades; se despliegan pulsando la cabecera, desde la barra de días o con «Desplegar todos / Plegar todos». Hay vista «Detallado» o «Compacto» (solo hora y título), y las secciones Ruta, Actividades, Alternativas y Presupuesto también se pliegan. El estado se guarda en el navegador.
- **Itinerario día a día**, con horarios y notas de cada actividad y una etiqueta con el día del calendario lunar (Giao thừa, Mùng 1… Rằm tháng Giêng).
- **Ruta general** con un mapa de Vietnam, las bases con sus noches y la tabla de etapas (vuelos, coche y tiempo).
- **Cada día en dos columnas**: a un lado el mapa (más pequeño y fijo al hacer scroll) y al otro un panel «Opciones del día» (plan base o alternativas con botones de opción, y extras con casillas), el itinerario y la «Información práctica» plegable. En móvil se apilan.
- **Mapas reales** con Leaflet y teselas de OpenStreetMap: ruta del día, pines numerados por tipo de lugar, distancias por tramo y botón «Abrir en Google Maps» con la ruta. Si Leaflet no carga (sin conexión), se dibujan los esquemas SVG de respaldo.
- **Leyenda y distancias**: kilómetros y tiempo aproximado de cada tramo, con el total del día y una escala.
- **Opciones de transporte, entradas, comida, alojamiento y Tết** para cada día, con precios estimados. La pestaña «Tết» explica cierres, tradiciones y reservas.
- **Lista de actividades** por ciudad (sección «Actividades»): todas las visitas y entradas del plan, con checkbox para marcar las que queréis hacer y las alternativas, que se eligen desde la misma lista. Se guarda en el navegador.
- **Alternativas y extras elegibles en cada uno de los 17 días** (panel «Cambiar o añadir en este día» y sección «Alternativas»), por ejemplo: compras en Hội An, Hà Nội y Ho Chi Minh; fiesta en Hội An/Đà Nẵng, Hà Nội y Bùi Viện; solo Củ Chi y tiro o solo el Mekong (el plan base del 7 ya combina Củ Chi, campo de tiro y Mekong), Đà Lạt con la pagoda de las botellas (Linh Phước); crucero eco en Lan Hạ y Cát Bà; Mai Châu, Sa Pa y Hà Giang Loop. Además hay extras y cambios para los demás días (masaje, cena en barco, Bà Nà Hills, Cù Lao Chàm, tren a Huế, Tam Cốc, Bái Đính…). Para evitar el traslado con maletas del 12, hay «Huế en un día desde Hội An» (sin cambiar de hotel; el 13 se vuela de Đà Nẵng) y «Enviar las maletas por delante». También hay un plan B por el Tết para los días 6–9 (templos, museos y excursiones cerrados): miradores y centros comerciales, delta en coche privado, día de ciudad y Hội An sin tiendas. Cada una indica su efecto en el presupuesto, que se recalcula, y la elección se guarda en el navegador.
- **Presupuesto** por día y total (entradas, transporte, vuelos internos, comida y alojamiento), por persona.
- **Fotos y fichas «por qué ir»** de casi cada evento (45 fotos distintas): miniatura en el itinerario y ficha emergente al pasar el ratón, enfocar o tocar un pin del mapa o un evento.
- **Recorrido día a día**: la navegación fija marca el día visible, muestra el progreso del scroll y cada tarjeta enlaza con el día siguiente.
- **Modo nocturno** con botón en la barra, que recuerda tu elección y respeta la preferencia del sistema.
- **Diseño adaptado al móvil**: mapas, tablas y fichas se adaptan a pantallas estrechas (la ficha se muestra como panel inferior).

## Estilo

La paleta sale de la bandera de Vietnam —rojo y amarillo de la estrella— sobre un fondo crema de papel, con verde jade, turquesa de la bahía, índigo, loto y púrpura de Huế como colores de apoyo; cada zona del viaje tiene el suyo. Los titulares usan **Playfair Display** y el texto **Be Vietnam Pro**, una tipografía pensada para los signos diacríticos del vietnamita. Los farolillos, los karst y el junco de la cabecera son SVG propios.

## Estructura

```
.
├── index.html   # la web principal: HTML, CSS y JavaScript
├── itinerario.html  # página aparte: línea de tiempo con las alternativas y un mapa
├── estancia.html, transporte.html, eventos.html  # páginas de reservas según el itinerario elegido
├── assets/js/data.js  # datos compartidos del viaje (lugares, mapas, alternativas, costes)
├── assets/js/book.js  # reservas (alojamiento, traslados, eventos) y descarga del itinerario
├── assets/css/sub.css # estilos de las páginas de reservas
├── assets/img/  # fotos de los lugares (Wikimedia Commons, ≤ 800 px)
├── CREDITS.md   # autores y licencias de las fotos
├── .nojekyll    # evita el procesado con Jekyll en GitHub Pages
├── .gitignore
└── README.md
```

No hay paso de compilación. Las peticiones externas son las fuentes de Google Fonts (Playfair Display, Be Vietnam Pro y los iconos Material Symbols), Leaflet 1.9.4 desde unpkg (con integridad SRI) y las teselas de OpenStreetMap; sin conexión, el navegador usa fuentes de respaldo y los mapas SVG.

## Cómo está construida

`index.html` contiene el contenido de cada día como HTML y genera mapas, costes y presupuesto con JavaScript a partir de unos bloques de datos. Los bloques `NAMES`, `COST`, `P`, `MAPS`, `PLACE`, `PH`, `XIMG`, `EVP` y `ALTS` viven en `assets/js/data.js` (los comparte con `itinerario.html`, que además lee el texto de cada día de `index.html` y guarda en su propio `<script>` las coordenadas aproximadas `XP` y la tabla `AG` con el punto de cada evento de las alternativas); el resto, al inicio del `<script>` de `index.html`:

| Bloque | Qué define |
| --- | --- |
| `COST` | Costes por evento de cada día (`act`, `trans`, `fly`, `food`), en euros por persona. Se asocian por orden de aparición. |
| `EXTRA` | Gastos del día que no pertenecen a un evento (desayunos, cafés, taxis). |
| `LODGE` y `NOLODGE` | Precio de la habitación doble por noche y días sin noche. Con `PAX = 3` se cobra como triple (+30 %, `TRIPLE`) y se reparte entre tres. |
| `FLIGHT` | Precio del billete Madrid–Ho Chi Minh por persona, ida y vuelta (€460, ya comprado). |
| `OPTS` | Opciones de transporte, entradas, comida, alojamiento y Tết de cada día. |
| `P` | Puntos del mapa con longitud y latitud. |
| `PLACE`, `PH`, `XIMG`, `EVP` | Foto y texto «por qué ir» de cada lugar, créditos de las fotos, fotos de los puntos que solo salen en alternativas y lugar asociado a cada evento. |
| `COAST`, `BORDER`, `RIVERS`, `LAKES`, `ISL`, `ROADS`, `GEO` | Geografía del mapa: costa, frontera, ríos, lagos, islotes de Hạ Long, carreteras y rótulos. |
| `MAPS` | Mapa de cada día: encuadre, ruta, etiquetas y modo de transporte (`car`, `walk`, `bike`, `boat`). |
| `OV`, `STAGES` | Mapa y tabla de la ruta general. |
| `ALTS` | Alternativas y extras: `kind` (`swap` sustituye el plan base de esos días, `add` añade actividades), eventos con hora y coste, gastos sueltos y precio de la habitación. `noadd` impide combinarlas con extras y `req` exige elegir otra antes. |

Las distancias se calculan con la fórmula de Haversine sobre la ruta, multiplicadas por un factor para aproximar el trazado por carretera. Se puede fijar una velocidad media por mapa con `speed` (por ejemplo, en el paso de Hải Vân).

### Editar el itinerario

1. Cambia el texto del evento en la sección del día (`<section class="day" id="...">`).
2. Ajusta su coste en `COST` (el orden del array es el de los eventos) y su lugar en `EVP`.
3. Si cambia una parada, edita su punto en `P`, la ruta del día en `MAPS` y, si tiene foto, su entrada en `PLACE`.
4. Abre `index.html` en el navegador y comprueba el mapa, la leyenda y el presupuesto.

## Probar en local

Abre `index.html` directamente en el navegador, o sirve la carpeta:

```bash
python3 -m http.server 8000
```

Después visita http://localhost:8000.

## Despliegue

La web se publica desde la rama `main`, carpeta raíz, con GitHub Pages. Cada `git push` a `main` la actualiza en uno o dos minutos.

## Supuestos y límites

- Precios en euros por persona, suponiendo tres viajeros (`PAX = 3`) que comparten taxi, coche y habitación triple (la doble +30 %); el transporte en coche o taxi sale a un tercio por persona (2/3 de lo previsto para dos), y un cambio de 1 € ≈ 30.000 ₫. Son estimaciones y conviene confirmarlos en las webs oficiales antes de viajar.
- El billete de avión a Vietnam (€460 por persona, ya comprado) va aparte del total diario. El presupuesto incluye además tres vuelos internos y 15 noches de alojamiento, con recargo por el Tết.
- No incluye eSIM, seguro (los precios de la tarjeta de seguro son rangos orientativos para 17 días, sin cotizar), propinas ni compras personales.
- El Tết Đinh Mùi cae el sábado 6 de febrero de 2027 y el 20 de febrero es Rằm tháng Giêng. Según el aviso del Ministerio del Interior vietnamita ([Bộ Nội vụ, 2027](https://cafef.vn/bo-noi-vu-thong-bao-chi-tiet-lich-nghi-tet-am-lich-quoc-khanh-2027-188261010120450778.chn)), el descanso oficial va del 4 al 10 de febrero; los horarios reales de museos y restaurantes cambian, así que conviene comprobarlos unos días antes.
- Los españoles pueden entrar en Vietnam sin visado hasta 45 días (exención vigente hasta marzo de 2028, según [Tuoi Tre News](https://news.tuoitre.vn/vietnam-to-extend-visa-exemption-for-citizens-of-12-countries-until-2028-10385082.htm)). Confírmalo en la web del Ministerio de Exteriores antes de volar.
- Los precios de las alternativas son estimaciones. El campo de tiro de Củ Chi cobra la bala aparte (unos 60.000 ₫) y la edad mínima varía según el operador; el paquete de Hà Giang con easy rider ronda los US$150–425 según grupo y alojamiento; Bhaya/The Au Co se anuncian como ecológicos, pero conviene confirmarlo con el operador. Fuentes: [Cu Chi Tunnels, shooting range price list](https://www.thisboundlessworld.com/?p=2850), [Bhaya Cruises](https://vietnam.travel/things-to-do/sustainable-cruising-bhaya-cruises), [Linh Phuoc Pagoda](https://vietnamdiscovery.com/dalat/attractions/linh-phuoc-pagoda/).
- El clima son medias históricas aproximadas de febrero (temperatura, humedad y días de lluvia por zona) y puede variar mucho de un año a otro; consulta la previsión unos días antes de salir.
- Los mapas son esquemas con trazados aproximados. Sirven para orientarse, no para navegar, y la posición de algunos puntos (el delta, la bahía de Hạ Long y el aeropuerto) es aproximada.
- Reservas: los enlaces son de búsqueda o de la web de cada proveedor, sin comisiones ni afiliación. Se comprobó que existen la web de entradas de Huế (`eticket.hueworldheritage.org.vn`), la de Vietnam Railways (`dsvn.vn`) y las fichas de Klook, Booking.com y Headout enlazadas; las demás (Teatro Thăng Long, Skydeck, 12Go, Vexere, Grab, Xanh SM, eSIM y las aseguradoras) son direcciones habituales que conviene comprobar; las coberturas, los precios y el plazo para contratar la anulación (a menudo 24 h–7 días tras reservar) dependen de cada póliza. Las entradas del Fansipan y de Bà Nà enlazan a la guía de compra de Sun World (Sun Paradise Land), cuyo carácter oficial no se pudo confirmar. Los precios de alojamiento, transporte y excursiones son rangos orientativos; las categorías de hotel usan umbrales de precio de la habitación triple. Los billetes de tren se abren «unos 60 días» antes según las fuentes consultadas ([Seat61](https://seat61.com/Vietnam.htm), 12Go). Los precios típicos de los cruceros de Hạ Long (US$110–320 por persona y noche según categoría) son más altos que los ~€87 por persona que cuenta el presupuesto base.
- Las fotos son de Wikimedia Commons y se acreditan en [CREDITS.md](CREDITS.md).
