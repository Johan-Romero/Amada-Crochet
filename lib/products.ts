export type ProductCategory = "mujer" | "nina" | "bebe" | "hogar" | "bolsos";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  image: string;
  hoverImage?: string;
  sizes: string[];
};

export const products: Product[] = [
  {
    id: "vb-1",
    name: "Vestido Playa Caribe",
    category: "mujer",
    description: "Vestido de ba\u00f1o elegante con detalles en crochet dorado.",
    price: 85000,
    image: "/img/Traje de ba\u00f1o beige.jpeg",
    hoverImage: "/img/Traje superios rojo de ba\u00f1o.jpeg",
    sizes: ["S", "M", "L"],
  },
  {
    id: "vb-2",
    name: "Vestido Arena Dorada",
    category: "mujer",
    description: "Tejido premium para playa con acabado sofisticado.",
    price: 95000,
    image: "/img/Traje superios rojo de ba\u00f1o.jpeg",
    hoverImage: "/img/Traje de ba\u00f1o beige.jpeg",
    sizes: ["S", "M", "L"],
  },
  {
    id: "vn-1",
    name: "Vestido Rosa",
    category: "nina",
    description: "Dise\u00f1o delicado para ni\u00f1as con textura suave.",
    price: 78000,
    image: "/img/Vestido ni\u00f1a rosa.jpeg",
    hoverImage: "/img/Vestido ni\u00f1a rojo.jpeg",
    sizes: ["2-4", "6-8", "10-12"],
  },
  {
    id: "vn-2",
    name: "Vestido Rojo",
    category: "nina",
    description: "Pieza artesanal para ocasiones especiales.",
    price: 79000,
    image: "/img/Vestido ni\u00f1a rojo.jpeg",
    hoverImage: "/img/Vestido ni\u00f1a rosa.jpeg",
    sizes: ["2-4", "6-8", "10-12"],
  },
  {
    id: "bl-1",
    name: "Balaca Beb\u00e9",
    category: "bebe",
    description: "Balaca tejida para beb\u00e9 con toque delicado.",
    price: 25000,
    image: "/img/balaca de bebe.jpeg",
    hoverImage: "/img/Zapatos de bebe.jpeg",
    sizes: ["0-3m", "3-6m", "6-12m"],
  },
  {
    id: "bl-2",
    name: "Blusa Flores",
    category: "bebe",
    description: "Blusa blanca artesanal con detalles florales c\u00e1lidos.",
    price: 60000,
    image: "/img/Blusa Blanca Flores amarillas.jpeg",
    hoverImage: "/img/Vestido ni\u00f1a blanco con falda roja.jpeg",
    sizes: ["6-12m", "12-18m", "18-24m"],
  },
  {
    id: "zb-1",
    name: "Zapaticos Beb\u00e9",
    category: "bebe",
    description: "Zapaticos c\u00f3modos y tejidos a mano.",
    price: 35000,
    image: "/img/Zapatos de bebe.jpeg",
    hoverImage: "/img/balaca de bebe.jpeg",
    sizes: ["0-3m", "3-6m", "6-12m"],
  },
  {
    id: "zb-2",
    name: "Conjunto Blanco y Rojo",
    category: "bebe",
    description: "Set tejido para beb\u00e9 con contraste cl\u00e1sico.",
    price: 82000,
    image: "/img/Vestido ni\u00f1a blanco con falda roja.jpeg",
    hoverImage: "/img/Blusa Blanca Flores amarillas.jpeg",
    sizes: ["6-12m", "12-18m", "18-24m"],
  },
  {
    id: "dc-1",
    name: "Matera Crochet",
    category: "hogar",
    description: "Decoraci\u00f3n artesanal para espacios c\u00e1lidos.",
    price: 42000,
    image: "/img/Matera.jpeg",
    hoverImage: "/img/Matera.jpeg",
    sizes: [],
  },
  {
    id: "dc-2",
    name: "Mochila Girasol",
    category: "bolsos",
    description: "Bolso tejido con identidad floral y acabados premium.",
    price: 98000,
    image: "/img/Mochila de gorasol y Mochila de flor roja.jpeg",
    hoverImage: "/img/Mochila crema.jpeg",
    sizes: [],
  },
  {
    id: "mc-1",
    name: "Mochila Crema",
    category: "bolsos",
    description: "Bolso artesanal minimalista para uso diario.",
    price: 92000,
    image: "/img/Mochila crema.jpeg",
    hoverImage: "/img/Mochila blanca y plateado.jpeg",
    sizes: [],
  },
  {
    id: "mc-2",
    name: "Mochila Blanca y Plateado",
    category: "bolsos",
    description: "Combinaci\u00f3n elegante con brillo sutil.",
    price: 99000,
    image: "/img/Mochila blanca y plateado.jpeg",
    hoverImage: "/img/Mochila de gorasol y Mochila de flor roja.jpeg",
    sizes: [],
  },
];
