# Vietnam 4–21 de febrero de 2027

Itinerario interactivo de quince noches por Vietnam (Sài Gòn, delta del Mekong, Hội An, Huế, Hà Nội, Ninh Bình y bahía de Hạ Long), pensado para el Tết, el Año Nuevo lunar, y publicado como página estática en GitHub Pages.

**Web:** https://andreshere00.github.io/vietnam-trip/

## Vuelos

| Tramo | Salida | Llegada |
| --- | --- | --- |
| Madrid → Ciudad Ho Chi Minh (SGN) | jueves 4 feb · 21:45 | viernes 5 feb · 19:35 |
| Ciudad Ho Chi Minh (SGN) → Madrid | sábado 20 feb · 21:45 | domingo 21 feb · 12:40 |

Horas locales de cada ciudad (Vietnam va 6 h por delante de Madrid). Entre medias hay tres vuelos internos: Sài Gòn → Đà Nẵng (8 feb), Huế → Hà Nội (13 feb) y Hà Nội → Sài Gòn (20 feb).

## Qué incluye

- **Itinerario día a día**, con horarios y notas de cada actividad y una etiqueta con el día del calendario lunar (Giao thừa, Mùng 1… Rằm tháng Giêng).
- **Ruta general** con un mapa de Vietnam, las bases con sus noches y la tabla de etapas (vuelos, coche y tiempo).
- **Un mapa por día** dibujado en SVG, con costa, ríos, lagos, carreteras, pagodas y paradas numeradas en el orden de la ruta, más el islote kárstico de Hạ Long.
- **Leyenda y distancias**: kilómetros y tiempo aproximado de cada tramo, con el total del día y una escala.
- **Opciones de transporte, entradas, comida, alojamiento y Tết** para cada día, con precios estimados. La pestaña «Tết» explica cierres, tradiciones y reservas.
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

No hay dependencias ni paso de compilación. Las únicas peticiones externas son las fuentes de Google Fonts (Playfair Display y Be Vietnam Pro); sin conexión, el navegador usa fuentes de respaldo.

## Cómo está construida

`index.html` contiene el contenido de cada día como HTML y genera mapas, costes y presupuesto con JavaScript a partir de unos bloques de datos al inicio del `<script>`:

| Bloque | Qué define |
| --- | --- |
| `COST` | Costes por evento de cada día (`act`, `trans`, `fly`, `food`), en euros por persona. Se asocian por orden de aparición. |
| `EXTRA` | Gastos del día que no pertenecen a un evento (desayunos, cafés, taxis). |
| `LODGE` y `NOLODGE` | Precio de la habitación doble por noche (se reparte entre dos personas) y días sin noche. |
| `FLIGHT` | Precio del billete Madrid–Sài Gòn por persona, ida y vuelta. Es una estimación: cámbiala por el precio real. |
| `OPTS` | Opciones de transporte, entradas, comida, alojamiento y Tết de cada día. |
| `P` | Puntos del mapa con longitud y latitud. |
| `PLACE`, `PH`, `EVP` | Foto y texto «por qué ir» de cada lugar, créditos de las fotos y lugar asociado a cada evento. |
| `COAST`, `BORDER`, `RIVERS`, `LAKES`, `ISL`, `ROADS`, `GEO` | Geografía del mapa: costa, frontera, ríos, lagos, islotes de Hạ Long, carreteras y rótulos. |
| `MAPS` | Mapa de cada día: encuadre, ruta, etiquetas y modo de transporte (`car`, `walk`, `bike`, `boat`). |
| `OV`, `STAGES` | Mapa y tabla de la ruta general. |

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
- El billete de avión a Vietnam (€850) es una estimación. El presupuesto incluye además tres vuelos internos y 15 noches de alojamiento, con recargo por el Tết.
- No incluye eSIM, seguro, propinas ni compras personales.
- El Tết Đinh Mùi cae el sábado 6 de febrero de 2027 y el 20 de febrero es Rằm tháng Giêng. Según el aviso del Ministerio del Interior vietnamita ([Bộ Nội vụ, 2027](https://cafef.vn/bo-noi-vu-thong-bao-chi-tiet-lich-nghi-tet-am-lich-quoc-khanh-2027-188261010120450778.chn)), el descanso oficial va del 4 al 10 de febrero; los horarios reales de museos y restaurantes cambian, así que conviene comprobarlos unos días antes.
- Los españoles pueden entrar en Vietnam sin visado hasta 45 días (exención vigente hasta marzo de 2028, según [Tuoi Tre News](https://news.tuoitre.vn/vietnam-to-extend-visa-exemption-for-citizens-of-12-countries-until-2028-10385082.htm)). Confírmalo en la web del Ministerio de Exteriores antes de volar.
- Los mapas son esquemas con trazados aproximados. Sirven para orientarse, no para navegar, y la posición de algunos puntos (el delta, la bahía de Hạ Long y el aeropuerto) es aproximada.
- Las fotos son de Wikimedia Commons y se acreditan en [CREDITS.md](CREDITS.md).
