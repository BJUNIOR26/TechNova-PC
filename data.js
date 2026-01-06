const products = [
    {
        title: "NVIDIA RTX 4090",
        price: 1599,
        image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=500&q=80",
        category: "Componente",
        description: "La GeForce RTX® 4090 es la GPU GeForce definitiva. Aporta un enorme salto en rendimiento, eficiencia y gráficos impulsados por IA.",
        specs: ["24GB GDDR6X", "Ada Lovelace Architecture", "DLSS 3.0", "Ray Tracing 3ra Gen"],
        badge: "sale",
        badgeText: "-10% OFF",
        featured: true
    },
    {
        title: "Monitor Dell UltraSharp",
        price: 649,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=80",
        category: "Oficina",
        description: "Experimenta una claridad cautivadora y colores brillantes con este monitor 4K UHD con conectividad USB-C Hub integrada.",
        specs: ["27 pulgadas IPS", "Resolución 4K UHD", "98% DCI-P3", "USB-C 90W PD"],
        featured: true
    },
    {
        title: "Teclado RGB Pro",
        price: 129,
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=500&q=80",
        category: "Gaming",
        description: "Domina el juego con interruptores mecánicos ultra rápidos y personalización RGB por tecla.",
        specs: ["Switches Cherry MX Red", "RGB Personalizable", "Chasis de Aluminio", "Reposamuñecas magnético"],
        badge: "sale",
        badgeText: "-25% OFF",
        featured: true
    },
    {
        title: "AMD Ryzen 9 7950X",
        price: 599,
        image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80",
        category: "Componente",
        description: "El mejor procesador para jugadores y creadores. Rendimiento puro para cualquier tarea.",
        specs: ["16 Núcleos / 32 Hilos", "Hasta 5.7 GHz Boost", "80MB Caché", "Socket AM5"],
        featured: true
    },
    {
        title: "Mouse Ergo Lift",
        price: 89,
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=500&q=80",
        category: "Oficina",
        description: "Diseñado científicamente para mantener tu mano en una posición natural de apretón de manos.",
        specs: ["Diseño Vertical 57°", "Sensor de alta precisión", "Batería recargable", "Conexión Multi-dispositivo"]
    },
    {
        title: "Headset Surround 7.1",
        price: 149,
        image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=500&q=80",
        category: "Gaming",
        description: "Sumérgete en el juego con un sonido envolvente 7.1 preciso y comodidad para sesiones largas.",
        specs: ["Drivers de 50mm", "Sonido Surround 7.1", "Micrófono Cardioide", "Almohadillas de espuma viscoelástica"]
    },
    {
        title: "Laptop Razer Blade 15",
        price: 2499,
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=500&q=80",
        category: "Gaming",
        description: "Poderosa laptop gaming con pantalla de 240Hz y chasis de aluminio CNC.",
        specs: ["Intel i7-13800H", "RTX 4070", "16GB RAM DDR5", "QHD 240Hz"]
    },
    {
        title: "Silla Ergonómica Pro",
        price: 349,
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=500&q=80",
        category: "Oficina",
        description: "Silla con soporte lumbar ajustable y malla transpirable para largas jornadas de trabajo.",
        specs: ["Malla de alta densidad", "Soporte Lumbar 3D", "Apoyabrazos 4D", "Base de Aluminio"]
    },
    {
        title: "Micrófono Streamer X",
        price: 159,
        image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=500&q=80",
        category: "Periféricos",
        description: "Micrófono de condensador profesional con patrón cardioide y conexión USB-C.",
        specs: ["Frecuencia 20Hz-20kHz", "Monitoreo Latencia Cero", "Plug & Play", "Soporte Antivibración"]
    },
    {
        title: "SSD NVMe 2TB Samsung",
        price: 189,
        image: "img/samsung.png",
        category: "Componente",
        description: "Almacenamiento ultra rápido para cargar tus juegos y aplicaciones en segundos.",
        specs: ["Velocidad 7450 MB/s", "Interfaz PCIe 4.0", "Capacidad 2TB", "V-NAND Technology"]
    },
    {
        title: "Webcam 4K Pro",
        price: 199,
        image: "img/webcam-4kPro.png",
        category: "Periféricos",
        description: "Video nítido en 4K con enfoque automático y micrófonos duales integrados.",
        specs: ["Resolución 4K UHD", "Auto-Focus", "HDR Support", "Cubierta de Privacidad"],
        badge: "new",
        badgeText: "NUEVO"
    },
    {
        title: "PC Gaming Beast",
        price: 1899,
        image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80",
        category: "Gaming",
        description: "PC ensamblada lista para jugar cualquier título en ultra. Incluye refrigeración líquida.",
        specs: ["Ryzen 7 7800X3D", "RTX 4080", "32GB RAM", "Enfriamiento Líquido 360mm"],
        badge: "hot",
        badgeText: "HOT PRICE"
    },
    {
        title: "RAM 32GB DDR5 RGB",
        price: 139,
        image: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=500&q=80",
        category: "Componente",
        description: "Kit de memoria de alto rendimiento para gaming y creación de contenido.",
        specs: ["32GB (2x16GB)", "6000MHz", "CL30 Timing", "RGB Sync Compatible"]
    },
    {
        title: "Monitor 240Hz Gaming",
        price: 499,
        image: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=500&q=80",
        category: "Gaming",
        description: "La ventaja competitiva que necesitas. Tasa de refresco ultra rápida para eSports.",
        specs: ["27 Pulgadas", "240Hz Refresh Rate", "1ms Response", "G-Sync Compatible"],
        badge: "sale",
        badgeText: "-15% OFF"
    },
    {
        title: "Docking Station USB-C",
        price: 199,
        image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=500&q=80",
        category: "Oficina",
        description: "Expande la conectividad de tu laptop con un solo cable. Ideal para setups minimalistas.",
        specs: ["2x HDMI 4K", "4x USB 3.0", "Ethernet Gigabit", "Carga PD 100W"]
    },
    {
        title: "Router WiFi 6E",
        price: 299,
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=500&q=80",
        category: "Periféricos",
        description: "Conexión inalámbrica ultra rápida y baja latencia para gaming y streaming 8K.",
        specs: ["WiFi 6E Tri-Band", "Velocidad AXE11000", "Puerto 2.5G WAN", "Cobertura ampliada"]
    },
    {
        title: "Case ATX Crystal",
        price: 159,
        image: "https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&w=500&q=80",
        category: "Componente",
        description: "Gabinete de vidrio templado panorámico para mostrar tu build con estilo.",
        specs: ["Doble vidrio templado", "3 ventiladores ARGB incluidos", "Soporte GPU vertical", "USB-C Frontal"]
    },
    {
        title: "Consola Portátil X",
        price: 699,
        image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=500&q=80",
        category: "Gaming",
        description: "Lleva tus juegos de PC a donde vayas con esta potente consola portátil.",
        specs: ["Pantalla 7 pulgadas 120Hz", "AMD Ryzen Z1 Extreme", "16GB RAM", "512GB SSD"],
        badge: "new",
        badgeText: "NUEVO"
    },
    {
        title: "Impresora Láser Pro",
        price: 249,
        image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=500&q=80",
        category: "Oficina",
        description: "Impresión rápida y nítida para documentos profesionales de alto volumen.",
        specs: ["30 ppm velocidad", "Impresión Doble Cara", "WiFi Direct", "Tóner de alto rendimiento"]
    },
    {
        title: "Fuente 850W Gold",
        price: 129,
        image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=500&q=80",
        category: "Componente",
        description: "Fuente de poder modular con certificación 80 Plus Gold para estabilidad total.",
        specs: ["850W Reales", "Certificación 80+ Gold", "Completamente Modular", "Ventilador Silencioso"],
        badge: "sale",
        badgeText: "-20% OFF"
    }
];