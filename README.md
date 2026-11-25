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
- **Iconografía**: símbolos (✈️ vuelos, 🍜 comida, 🛕 templos, 🏛️ museos, 🛍️ compras, 🍹 fiesta, 🎯 tiro, 🚗 traslados…) en eventos, costes, pestañas, opciones y secciones, para leer el itinerario de un vistazo. Se asignan por palabras clave del título en `index.html` (bloque «Iconografía»).
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
├── index.html   # toda la web: HTML, CSS y JavaScript en un solo archivo
├── assets/img/  # fotos de los lugares (Wikimedia Commons, ≤ 800 px)
├── CREDITS.md   # autores y licencias de las fotos
├── .nojekyll    # evita el procesado con Jekyll en GitHub Pages
├── .gitignore
└── README.md
```

No hay paso de compilación. Las peticiones externas son las fuentes de Google Fonts (Playfair Display y Be Vietnam Pro), Leaflet 1.9.4 desde unpkg (con integridad SRI) y las teselas de OpenStreetMap; sin conexión, el navegador usa fuentes de respaldo y los mapas SVG.

## Cómo está construida

`index.html` contiene el contenido de cada día como HTML y genera mapas, costes y presupuesto con JavaScript a partir de unos bloques de datos al inicio del `<script>`:

| Bloque | Qué define |
| --- | --- |
| `COST` | Costes por evento de cada día (`act`, `trans`, `fly`, `food`), en euros por persona. Se asocian por orden de aparición. |
| `EXTRA` | Gastos del día que no pertenecen a un evento (desayunos, cafés, taxis). |
| `LODGE` y `NOLODGE` | Precio de la habitación doble por noche (se reparte entre dos personas) y días sin noche. |
| `FLIGHT` | Precio del billete Madrid–Ho Chi Minh por persona, ida y vuelta (€460, ya comprado). |
| `OPTS` | Opciones de transporte, entradas, comida, alojamiento y Tết de cada día. |
| `P` | Puntos del mapa con longitud y latitud. |
| `PLACE`, `PH`, `EVP` | Foto y texto «por qué ir» de cada lugar, créditos de las fotos y lugar asociado a cada evento. |
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

- Precios en euros por persona, suponiendo dos viajeros que comparten taxi, coche y habitación, y un cambio de 1 € ≈ 30.000 ₫. Son estimaciones y conviene confirmarlos en las webs oficiales antes de viajar.
- El billete de avión a Vietnam (€460 por persona, ya comprado) va aparte del total diario. El presupuesto incluye además tres vuelos internos y 15 noches de alojamiento, con recargo por el Tết.
- No incluye eSIM, seguro, propinas ni compras personales.
- El Tết Đinh Mùi cae el sábado 6 de febrero de 2027 y el 20 de febrero es Rằm tháng Giêng. Según el aviso del Ministerio del Interior vietnamita ([Bộ Nội vụ, 2027](https://cafef.vn/bo-noi-vu-thong-bao-chi-tiet-lich-nghi-tet-am-lich-quoc-khanh-2027-188261010120450778.chn)), el descanso oficial va del 4 al 10 de febrero; los horarios reales de museos y restaurantes cambian, así que conviene comprobarlos unos días antes.
- Los españoles pueden entrar en Vietnam sin visado hasta 45 días (exención vigente hasta marzo de 2028, según [Tuoi Tre News](https://news.tuoitre.vn/vietnam-to-extend-visa-exemption-for-citizens-of-12-countries-until-2028-10385082.htm)). Confírmalo en la web del Ministerio de Exteriores antes de volar.
- Los precios de las alternativas son estimaciones. El campo de tiro de Củ Chi cobra la bala aparte (unos 60.000 ₫) y la edad mínima varía según el operador; el paquete de Hà Giang con easy rider ronda los US$150–425 según grupo y alojamiento; Bhaya/The Au Co se anuncian como ecológicos, pero conviene confirmarlo con el operador. Fuentes: [Cu Chi Tunnels, shooting range price list](https://www.thisboundlessworld.com/?p=2850), [Bhaya Cruises](https://vietnam.travel/things-to-do/sustainable-cruising-bhaya-cruises), [Linh Phuoc Pagoda](https://vietnamdiscovery.com/dalat/attractions/linh-phuoc-pagoda/).
- Los mapas son esquemas con trazados aproximados. Sirven para orientarse, no para navegar, y la posición de algunos puntos (el delta, la bahía de Hạ Long y el aeropuerto) es aproximada.
- Las fotos son de Wikimedia Commons y se acreditan en [CREDITS.md](CREDITS.md).
