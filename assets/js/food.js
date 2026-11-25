/* Dónde comer en cada zona, por tramos de precio. Lo usa la página comida.html (assets/js/book.js).
   Nivel t: 1 = callejero (hasta ~€5 p. p.), 2 = medio (~€5–15), 3 = especial (más de ~€15).
   Los nombres salen de guías públicas (Michelin, Fodor's, Time Out, Vietnam Airlines, Lonely Planet y prensa vietnamita) y los precios
   son orientativos para una comida por persona. Los locales abren, cierran y cambian de dueño: comprobad el horario en Google Maps.
   Las direcciones se indican solo cuando constan en una fuente; si no, solo el barrio. 1 € ≈ 30.000 ₫. */
var VNFOOD = (function () {
  'use strict';
  var S = function (t, n, k, d, p, a, tag) { return { t: t, n: n, k: k, d: d, p: p, a: a || '', tag: tag || '' }; };
  var ZONES = [
    { id: 'hcm', n: 'Ho Chi Minh', c: '--red', ic: 'location_city', when: '6–8 y 20–21 feb', tet: 1, city: 'Ho Chi Minh City',
      dishes: ['Phở bò', 'Cơm tấm', 'Bánh mì', 'Bánh xèo', 'Ốc (caracoles)'],
      tip: 'La ciudad que más come a todas horas: los puestos de calle y los locales de barrio son lo mejor. En Tết (6–8) muchos locales de barrio cierran; los puestos del centro y los sitios para turistas suelen seguir abiertos.',
      spots: [
        S(1, 'Phở Phượng', 'Phở', 'Sopa de fideos de arroz con ternera, caldo claro y aromático.', '€2–4', 'Distrito 3', 'Michelin Bib Gourmand'),
        S(1, 'Cơm Tấm Ba Ghiền', 'Arroz partido', 'Arroz partido con costilla a la parrilla, huevo y pepinillo. Un clásico local desde los años 90.', '€2–4', 'Phú Nhuận'),
        S(1, 'Bò Kho Gánh', 'Estofado', 'Estofado de ternera especiado, con pan para mojar.', '€2–3', 'Distrito 4', 'Michelin Bib Gourmand'),
        S(1, 'Bún Bò Huế 14B', 'Fideos', 'Sopa picante de ternera estilo Huế, por si no llegáis a Huế con hambre.', '€2–4', 'Distrito 4', 'Michelin Bib Gourmand'),
        S(1, 'Bánh mì Huỳnh Hoa', 'Bocadillo', 'Bocadillo cargado de patés y embutidos, más caro que el de calle pero muy rico.', '€2–3', 'Distrito 1 (Lê Thị Riêng)'),
        S(2, 'Cục Gạch Quán', 'Cocina tradicional', 'Platos del sur en una casa antigua: pescado en cazuela de barro, verduras y sopas ácidas.', '€8–15', 'Distrito 1', 'Michelin Bib Gourmand'),
        S(2, 'Nhà Hàng Ngon', 'Comedor de calle', 'Los puestos más famosos del país en una sola villa colonial. Cómodo para probar varios platos.', '€6–12', 'Distrito 1 (Pasteur)'),
        S(2, 'Bếp Mẹ Ỉn', 'Cocina casera', 'Platos de casa vietnamita con buena presentación; se llena de noche.', '€7–12', 'Distrito 1'),
        S(3, 'Anan Saigon', 'Menú degustación', 'Cocina callejera reinterpretada, con solo ocho asientos alrededor de la cocina. Una estrella Michelin. Reservad con semanas.', '€60–100', 'Distrito 1', 'Estrella Michelin'),
        S(3, 'La Villa', 'Cocina francesa', 'Cena elegante en una villa de Thảo Điền; está a unos 25 min en taxi del Distrito 1.', '€40–70', 'Thảo Điền (Distrito 2)'),
        S(3, 'The Deck Saigon', 'Junto al río', 'Terraza sobre el río con cocina fusión; mejor al atardecer.', '€20–35', 'Thảo Điền (Distrito 2)')
      ] },
    { id: 'mekong', n: 'Delta del Mekong', c: '--jade', ic: 'sailing', when: 'dom 7 feb (excursión)', tet: 1, city: 'My Tho',
      dishes: ['Cá tai tượng (pez oreja de elefante)', 'Hủ tiếu Mỹ Tho', 'Frutas tropicales', 'Dulces de coco'],
      tip: 'La comida suele ir incluida en el tour (en una finca). Si la excursión es por vuestra cuenta, el plato típico es el pez oreja de elefante frito, que se come enrollado con hierbas y arroz.',
      spots: [
        S(1, 'Hủ tiếu Mỹ Tho', 'Fideos', 'Sopa de fideos de la ciudad: la que da nombre al plato. Buscad un comedor lleno de gente del lugar.', '€1–3', 'Mercado de Mỹ Tho'),
        S(1, 'Tortita de caracol de arroz', 'Tentempié', 'Tentempié de puesto en el mercado de Bến Tre o en la isla de Phú Đa.', '€1–2', 'Mercado de Bến Tre'),
        S(2, 'Nhà hàng Chương Dương', 'Marisco y río', 'Restaurante junto al río con el pez oreja de elefante como especialidad; bonito al atardecer.', '€8–15', 'Mỹ Tho (10 đường 30/4)'),
        S(2, 'Thanh Tùng Seafood', 'Pescado de río', 'Sitio sencillo especializado en pescado de río fresco, también pez oreja de elefante.', '€6–12', 'Bến Tre (circunvalación 60)')
      ] },
    { id: 'hoian', n: 'Hội An y Đà Nẵng', c: '--gold', ic: 'festival', when: '8–12 feb', tet: 1, city: 'Hoi An',
      dishes: ['Cao lầu', 'Bánh mì', 'Cơm gà', 'Mì Quảng', 'Bánh bao bánh vạc'],
      tip: 'La mejor ciudad del viaje para comer: bocadillos, fideos propios y cocina de mercado. Hội An sigue abierta en Tết, pero conviene reservar las cenas buenas.',
      spots: [
        S(1, 'Bánh Mì Phượng', 'Bocadillo', 'Su bocadillo es famoso; Anthony Bourdain lo llamó quizá el mejor del país.', '€1,5–2,5', 'Casco antiguo (2B Phan Châu Trinh)'),
        S(1, 'Madam Khánh, «la reina del bánh mì»', 'Bocadillo', 'Bocadillo recién hecho con mucha verdura y sus propias salsas; abre de 6:30 a 19:00.', '€1,5–2,5', '115 Trần Cao Vân'),
        S(1, 'Cao Lầu Thanh', 'Fideos', 'El cao lầu, los fideos gruesos con cerdo y hierbas que solo se hacen aquí; desayuno y comida.', '€2–3', '26 Thái Phiên'),
        S(1, 'Cơm gà Bà Buội', 'Arroz con pollo', 'Arroz amarillo con pollo desmenuzado y cebolla; un plato de Hội An sin muchos secretos.', '€2–3', '22 Phan Châu Trinh'),
        S(2, 'Morning Glory', 'Cocina de la ciudad', 'Cocina local con buena presentación: pato asado y tofu crujiente. Reservad en las cenas.', '€8–15', '106 Nguyễn Thái Học'),
        S(2, 'Bale Well', 'Satay y bánh xèo', 'Comedor concurrido donde os sirven una mesa de platos para enrollar con hierbas: pinchos, bánh xèo y rollitos.', '€5–9', 'Casco antiguo (Trần Hưng Đạo)'),
        S(2, 'Miss Ly', 'Cocina de Hội An', 'Cocina clásica de la ciudad en un local sencillo del casco antiguo.', '€6–12', 'Casco antiguo (Nguyễn Huệ)'),
        S(3, 'Mango Rooms', 'Asia y América', 'Mezcla asiática y latina en un local colorido del casco antiguo; tiene cocteles y carta larga.', '€15–30', 'Casco antiguo (Nguyễn Thái Học)'),
        S(3, 'MÙA', 'Menú degustación', 'Menú degustación centrado en la cosecha de la zona. Reservad con antelación.', '~€35 (1.000.000 ₫)', 'Hội An')
      ] },
    { id: 'hue', n: 'Huế', c: '--hue', ic: 'temple_buddhist', when: '12–13 feb', city: 'Hue',
      dishes: ['Bún bò Huế', 'Bánh khoái', 'Nem lụi', 'Cơm hến', 'Bánh bèo, nậm y lọc'],
      tip: 'La cocina imperial se hizo en pequeñas porciones y muy bien presentadas: la ciudad es de platos pequeños para probar muchos. Muy picante: pedid «ít cay» (poco picante) si lo preferís.',
      spots: [
        S(1, 'Bún bò Huế Bà Rớt', 'Fideos', 'La sopa de ternera picante de Huế, en un local a orillas del río.', '€2–3', 'Huế'),
        S(1, 'Bánh Ép Chị Huệ', 'Tortitas', 'Tortitas crujientes de la ciudad con gambas y cerdo, para mojar en salsa.', '€2–4', 'Calle Nguyễn Du'),
        S(1, 'Bánh khoái Thu Sương', 'Tortitas', 'Bánh khoái: tortita crujiente de arroz con gambas y brotes, muy de Huế.', '€2–4', '86 Kim Long'),
        S(1, 'Nhạn (cơm hến, bánh bèo, nậm y lọc)', 'Platos pequeños', 'Arroz con almejas pequeñas y los bocados de arroz al vapor, el tapeo local.', '€2–4', '115 Mai Thúc Loan'),
        S(2, 'Hanh', 'Especialidades de Huế', 'Para probar a la vez nem lụi (pinchos), bánh khoái y otras especialidades de Huế.', '€5–10', 'Huế'),
        S(2, 'Madame Thu', 'Cocina de Huế', 'Cocina tradicional de Huế para cenar sentados.', '€6–12', 'Huế'),
        S(2, 'Lạc Thiện', 'Cocina de Huế', 'Platos de la zona servidos para compartir en un local tradicional.', '€6–12', 'Huế'),
        S(3, 'Tinh Gia Viên', 'Cocina imperial', 'Cena de cocina imperial en una casa-jardín tradicional, con menús de varios platos.', '€16–40', 'Huế'),
        S(3, 'Ancient Hue', 'Cocina imperial', 'Casa de madera del siglo XIX; el menú de la «cena imperial» es la opción habitual.', '€20–48', 'Huế')
      ] },
    { id: 'hanoi', n: 'Hà Nội', c: '--indigo', ic: 'ramen_dining', when: '13–15 y 17–20 feb', city: 'Hanoi',
      dishes: ['Phở bò', 'Bún chả', 'Chả cá', 'Bánh cuốn', 'Cà phê trứng'],
      tip: 'La capital gastronómica del país: el Old Quarter es una calle de comida tras otra. Muchos puestos abren solo por la mañana o hasta que se agota el caldo. A partir del 17, tras el Tết, ya ha reabierto casi todo.',
      spots: [
        S(1, 'Phở Gia Truyền', 'Phở', 'Phở de ternera con caldo claro desde los años 60, con cola a la hora de desayunar.', '€2–4', 'Bát Đàn', 'Michelin Bib Gourmand'),
        S(1, 'Bún Chả Hương Liên', 'Bún chả', 'Bún chả en la mesa donde cenaron Obama y Bourdain; ahora, con menú «combo Obama».', '€3–6', 'Hai Bà Trưng (Lê Văn Hưu)'),
        S(1, 'Bún Chả Đắc Kim', 'Bún chả', 'Cerdo a la parrilla con fideos y caldo dulce, una de las recomendaciones de Michelin.', '€2–4', 'Hàng Mành'),
        S(1, 'Bánh cuốn Thanh Vân', 'Rollitos de arroz', 'Rollitos de arroz al vapor rellenos de cerdo y setas, para el desayuno.', '€2–3', 'Old Quarter'),
        S(1, 'Café Giảng', 'Café', 'El café con huevo (cà phê trứng) se inventó aquí en 1946. Más un postre que un café.', '€1,5–3', '39 Nguyễn Hữu Huân'),
        S(2, 'Chả Cá Thăng Long', 'Chả cá', 'Pescado con cúrcuma y eneldo que se hace en vuestra mesa, con fideos, cacahuetes y hierbas.', '€7–10', '6B Đường Thành', 'Michelin Bib Gourmand'),
        S(2, 'Quán Ăn Ngon', 'Comedor de calle', 'Los clásicos del país en un comedor; buena opción si queréis probar varios.', '€4–8', 'Varias sucursales'),
        S(2, 'Don Duck', 'Pato', 'Pato en muchas formas, desde el asado hasta el hotpot, en el corazón del Old Quarter.', '€8–14', 'Old Quarter', 'Michelin Bib Gourmand'),
        S(2, 'Tầm Vị', 'Cocina del norte', 'Cocina tradicional del norte con platos de otra época. Reservad.', '€12–20', 'Hà Nội'),
        S(3, 'Gia', 'Menú degustación', 'Menú degustación de unos doce platos con una estrella Michelin; piden un depósito al reservar.', '€40–130 (según menú)', 'Hà Nội', 'Estrella Michelin'),
        S(3, 'La Badiane', 'Franco-vietnamita', 'Cocina francesa con toques vietnamitas en una villa colonial.', '€25–45', 'Hà Nội (Nam Ngư)')
      ] },
    { id: 'ninh', n: 'Ninh Bình', c: '--lotus', ic: 'kayaking', when: '15–16 feb', city: 'Ninh Binh',
      dishes: ['Dê (cabra)', 'Cơm cháy', 'Rượu cần'],
      tip: 'Lo típico es la cabra de montaña (a la plancha, estofada o en rollitos) y el cơm cháy, arroz crujiente. Los restaurantes de la carretera de Tràng An sirven a grupos; en Tam Cốc hay más ambiente.',
      spots: [
        S(1, 'Puestos de Tam Cốc', 'Puestos', 'Phở, bún y bocadillos en los puestos del pueblo; ligero antes de subir a Hang Múa.', '€2–4', 'Tam Cốc'),
        S(2, 'Hiếu Dê', 'Cabra', 'Cabra en varias preparaciones, con buen trato.', '€6–10', 'Tam Cốc'),
        S(2, 'Thăng Long', 'Cabra', 'Cabra a la parrilla, estofada y al limón, cerca de Tràng An.', '€6–10', 'Tràng An'),
        S(2, 'Dũng, Dê Phở Núi', 'Cabra', 'Cabra de montaña; el personal os aconseja qué pedir. En la carretera de Tràng An.', '€6–10', 'Tràng An'),
        S(2, 'Đức Dê', 'Cabra', 'Conocido por los rollitos de cabra; su dueño tiene dos locales.', '€6–10', 'Ninh Bình'),
        S(3, 'Cena en el homestay o el resort', 'Cena tranquila', 'Cena entre arrozales con menú local, que casi siempre se reserva en el alojamiento.', '€15–25', 'Tam Cốc')
      ] },
    { id: 'halong', n: 'Bahía de Hạ Long', c: '--teal', ic: 'sailing', when: '16–17 feb', city: 'Ha Long',
      dishes: ['Chả mực (pastel de calamar)', 'Bánh cuốn chả mực', 'Marisco'],
      tip: 'La cena y el desayuno del crucero van incluidos. En tierra, lo típico es el chả mực, un pastel de calamar machacado a mano. Preguntad antes si cobran por cocinar cada plato.',
      spots: [
        S(1, 'Gốc Bàng', 'Rollitos', 'Bánh cuốn con chả mực, uno de los sitios más antiguos de la ciudad.', '€2–4', 'Bạch Đằng (Callejón 1, calle Nhà Hát)'),
        S(1, 'Hoài Phương', 'Chả mực', 'Pastel de calamar hecho a mano, que citan los vecinos como sitio de referencia.', '€2–4', 'Mercado Hạ Long I'),
        S(1, 'Bà Nú', 'Chả mực', 'El otro sitio que recomiendan los vecinos para el chả mực auténtico.', '€2–4', 'Calle Lý Nhân Tông'),
        S(2, 'Cua Vàng', 'Marisco', 'Marisco con vistas al mar, pastel de calamar y hotpot.', '€8–15', '32 Phan Chu Trinh, Bãi Cháy'),
        S(2, 'Linh Đan', 'Marisco', 'Marisco fresco en el barrio de Bãi Cháy.', '€8–15', '104 Bãi Cháy'),
        S(2, 'Mercado de marisco de Bãi Cháy', 'Elegir y cocinar', 'Elegís el marisco y lo cocinan al momento. Fijad el precio por kilo antes de pedir.', '€7–13', 'Bãi Cháy'),
        S(3, 'Cena de vuestro crucero', 'Incluida', 'En los cruceros de gama media y alta, la cena es un menú de varios platos con marisco.', 'Incluida', 'A bordo')
      ] },
    { id: 'sapa', n: 'Sa Pa', c: '--indigo', ic: 'landscape', when: '18–19 feb', alt: 'sapa', city: 'Sa Pa',
      dishes: ['Salmón y esturión', 'Thắng cố', 'Cerdo negro', 'Setas y verduras de monte'],
      tip: 'Con 3–12 °C apetece comida caliente: los hotpots de pescado de agua fría son la especialidad. Pedid siempre el precio del hotpot antes de empezar.',
      spots: [
        S(1, 'Puestos de pinchos y boniatos', 'Puestos', 'Pinchos a la parrilla, huevos de codorniz y boniato asado cerca del mercado: para entrar en calor.', '€1–3', 'Centro de Sa Pa'),
        S(2, 'Thắng Cố A Quýnh', 'Hotpot', 'Hotpot de salmón y esturión, con actuaciones los viernes y domingos por la noche.', '€5–12', 'Sa Pa'),
        S(2, 'Red Dao House', 'Cocina de las etnias', 'En una casa de estilo dao rojo, de camino a la cascada Thác Bạc; el salmón con maracuyá es su plato.', '€8–15', '4B Thác Bạc'),
        S(2, 'Cá Tầm Vua Sapa', 'Esturión', 'Especializado en el hotpot y el sashimi de esturión.', '€10–15', 'Sa Pa')
      ] },
    { id: 'hagiang', n: 'Hà Giang y Đồng Văn', c: '--indigo', ic: 'two_wheeler', when: '16–19 feb', alt: 'hagiang', city: 'Ha Giang',
      dishes: ['Bánh cuốn', 'Phở chua', 'Thắng cố', 'Thắng dền', 'Xôi cinco colores'],
      tip: 'En el Loop, el alojamiento suele incluir la cena y el desayuno en un homestay. Los mercados de domingo de Đồng Văn y Mèo Vạc son el mejor sitio para probar la cocina local.',
      spots: [
        S(1, 'Bánh cuốn de la señora Hà', 'Rollitos', 'Rollitos de arroz al vapor en el casco antiguo de Hà Giang.', '€1–3', '31 Phố Cổ, Hà Giang'),
        S(1, 'Mercado de Đồng Văn (domingo)', 'Mercado', 'Desayuno de mercado: thắng cố, thắng dền (dulce) y xôi de colores.', '€1–4', 'Đồng Văn'),
        S(1, 'Bà Tư Lan', 'Cocina local', 'Local con especialidades de la zona, entre ellas el thắng cố.', '€2–5', 'Đồng Văn (125, grupo 3)'),
        S(2, 'Cena de homestay', 'Casera', 'Mesa familiar con arroz, cerdo, verduras de monte y rượu de maíz: casi siempre se incluye.', '€5–9', 'Du Già y Đồng Văn')
      ] },
    { id: 'maichau', n: 'Mai Châu', c: '--lotus', ic: 'agriculture', when: '18 feb (excursión)', alt: 'maichau', city: 'Mai Chau',
      dishes: ['Cơm lam', 'Pescado de arroyo a la parrilla', 'Pollo de colina', 'Xôi de colores'],
      tip: 'La cocina de los thai blancos se come en esteras, en una casa sobre pilotes. Si vais de excursión, la comida suele ir incluida en el valle.',
      spots: [
        S(1, 'Puestos del mercado de Mai Châu', 'Puestos', 'Pinchos a la parrilla y xôi de colores para llevar.', '€1–3', 'Mai Châu'),
        S(2, 'Comida en un homestay del valle', 'Casera', 'Comida sobre pilotes con pollo de colina, pescado y cơm lam; se reserva en el alojamiento o con el guía.', '€6–10', 'Bản Lác y Pom Coong')
      ] },
    { id: 'catba', n: 'Cát Bà', c: '--teal', ic: 'directions_boat', when: '16–17 feb', alt: 'catba', city: 'Cat Ba',
      dishes: ['Marisco al momento', 'Ghẹ (cangrejo azul)', 'Mực (calamar)'],
      tip: 'En el puerto elegís el marisco vivo y lo cocinan. Preguntad el precio por kilo y que lo pesen delante de vosotros.',
      spots: [
        S(1, 'Puestos del puerto de Cát Bà', 'Puestos', 'Fideos, bánh mì y tentempiés para el desayuno de la salida.', '€2–4', 'Cát Bà'),
        S(2, 'Marisco del puerto', 'Elegir y cocinar', 'Restaurantes junto al puerto donde elegís el marisco vivo y lo cocinan en el momento.', '€8–15', 'Cát Bà')
      ] },
    { id: 'dalat', n: 'Đà Lạt', c: '--jade', ic: 'local_florist', when: 'dom 7 feb (excursión)', alt: 'dalat', tet: 1, city: 'Da Lat',
      dishes: ['Bánh tráng nướng', 'Nem nướng', 'Bánh căn', 'Lẩu gà lá é'],
      tip: 'Con noches frescas se come caliente: la «pizza vietnamita» (bánh tráng nướng) y el hotpot de pollo con hierbas. Muchos sitios de Đà Lạt abren de tarde.',
      spots: [
        S(1, 'Bánh tráng nướng Dì Đinh', 'Pizza vietnamita', 'La tortita de arroz a la brasa con huevo y cebolleta, para comer de pie.', '€1–2', 'Đà Lạt'),
        S(1, 'Bánh tráng nướng Chị Huyền', 'Pizza vietnamita', 'Otra versión de la tortita, en la calle Nha Chung.', '€1–2', 'Calle Nha Chung'),
        S(1, 'Bánh căn Cô Thương', 'Bánh căn', 'Pequeños bizcochos de arroz a la plancha, con huevo o marisco.', '€2–3', 'Đà Lạt'),
        S(1, 'Hạnh Tâm Bún và Nem Nướng', 'Nem nướng', 'Pinchos de cerdo a la parrilla para envolver en papel de arroz con verduras.', '€2–4', 'Đà Lạt'),
        S(2, 'Lẩu gà lá é', 'Hotpot', 'Hotpot de pollo con hierba lá é, la especialidad para las noches frescas; se encuentra en muchos locales del centro.', '€5–10', 'Centro de Đà Lạt'),
        S(3, 'Le Rabelais', 'Alta cocina francesa', 'Alta cocina en el Dalat Palace Heritage Hotel, de las mejores mesas de la ciudad.', '€30–60', 'Dalat Palace Heritage Hotel')
      ] }
  ];
  var TIERS = [
    { t: 1, k: '€', n: 'Callejero', ic: 'ramen_dining', d: 'Puestos y locales de barrio. Se come por menos de ~€5 por persona.', z: '--jade' },
    { t: 2, k: '€€', n: 'Medio', ic: 'restaurant', d: 'Restaurantes sentados, con carta, de ~€5 a ~€15 por persona.', z: '--gold' },
    { t: 3, k: '€€€', n: 'Especial', ic: 'wine_bar', d: 'Cenas con reserva, menús degustación o vistas, desde ~€15 por persona.', z: '--red' }
  ];
  return { ZONES: ZONES, TIERS: TIERS };
})();
