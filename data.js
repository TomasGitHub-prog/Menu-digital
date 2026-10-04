const UI = {
  es: {
    tagline: "Cocina mediterránea frente a la playa",
    hours: "Abierto de 11:30 a 22:00", closed: "Cerrado los miércoles",
    rating: "4,1 en Google (200 opiniones)", avg: "20–30 € por persona",
    reserve: "Reservar por WhatsApp", route: "Cómo llegar", drinks: "Bebidas y vinos",
    contact: "También puedes llamar al 971 76 96 05",
    waText: "Hola, quiero reservar mesa en Sunsets Beach. Día: __ Hora: __ Personas: __ Nombre: __",
    pp: "por persona", glass: "Copa", bottle: "Botella",
    sel1: "plato elegido", selN: "platos elegidos", total: "Total aproximado",
    note: "Total aproximado, confirma con tu camarero.", clear: "Vaciar selección",
    addFav: "Añadir a mi selección", rmFav: "Quitar de mi selección",
    addr: "Passeig Marítim 51, 07579 Colònia de Sant Pere", phone: "Teléfono 971 76 96 05",
    extras: "Extras para la burger", soonLang: "Próximamente",
    demo: "<b>Alérgenos de ejemplo</b>, orientativos hasta confirmarlos con el restaurante.",
    viewCard: "Ver foto y detalles", ingredients: "Ingredientes", allergensH: "Alérgenos", noAllergens: "Sin alérgenos declarados", addSel: "Añadir a mi selección", rmSel: "Quitar de mi selección", closeCard: "Cerrar ficha", photoSoon: "Foto próximamente", trayExpand: "Desliza hacia arriba para ampliar",
    theme: "Tema", themeDark: "Oscuro", themeLight: "Claro", done: "Listo", langLabel: "Idioma", searchOpen: "Buscar", back: "Volver",
    legend: "Leyenda de alérgenos", noAl: "Alérgenos", cartaTitle: "Carta", seeMenu: "Ver la carta", home: "Inicio",
    contains: "Contiene", alShow: "Mostrar alérgenos en los platos", filters: "Filtros", dietTitle: "Mi dieta", avoidTitle: "Evitar alérgenos",
    filterNote: "Los platos que no encajan se atenúan. Es orientativo: confirma siempre con el personal.",
    active: "Filtros activos", clearAll: "Quitar filtros", avoidingWord: "evitando",
    searchPh: "Buscar plato o bebida", results: "resultados", result1: "resultado", none: "Sin resultados para", trayShow: "Ver detalle", trayHide: "Ocultar detalle",
    starsTitle: "Favoritos de la casa", waiterBtn: "Mostrar al camarero", close: "Cerrar", dec: "Quitar uno", inc: "Añadir uno",
    diets: { v: "Vegetariano", vg: "Vegano", gf: "Sin gluten", lf: "Sin lactosa" }
  },
  en: {
    tagline: "Mediterranean cooking right on the beach",
    hours: "Open 11:30 am to 10:00 pm", closed: "Closed on Wednesdays",
    rating: "4.1 on Google (200 reviews)", avg: "€20–30 per person",
    reserve: "Book via WhatsApp", route: "Get directions", drinks: "Drinks and wines",
    contact: "You can also call +34 971 76 96 05",
    waText: "Hello, I would like to book a table at Sunsets Beach. Day: __ Time: __ People: __ Name: __",
    pp: "per person", glass: "Glass", bottle: "Bottle",
    sel1: "item selected", selN: "items selected", total: "Approximate total",
    note: "Approximate total, please confirm with your waiter.", clear: "Clear selection",
    addFav: "Add to my selection", rmFav: "Remove from my selection",
    addr: "Passeig Marítim 51, 07579 Colònia de Sant Pere", phone: "Phone +34 971 76 96 05",
    extras: "Burger extras", soonLang: "Coming soon",
    demo: "<b>Sample allergens</b>, indicative until confirmed with the restaurant.",
    viewCard: "View photo and details", ingredients: "Ingredients", allergensH: "Allergens", noAllergens: "No allergens declared", addSel: "Add to my selection", rmSel: "Remove from my selection", closeCard: "Close details", photoSoon: "Photo coming soon", trayExpand: "Swipe up to expand",
    theme: "Theme", themeDark: "Dark", themeLight: "Light", done: "Done", langLabel: "Language", searchOpen: "Search", back: "Back",
    legend: "Allergen key", noAl: "Allergens", cartaTitle: "Menu", seeMenu: "See the menu", home: "Home",
    contains: "Contains", alShow: "Show allergens on dishes", filters: "Filters", dietTitle: "My diet", avoidTitle: "Avoid allergens",
    filterNote: "Dishes that do not fit are dimmed. This is a guide only: always confirm with the staff.",
    active: "Active filters", clearAll: "Clear filters", avoidingWord: "avoiding",
    searchPh: "Search dishes or drinks", results: "results", result1: "result", none: "No results for", trayShow: "Show details", trayHide: "Hide details",
    starsTitle: "House favourites", waiterBtn: "Show to the waiter", close: "Close", dec: "Remove one", inc: "Add one",
    diets: { v: "Vegetarian", vg: "Vegan", gf: "Gluten-free", lf: "Lactose-free" }
  }
};

// Numeración del Anexo II del Reglamento (UE) 1169/2011
const ALLERGENS = [
  ["Gluten", "Gluten"], ["Crustáceos", "Crustaceans"], ["Huevos", "Eggs"], ["Pescado", "Fish"],
  ["Cacahuetes", "Peanuts"], ["Soja", "Soy"], ["Lácteos", "Milk"], ["Frutos de cáscara", "Tree nuts"],
  ["Apio", "Celery"], ["Mostaza", "Mustard"], ["Sésamo", "Sesame"], ["Sulfitos", "Sulphites"],
  ["Altramuces", "Lupin"], ["Moluscos", "Molluscs"]
];
const WAITER = {
  es: { title: "Hola, quisiera pedir:", avoid: "Evito estos alérgenos:", diet: "Dieta:", note: "Esta pantalla no envía el pedido: es solo para enseñársela al camarero." },
  en: { title: "Hello, I would like to order:", avoid: "I need to avoid:", diet: "Diet:", note: "This screen does not place an order. It is only to show to the waiter." }
};
const GROUPS = { comida: { es: "Comida", en: "Food" }, bebidas: { es: "Bebidas", en: "Drinks" } };

// Plato de comida: [nombre es, descripción es, nombre en, descripción en, precio, porPersona, alérgenos]
// Bebida: B(nombre, detalle es, detalle en, precio, alérgenos)
const B = (n, de, den, p, al) => [n, de, n, den, p, false, al || []];
const MENU = [
  { id: "tapas", group: "comida", es: "Tapas", en: "Tapas", items: [
    ["Focaccia con alioli y aceitunas","Focaccia casera, alioli y aceitunas","Focaccia with aioli and olives","House-made focaccia, aioli, olives",10.9,false,[1,3]],
    ["Bruschetta mediterránea","Tomate fresco, albahaca y aceite de oliva","Mediterranean bruschetta","Fresh tomato, basil, olive oil",12.9,false,[1]],
    ["Nachos Sunset Beach","Cheddar, guacamole, jalapeños y queso fundido","Sunset Beach nachos","Cheddar, guacamole, jalapeños, melted cheese",15.9,false,[7]],
    ["Langostinos crujientes al coco","Con salsa sweet chilli","Crispy coconut prawns","With sweet chilli sauce",14.9,false,[1,2,3]],
    ["Dátiles con bacon","Dátiles envueltos en bacon","Dates wrapped in bacon","Bacon-wrapped dates",12.9,false,[]],
    ["Pimientos de Padrón","Fritos, con sal gruesa","Padrón peppers","Fried, with coarse salt",12.9,false,[]],
    ["Gambas al ajillo","Salteadas con ajo y guindilla","Garlic prawns","Sautéed with garlic and chilli",19.9,false,[2]],
    ["Chipirones fritos","Calamares pequeños, fritos","Fried baby squid","Small squid, fried",18.9,false,[1,14]],
    ["Calamar rebozado","Calamar fresco rebozado, con limón","Battered calamari","Fresh calamari, with lemon",22.9,false,[1,3,14]],
    ["Patatas con mayonesa de sobrasada","Patatas fritas y mayonesa de sobrasada","Fries with sobrasada mayo","Fries with sobrasada mayonnaise",9.9,false,[3,10]],
    ["Boniato frito","Con parmesano y cebolla crujiente","Fried sweet potato","With parmesan and crispy onion",10.9,false,[1,7]]
  ]},
  { id: "ensaladas", group: "comida", es: "Ensaladas", en: "Salads", items: [
    ["Tomate y burrata","Tomate, burrata fresca, albahaca y aceite de oliva","Tomato and burrata","Tomato, fresh burrata, basil, olive oil",14.9,false,[7]],
    ["Queso de cabra","Lechugas variadas, queso de cabra, nueces, miel y tomate cherry","Goat cheese salad","Mixed leaves, goat cheese, walnuts, honey, cherry tomato",16.9,false,[7,8]]
  ]},
  { id: "pa-amb-oli", group: "comida", es: "Pa amb oli", en: "Pa amb oli", items: [
    ["Pa amb oli con jamón serrano","Jamón serrano, queso mahonés, tomate y aceite de oliva","Pa amb oli with serrano ham","Serrano ham, Mahón cheese, tomato, olive oil",13.9,false,[1,7]],
    ["Pa amb oli con burrata","Burrata, jamón serrano, tomate cherry y aceite de oliva","Pa amb oli with burrata","Burrata, serrano ham, cherry tomato, olive oil",16.9,false,[1,7]]
  ]},
  { id: "pizzas", group: "comida", es: "Pizzas", en: "Pizzas", items: [
    ["Diavola","Tomate, mozzarella y salami picante","Diavola","Tomato, mozzarella, spicy salami",16.9,false,[1,7]],
    ["Caprichosa","Tomate, mozzarella, jamón york y champiñones","Caprichosa","Tomato, mozzarella, ham, mushrooms",16.9,false,[1,7]],
    ["Burrata","Tomate, mozzarella, burrata, jamón serrano, tomate cherry y rúcula","Burrata","Tomato, mozzarella, burrata, serrano ham, cherry tomato, rocket",19.9,false,[1,7]],
    ["Mallorquina","Tomate, mozzarella, queso de cabra, sobrasada y miel","Mallorquina","Tomato, mozzarella, goat cheese, sobrasada, honey",17.9,false,[1,7]],
    ["Sunsets Beach","Tomate, mozzarella, jamón serrano, queso de cabra, tomate cherry y parmesano","Sunsets Beach","Tomato, mozzarella, serrano ham, goat cheese, cherry tomato, parmesan",19.9,false,[1,7]]
  ]},
  { id: "burgers", group: "comida", es: "Burgers", en: "Burgers", items: [
    ["Burger de ternera clásica","180 g de ternera, lechuga y cheddar","Classic beef burger","180 g beef, lettuce, cheddar",14.9,false,[1,7,11]],
    ["Burger parmesana","180 g de ternera, parmesano, lechuga, tomate y salsa césar","Parmesan burger","180 g beef, parmesan, lettuce, tomato, Caesar sauce",15.9,false,[1,3,4,7,10,11]]
  ], extras: [
    ["Mayonesa de sobrasada","Sobrasada mayonnaise",2.5],["Salsa césar","Caesar sauce",2.5],["Cebolla caramelizada","Caramelised onion",2.5],
    ["Salsa cheddar","Cheddar sauce",2.5],["Ketchup y mayonesa","Ketchup and mayonnaise",2.5],
    ["Patatas fritas extra","Extra fries",6],["Boniato frito extra","Extra fried sweet potato",6.5]
  ]},
  { id: "woks", group: "comida", es: "Woks", en: "Woks", items: [
    ["Wok de solomillo","Solomillo de ternera, verduras y teriyaki","Beef sirloin wok","Beef sirloin, vegetables, teriyaki",20.9,false,[1,6,11]],
    ["Wok de gambas","Gambas, verduras y curry rojo","Prawn wok","Prawns, vegetables, red curry",21.9,false,[2]]
  ]},
  { id: "carnes", group: "comida", es: "Carnes", en: "Meat", note: ["Todas las carnes llevan patatas fritas, pimientos del Padrón y cherrys.","All meat dishes come with fries, Padrón peppers and cherry tomatoes."], items: [
    ["Solomillo de ternera con queso de cabra","Con mermelada de arándanos y patatas","Beef sirloin with goat cheese","With cranberry jam and potatoes",34.9,false,[7]],
    ["Solomillo de cerdo","Solomillo de cerdo a la plancha","Pork tenderloin","Grilled pork tenderloin",23.9,false,[]],
    ["Pluma ibérica","Pluma ibérica con setas","Iberian pork pluma","Iberian pork pluma with mushrooms",27.9,false,[]]
  ]},
  { id: "pescados", group: "comida", es: "Pescados", en: "Fish", items: [
    ["Calamar a la plancha","Con ensalada y patata","Grilled calamari","With salad and potato",22.9,false,[14]],
    ["Filete de dorada","Con verduras y patatas","Sea bream fillet","With vegetables and potatoes",25.9,false,[4]],
    ["Filete de rodaballo","Con verduras y patatas","Turbot fillet","With vegetables and potatoes",31.9,false,[4]]
  ]},
  { id: "arroces", group: "comida", es: "Paellas y arroces", en: "Paellas and rice", items: [
    ["Paella ciega","Pollo, calamar, mejillones, almejas y zamburiñas","Paella ciega","Chicken, squid, mussels, clams, scallops",20.9,true,[9,14]],
    ["Arroz de pluma ibérica con setas","Pluma ibérica y setas","Iberian pork pluma rice with mushrooms","Iberian pork pluma and mushrooms",25.9,true,[9]]
  ]},
  { id: "postres", group: "comida", es: "Postres", en: "Desserts", items: [
    ["Tiramisú casero con helado","Tiramisú de la casa con helado","House tiramisu with ice cream","House tiramisu served with ice cream",7.5,false,[1,3,7]],
    ["Fondant con helado","Bizcocho de chocolate caliente con helado","Chocolate fondant with ice cream","Warm chocolate cake with ice cream",7.9,false,[1,3,7]],
    ["Gató con helado","Bizcocho mallorquín de almendra con helado","Gató with ice cream","Mallorcan almond cake with ice cream",7.9,false,[1,3,8]],
    ["Sorbete","Mandarina y mango","Sorbet","Mandarin and mango",6,false,[]]
  ]},

  { id: "refrescos", group: "bebidas", es: "Agua, refrescos y zumos", en: "Water, soft drinks and juices", items: [
    B("Agua con o sin gas","0,5 l","0.5 l",3.5),
    B("Coca-Cola","","",3), B("Coca-Cola Zero","","",3),
    B("Fanta limón","","",3), B("Fanta naranja","","",3), B("Sprite","","",3),
    B("Aquarius limón","","",3.5), B("Aquarius naranja","","",3.5), B("Aquarius melocotón","","",3.5),
    B("Fuze limón","","",3.5), B("Fuze maracuyá","","",3.5), B("Fuze mango","","",3.5),
    B("Tónica yuzu y cardamomo","Royal Bliss","Royal Bliss",3), B("Tónica cítricos","Royal Bliss","Royal Bliss",3),
    B("Ginger Ale","Royal Bliss","Royal Bliss",3), B("Ginger Beer","Royal Bliss","Royal Bliss",3), B("Bitter Rosso","Royal Bliss","Royal Bliss",3),
    B("Zumo de manzana","Minute Maid","Minute Maid",3), B("Zumo de piña","Minute Maid","Minute Maid",3),
    B("Zumo de melocotón","Minute Maid","Minute Maid",3), B("Zumo de naranja","Minute Maid","Minute Maid",3),
    B("Naranja natural","","",5)
  ]},
  { id: "cervezas", group: "bebidas", es: "Cervezas", en: "Beer", items: [
    B("Estrella Damm","0,3 l","0.3 l",2.9,[1]), B("Estrella Damm","0,5 l","0.5 l",4.5,[1]),
    B("Damm Free 0,0%","","",3,[1]), B("Damm Lemon","","",3,[1]),
    B("Estrella Galicia","","",3,[1]), B("Estrella Galicia sin gluten","Sin gluten","Gluten-free",3),
    B("Rosa Blanca","","",3,[1]), B("Alhambra","","",3.2,[1])
  ]},
  { id: "aperitivos", group: "bebidas", es: "Aperitivos", en: "Aperitifs", items: [
    B("Aperol / Aperol Spritz","","",8), B("Hugo","","",8,[12]), B("Campari Spritz","","",8),
    B("Lillet Berry","","",9,[12]), B("Martini","Bianco o Rosso","Bianco or Rosso",6.5,[12]),
    B("Ramazzotti","","",6.5), B("Vermut Izaguirre","Blanco o rojo","White or red",6.5,[12])
  ]},
  { id: "cafes", group: "bebidas", es: "Café e infusiones", en: "Coffee and tea", items: [
    B("Café solo","","",2), B("Café cortado","","",2,[7]), B("Café con leche","","",2.5,[7]),
    B("Americano","","",2.5), B("Doble espresso","","",2.5), B("Capuchino","","",3,[7]),
    B("Latte macchiato","","",3.5,[7]), B("Cacao","","",2.5,[7]),
    B("Carajillo","Café con licor","Coffee with liqueur",4.5),
    B("Manzanilla","","",2.5), B("Té verde","","",2.5), B("Té negro","","",2.5),
    B("Poleo menta","","",2.5), B("Frutos del bosque","","",2.5)
  ]},
  { id: "sangria", group: "bebidas", es: "Sangría", en: "Sangria", items: [
    B("Sangría","Copa","Glass",7,[12]), B("Sangría de cava","Copa","Glass",7.5,[12])
  ]},
  { id: "cocteles", group: "bebidas", es: "Cócteles", en: "Cocktails", note: ["Todos se pueden hacer sin alcohol, por 8 €.","All cocktails can be made alcohol-free, for €8."], items: [
    B("Mojito original","","",11), B("Mojito mango","","",11), B("Mojito maracuyá","","",11), B("Mojito fresa","","",11),
    B("Daiquiri fresa","","",11), B("Daiquiri mango","","",11), B("Daiquiri maracuyá","","",11),
    B("Mimosa","","",9,[12]), B("Negroni","","",11), B("Piña colada","","",11),
    B("Espresso Martini con Baileys","","",11,[7])
  ]},
  { id: "destilados", group: "bebidas", es: "Whisky y brandy", en: "Whisky and brandy", items: [
    B("Chivas Regal 12","Whisky","Whisky",11), B("J&B","Whisky","Whisky",8.5), B("Ballantine's","Whisky","Whisky",9),
    B("Jack Daniel's","Whisky","Whisky",9.5), B("Bullet Bourbon","Whisky","Whisky",11), B("Macallan","Whisky","Whisky",14),
    B("Suau 15 años","Brandy","Brandy",9.5), B("Carlos III","Brandy","Brandy",8), B("Carlos I","Brandy","Brandy",9.5),
    B("Veterano","Brandy","Brandy",6), B("Magno","Brandy","Brandy",6)
  ]},
  { id: "combinados", group: "bebidas", es: "Ginebra, vodka y ron", en: "Gin, vodka and rum", note: ["Con refresco a elegir.","Served with a mixer of your choice."], items: [
    B("Hendrick's","Ginebra","Gin",12), B("Beefeater","Ginebra","Gin",8.5), B("Bombay","Ginebra","Gin",9),
    B("Seagram's","Ginebra","Gin",9), B("Xoriguer","Ginebra","Gin",8.5),
    B("Absolut","Vodka","Vodka",9.5), B("Moskovskaya","Vodka","Vodka",8.5),
    B("Amazonas","Ron","Rum",6.9), B("Barceló","Ron","Rum",9), B("Barceló Imperial","Ron","Rum",11.5),
    B("Bacardí Blanco","Ron","Rum",8.5), B("Havana 7","Ron","Rum",9.5), B("Zacapa","Ron","Rum",14)
  ]},
  { id: "licores", group: "bebidas", es: "Licores y chupitos", en: "Liqueurs and shots", items: [
    B("Baileys","","",5.8,[7]), B("Disaronno","","",5.8,[8]), B("Limoncello","","",5.8), B("Jägermeister","","",5.8),
    B("Anís 3 Caires","","",5.8), B("Mescladís","","",5.8),
    B("Hierbas","Secas, dulces o mezcladas","Dry, sweet or mixed",5.8), B("Grappa Reserva","","",5.8),
    B("Chupito","","",3), B("Chupito premium","","",4.8)
  ]},
  { id: "blancos", group: "bebidas", es: "Vinos blancos", en: "White wines", items: [
    B("Vino de la casa","@glass","@glass",4.9,[12]), B("Vino de la casa","@bottle","@bottle",20,[12]),
    B("Vi Rei Prensal","@glass · IGP Vi de la Terra, Mallorca · Prensal","@glass · IGP Vi de la Terra, Mallorca · Prensal",5.9,[12]),
    B("Vi Rei Prensal","DO Vi de la Terra, Mallorca · Prensal","DO Vi de la Terra, Mallorca · Prensal",23,[12]),
    B("La Caprichosa","DO Rueda · Verdejo","DO Rueda · Verdejo",26,[12]),
    B("Terras Vellas","DO Rías Baixas · Albariño","DO Rías Baixas · Albariño",29,[12]),
    B("CM Stairway to Heaven Sauvignon","IGP Vi de la Terra, Mallorca · Sauvignon Blanc","IGP Vi de la Terra, Mallorca · Sauvignon Blanc",32,[12]),
    B("CM Stairway to Heaven Chardonnay","IGP Vi de la Terra, Mallorca · Chardonnay","IGP Vi de la Terra, Mallorca · Chardonnay",32,[12]),
    B("M. Gelabert Chardonnay Roure","DOP Pla i Llevant, Mallorca · Chardonnay","DOP Pla i Llevant, Mallorca · Chardonnay",45,[12])
  ]},
  { id: "rosados", group: "bebidas", es: "Vinos rosados", en: "Rosé wines", items: [
    B("Vino de la casa","@glass","@glass",4.9,[12]), B("Vino de la casa","@bottle","@bottle",20,[12]),
    B("Quelías","DO Cigales, Castilla y León · Tempranillo, Albillo, Verdejo, Garnacha","DO Cigales, Castilla y León · Tempranillo, Albillo, Verdejo, Garnacha",28,[12]),
    B("Castell Miquel Owners Edition","IGP Vi de la Terra, Mallorca · Merlot y Tempranillo","IGP Vi de la Terra, Mallorca · Merlot and Tempranillo",33,[12])
  ]},
  { id: "tintos", group: "bebidas", es: "Vinos tintos", en: "Red wines", items: [
    B("Vino de la casa","@glass","@glass",4.9,[12]), B("Vino de la casa","@bottle","@bottle",20,[12]),
    B("Martínez Corta Crianza","@glass · DOCa Rioja · Tempranillo","@glass · DOCa Rioja · Tempranillo",5.9,[12]),
    B("Martínez Corta Crianza","DOCa Rioja · Tempranillo","DOCa Rioja · Tempranillo",23,[12]),
    B("Nexus One","DO Ribera del Duero · Tempranillo","DO Ribera del Duero · Tempranillo",28,[12]),
    B("M. Gelabert Cabernet Sauvignon","DOP Pla i Llevant, Mallorca · Cabernet Sauvignon","DOP Pla i Llevant, Mallorca · Cabernet Sauvignon",32,[12]),
    B("Biniagual Verán","IGP Vi de la Terra, Mallorca · Manto Negro y Cabernet","IGP Vi de la Terra, Mallorca · Manto Negro and Cabernet",35,[12])
  ]},
  { id: "cavas", group: "bebidas", es: "Cavas", en: "Cava", items: [
    B("Roger de Flor Brut Nature","@glass · DO Cava · Macabeo, Parellada y Xarel·lo","@glass · DO Cava · Macabeo, Parellada and Xarel·lo",4.9,[12]),
    B("Roger de Flor Brut Nature","DO Cava · Macabeo, Parellada y Xarel·lo","DO Cava · Macabeo, Parellada and Xarel·lo",22,[12]),
    B("Anna de Codorníu Blanc de Blancs","DO Cava · Chardonnay, Pinot Noir","DO Cava · Chardonnay, Pinot Noir",28,[12])
  ]}
];


// Etiquetas de dieta de la comida (orientativas, a confirmar con el restaurante).
// "gf" y "lf" no se guardan: se deducen de los alérgenos 1 (gluten) y 7 (lácteos).
const DIET = {
  "Focaccia con alioli y aceitunas": ["v"], "Bruschetta mediterránea": ["v", "vg"], "Nachos Sunset Beach": ["v"],
  "Pimientos de Padrón": ["v", "vg"], "Boniato frito": ["v"],
  "Tomate y burrata": ["v"], "Queso de cabra": ["v"],
  "Tiramisú casero con helado": ["v"], "Fondant con helado": ["v"], "Gató con helado": ["v"], "Sorbete": ["v", "vg"]
};
MENU.forEach((c) => c.items.forEach((it) => { it[7] = c.group === "comida" ? (DIET[it[0]] || []) : null; }));
// Favoritos de la casa (orientativo, a confirmar con el restaurante)
const STARS = ["Paella ciega", "Calamar rebozado", "Solomillo de ternera con queso de cabra", "Sunsets Beach"];
// Persistencia de filtros
// Fichas de plato: función opcional (el dueño la activa en el panel; es un extra con fotografía profesional).
// Cada ficha: foto, descripción corta e ingredientes. Los alérgenos salen del propio plato.
// Textos y foto de ejemplo: se definen con el restaurante.
const FICHAS_ON = true;
const DETAIL = {
  "Paella ciega": {
    photo: "plato-paella-ciega.jpg?v=20261004c",
    alt: ["Plato de arroz con pollo y marisco", "Rice dish with chicken and seafood"],
    short: ["Arroz con pollo y marisco, pensado para comer sin complicaciones: sin cáscaras ni huesos.", "Rice with chicken and seafood, made to eat with no fuss: no shells, no bones."],
    ingredients: [["Arroz", "Pollo", "Calamar", "Mejillones", "Almejas", "Zamburiñas"], ["Rice", "Chicken", "Squid", "Mussels", "Clams", "Queen scallops"]]
  }
};

const FKEY = "sb-filters";
function loadFilters() { try { const o = JSON.parse(localStorage.getItem(FKEY) || "{}"); return { avoid: o.avoid || [], diet: o.diet || [] }; } catch (e) { return { avoid: [], diet: [] }; } }
function saveFilters(avoid, diet) { try { localStorage.setItem(FKEY, JSON.stringify({ avoid: [...avoid], diet: [...diet] })); } catch (e) {} }

const LANG_KEY = "sb-lang";
function detectLang() {
  // Primer idioma del navegador entre los disponibles; si no hay ninguno (alemán, francés…), inglés.
  const list = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "es"]);
  for (const l of list) {
    const p = String(l).slice(0, 2).toLowerCase();
    if (p === "es" || p === "ca") return "es";
    if (p === "en") return "en";
  }
  return "en";
}
function loadLang() {
  try { const s = localStorage.getItem(LANG_KEY); if (s === "es" || s === "en") return s; } catch (e) {}
  return detectLang();
}
function saveLang(l) { try { localStorage.setItem(LANG_KEY, l); } catch (e) {} }
function moneyFmt(n, lang) { return new Intl.NumberFormat(lang === "es" ? "es-ES" : "en-GB", { style: "currency", currency: "EUR" }).format(n); }
const LANG_NAMES = { es: "Español", en: "English", ca: "Català", de: "Deutsch", fr: "Français" };
function langButtons(lang, t, full) {
  return ["es", "en", "ca", "de", "fr"].map((l) => {
    const on = l === lang, avail = l === "es" || l === "en";
    return '<button type="button" data-l="' + l + '" aria-pressed="' + on + '"' + (avail ? "" : ' disabled title="' + t.soonLang + '"') + ">" + (full ? LANG_NAMES[l] : l.toUpperCase()) + "</button>";
  }).join("");
}
function loadTheme() { return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark"; }
function saveTheme(th) { if (th === "light") document.documentElement.setAttribute("data-theme", "light"); else document.documentElement.removeAttribute("data-theme"); try { localStorage.setItem("sb-theme", th); } catch (e) {} }
function loadAl() { try { return localStorage.getItem("sb-al") !== "off"; } catch (e) { return true; } }
function saveAl(on) { try { localStorage.setItem("sb-al", on ? "on" : "off"); } catch (e) {} }
function waLink(t) { return "https://wa.me/34971769605?text=" + encodeURIComponent(t.waText); }
