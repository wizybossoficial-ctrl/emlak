export type Property = {
  id: string;
  title: string;
  price: number;
  location: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  features: string[];
  image: string;
  label: string;
};

export const properties: Property[] = [
  {
    id: "casa-serena",
    title: "Casa Serena",
    price: 2850000,
    location: "Bissau",
    neighborhood: "Bairro de São Paulo",
    bedrooms: 4,
    bathrooms: 4,
    area: 420,
    description: "A serene modern retreat where warm materials, generous spaces, and an effortless connection to nature come together.",
    features: ["Private pool", "Garden", "Open-plan living", "Covered terrace"],
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
    label: "FEATURED",
  },
  {
    id: "villa-lumina",
    title: "Villa Lumina",
    price: 1950000,
    location: "Bissau",
    neighborhood: "Bairro da Ajuda",
    bedrooms: 3,
    bathrooms: 3,
    area: 310,
    description: "A light-filled villa with thoughtful details, inviting interiors, and room to make every day feel extraordinary.",
    features: ["Landscaped garden", "Outdoor dining", "Natural light", "Private parking"],
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85",
    label: "NEW LISTING",
  },
  {
    id: "the-palm-residence",
    title: "The Palm Residence",
    price: 3400000,
    location: "Bijagós",
    neighborhood: "Bubaque Island",
    bedrooms: 5,
    bathrooms: 5,
    area: 580,
    description: "An exceptional island escape designed for unhurried living, with expansive views and beautifully considered spaces.",
    features: ["Ocean views", "Infinity pool", "Guest suite", "Private terrace"],
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=85",
    label: "EXCLUSIVE",
  },
  {
    id: "maison-soleil",
    title: "Maison Soleil",
    price: 1650000,
    location: "Bissau",
    neighborhood: "Bairro Militar",
    bedrooms: 3,
    bathrooms: 2,
    area: 275,
    description: "A peaceful contemporary home with sunlit rooms and relaxed indoor-outdoor spaces made for gathering.",
    features: ["Courtyard", "Chef's kitchen", "Outdoor lounge", "Secure parking"],
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
    label: "NEW LISTING",
  },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);

export const whatsappUrl = (message: string) =>
  `https://wa.me/245956153464?text=${encodeURIComponent(message)}`;
