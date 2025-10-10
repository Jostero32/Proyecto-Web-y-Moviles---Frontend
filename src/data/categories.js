import {
  HiDevicePhoneMobile,
  HiHomeModern,
  HiShoppingBag,
  HiTrophy
} from 'react-icons/hi2';
import {
  IoGameController,
  IoCarSport
} from 'react-icons/io5';

export const categoriesData = [
  {
    id: 'tecnologia',
    value: 'tecnologia',
    label: 'Tecnología',
    title: 'Tecnología',
    icon: HiDevicePhoneMobile,
    color: '#CF5C36',
    count: '12.5k',
    description: 'Smartphones, laptops, tablets y más',
    subcategories: [
      { id: 'celulares', label: 'Celulares', value: 'celulares' },
      { id: 'computadoras', label: 'Computadoras', value: 'computadoras' },
      { id: 'accesorios-tech', label: 'Accesorios', value: 'accesorios-tech' },
      { id: 'audio', label: 'Audio', value: 'audio' },
      { id: 'camaras', label: 'Cámaras', value: 'camaras' }
    ]
  },
  {
    id: 'hogar',
    value: 'hogar',
    label: 'Casa y Hogar',
    title: 'Casa y Hogar',
    icon: HiHomeModern,
    color: '#EFC88B',
    count: '8.2k',
    description: 'Muebles, decoración y electrodomésticos',
    subcategories: [
      { id: 'muebles', label: 'Muebles', value: 'muebles' },
      { id: 'decoracion', label: 'Decoración', value: 'decoracion' },
      { id: 'electrodomesticos', label: 'Electrodomésticos', value: 'electrodomesticos' },
      { id: 'jardin', label: 'Jardín', value: 'jardin' },
      { id: 'cocina', label: 'Cocina', value: 'cocina' }
    ]
  },
  {
    id: 'ropa',
    value: 'ropa',
    label: 'Ropa y Moda',
    title: 'Ropa y Moda',
    icon: HiShoppingBag,
    color: '#7C7C7C',
    count: '15.1k',
    description: 'Ropa, zapatos y accesorios',
    subcategories: [
      { id: 'ropa-hombre', label: 'Ropa Hombre', value: 'ropa-hombre' },
      { id: 'ropa-mujer', label: 'Ropa Mujer', value: 'ropa-mujer' },
      { id: 'zapatos', label: 'Zapatos', value: 'zapatos' },
      { id: 'accesorios-moda', label: 'Accesorios', value: 'accesorios-moda' },
      { id: 'joyeria', label: 'Joyería', value: 'joyeria' }
    ]
  },
  {
    id: 'deportes',
    value: 'deportes',
    label: 'Deportes',
    title: 'Deportes',
    icon: HiTrophy,
    color: '#CF5C36',
    count: '6.8k',
    description: 'Equipos deportivos y fitness',
    subcategories: [
      { id: 'gimnasio', label: 'Gimnasio', value: 'gimnasio' },
      { id: 'ciclismo', label: 'Ciclismo', value: 'ciclismo' },
      { id: 'futbol', label: 'Fútbol', value: 'futbol' },
      { id: 'camping', label: 'Camping', value: 'camping' },
      { id: 'natacion', label: 'Natación', value: 'natacion' }
    ]
  },
  {
    id: 'vehiculos',
    value: 'vehiculos',
    label: 'Carros y Motos',
    title: 'Carros y Motos',
    icon: IoCarSport,
    color: '#EFC88B',
    count: '4.3k',
    description: 'Vehículos y repuestos',
    subcategories: [
      { id: 'autos', label: 'Autos', value: 'autos' },
      { id: 'motos', label: 'Motos', value: 'motos' },
      { id: 'repuestos', label: 'Repuestos', value: 'repuestos' },
      { id: 'accesorios-vehiculos', label: 'Accesorios', value: 'accesorios-vehiculos' },
      { id: 'llantas', label: 'Llantas', value: 'llantas' }
    ]
  },
  {
    id: 'gaming',
    value: 'gaming',
    label: 'Gaming',
    title: 'Gaming',
    icon: IoGameController,
    color: '#7C7C7C',
    count: '7.9k',
    description: 'Consolas, videojuegos y accesorios',
    subcategories: [
      { id: 'consolas', label: 'Consolas', value: 'consolas' },
      { id: 'videojuegos', label: 'Videojuegos', value: 'videojuegos' },
      { id: 'pc-gaming', label: 'PC Gaming', value: 'pc-gaming' },
      { id: 'accesorios-gaming', label: 'Accesorios', value: 'accesorios-gaming' },
      { id: 'mandos', label: 'Mandos', value: 'mandos' }
    ]
  }
];

// Función para obtener todas las subcategorías de una categoría
export const getSubcategories = (categoryId) => {
  const category = categoriesData.find(cat => cat.id === categoryId || cat.value === categoryId);
  return category ? category.subcategories : [];
};

// Función para obtener info de una categoría
export const getCategoryInfo = (categoryId) => {
  return categoriesData.find(cat => cat.id === categoryId || cat.value === categoryId);
};

// Función para obtener info de una subcategoría
export const getSubcategoryInfo = (categoryId, subcategoryId) => {
  const category = getCategoryInfo(categoryId);
  if (!category) return null;
  return category.subcategories.find(sub => sub.id === subcategoryId || sub.value === subcategoryId);
};

