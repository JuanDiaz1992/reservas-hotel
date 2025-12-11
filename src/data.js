export const sampleRooms = [
  {
    id: 1,
    name: "Suite Presidencial",
    description: "Nuestra suite más exclusiva con vista panorámica al mar, jacuzzi privado y servicio de mayordomo 24/7.",
    price: 800000,
    originalPrice: 800000,
    extraAdult: 100000,
    extraChild: 50000,
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&fit=crop"
    ],
    amenities: [
      { icon: "wifi", name: "Wi-Fi de Alta Velocidad" },
      { icon: "parking", name: "Parking Privado VIP" },
      { icon: "breakfast", name: "Desayuno Buffet Gourmet" },
      { icon: "gym", name: "Acceso Total al Gimnasio" }
    ],
    capacity: 3,
    size: 85,
    inventory:5
  },
  {
    id: 2,
    name: "Habitación Deluxe Vista Mar",
    description: "Amplia habitación con balcón privado y vistas espectaculares al océano. Incluye desayuno buffet.",
    price: 520000,
    originalPrice: 520000,
    extraAdult: 100000,
    extraChild: 50000,
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&fit=crop",
      "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800&fit=crop"
    ],
    amenities: [
      { icon: "wifi", name: "Conexión Wi-Fi" },
      { icon: "breakfast", name: "Desayuno Continental" },
      { icon: "gym", name: "Gimnasio 24h" }
    ],
    capacity: 2,
    size: 45,
    inventory:2
  },
  {
    id: 3,
    name: "Suite Familiar",
    description: "Perfecta para familias, con dos habitaciones separadas, área de estar y amenities para niños.",
    price: 500000,
    originalPrice: 500000,
    extraAdult: 100000,
    extraChild: 50000,
    images: [
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&fit=crop",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&fit=crop"
    ],
    amenities: [
      { icon: "wifi", name: "Wi-Fi Familiar" },
      { icon: "parking", name: "Doble plaza de Parking" },
      { icon: "breakfast", name: "Desayuno para todos" }
    ],
    capacity: 4,
    size: 65,
    inventory:2
  },
  {
    id: 4,
    name: "Junior Suite Jardín",
    description: "Un oasis de tranquilidad con acceso directo a los jardines tropicales y terraza privada.",
    price: 300000,
    originalPrice: 300000,
    extraAdult: 100000,
    extraChild: 50000,
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&fit=crop",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&fit=crop",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&fit=crop",

    ],
    amenities: [
      { icon: "wifi", name: "Wi-Fi Fibra" },
      { icon: "parking", name: "Valet Parking" },
      { icon: "coffee", name: "Cafetera Premium" }
    ],
    capacity: 2,
    size: 55,
    inventory:4
  },
];
export const sampleAddsOn = [
  {
    id: 1,
    name: "Bosque sobre el bosque 2 PAX*",
    description: "Un recorrido escénico por los Andes Colombianos ascendiendo hasta los 3.500 msnm...",
    price: 1780000,
    images: [
      "https://picsum.photos/seed/bosque1/800/600",
      "https://picsum.photos/seed/bosque2/800/600",
      "https://picsum.photos/seed/bosque3/800/600"
    ],
  },
  {
    id: 2,
    name: "Cena Romántica Privada (2 PAX)",
    description: "Disfrute de una cena gourmet de 3 tiempos...",
    price: 450000,
    images: [
      "https://picsum.photos/seed/cena1/800/600",
      "https://picsum.photos/seed/cena2/800/600",
      "https://picsum.photos/seed/cena3/800/600"
    ],
  },
  {
    id: 3,
    name: "Experiencia de Café de Origen",
    description: "Un tour inmersivo de 3 horas por una finca cafetera local...",
    price: 280000,
    images: [
      "https://picsum.photos/seed/cafe1/800/600",
      "https://picsum.photos/seed/cafe2/800/600",
      "https://picsum.photos/seed/cafe3/800/600"
    ],
  },
  {
    id: 4,
    name: "Masaje de Relajación Profunda (90 min)",
    description: "Sesión completa de 90 minutos de masaje terapéutico...",
    price: 320000,
    images: [
      "https://picsum.photos/seed/spa1/800/600",
      "https://picsum.photos/seed/spa2/800/600",
      "https://picsum.photos/seed/spa3/800/600"
    ],
  },
  {
    id: 5,
    name: "Transfer Aeropuerto Premium",
    description: "Servicio de transporte privado y directo desde/hacia el aeropuerto...",
    price: 150000,
    images: [
      "https://picsum.photos/seed/transfer1/800/600",
      "https://picsum.photos/seed/transfer2/800/600",
      "https://picsum.photos/seed/transfer3/800/600"
    ],
  },
  {
    id: 6,
    name: "Kit de Bienvenida para Mascotas",
    description: "Si viaja con su amigo peludo, este kit incluye cama premium...",
    price: 80000,
    images: [
      "https://picsum.photos/seed/pets1/800/600",
      "https://picsum.photos/seed/pets2/800/600",
      "https://picsum.photos/seed/pets3/800/600"
    ],
  },
];
