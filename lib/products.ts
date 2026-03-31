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
    description: "Vestido de bano elegante con detalles en crochet dorado.",
    price: 85000,
    image: "/img/Traje de baño beige.jpeg",
    hoverImage: "/img/Traje superios rojo de baño.jpeg",
    sizes: ["S", "M", "L"],
  },
  {
    id: "vb-2",
    name: "Vestido Arena Dorada",
    category: "mujer",
    description: "Tejido premium para playa con acabado sofisticado.",
    price: 95000,
    image: "/img/Traje superios rojo de baño.jpeg",
    hoverImage: "/img/Traje de baño beige.jpeg",
    sizes: ["S", "M", "L"],
  },
  {
    id: "vn-1",
    name: "Vestido Rosa",
    category: "nina",
    description: "Diseno delicado para ninas con textura suave.",
    price: 78000,
    image: "/img/Vestido niña rosa.jpeg",
    hoverImage: "/img/Vestido niña rojo.jpeg",
    sizes: ["2-4", "6-8", "10-12"],
  },
  {
    id: "vn-2",
    name: "Vestido Rojo",
    category: "nina",
    description: "Pieza artesanal para ocasiones especiales.",
    price: 79000,
    image: "/img/Vestido niña rojo.jpeg",
    hoverImage: "/img/Vestido niña rosa.jpeg",
    sizes: ["2-4", "6-8", "10-12"],
  },
  {
    id: "bl-1",
    name: "Balaca Bebe",
    category: "bebe",
    description: "Balaca tejida para bebe con toque delicado.",
    price: 25000,
    image: "/img/balaca de bebe.jpeg",
    hoverImage: "/img/Zapatos de bebe.jpeg",
    sizes: ["0-3m", "3-6m", "6-12m"],
  },
  {
    id: "bl-2",
    name: "Blusa Flores",
    category: "bebe",
    description: "Blusa blanca artesanal con detalles florales calidos.",
    price: 60000,
    image: "/img/Blusa Blanca Flores amarillas.jpeg",
    hoverImage: "/img/Vestido niña blanco con falda roja.jpeg",
    sizes: ["6-12m", "12-18m", "18-24m"],
  },
  {
    id: "zb-1",
    name: "Zapaticos Bebe",
    category: "bebe",
    description: "Zapaticos comodos y tejidos a mano.",
    price: 35000,
    image: "/img/Zapatos de bebe.jpeg",
    hoverImage: "/img/balaca de bebe.jpeg",
    sizes: ["0-3m", "3-6m", "6-12m"],
  },
  {
    id: "zb-2",
    name: "Conjunto Blanco y Rojo",
    category: "bebe",
    description: "Set tejido para bebe con contraste clasico.",
    price: 82000,
    image: "/img/Vestido niña blanco con falda roja.jpeg",
    hoverImage: "/img/Blusa Blanca Flores amarillas.jpeg",
    sizes: ["6-12m", "12-18m", "18-24m"],
  },
  {
    id: "dc-1",
    name: "Matera Crochet",
    category: "hogar",
    description: "Decoracion artesanal para espacios calidos.",
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
    description: "Combinacion elegante con brillo sutil.",
    price: 99000,
    image: "/img/Mochila blanca y plateado.jpeg",
    hoverImage: "/img/Mochila de gorasol y Mochila de flor roja.jpeg",
    sizes: [],
  },
];
