// Données produits pour Ness Food
export const products = [
    {
        id: 1,
        name: "Plakalidrom Original",
        slug: "plakalidrom-original",
        shortDescription: "Le plakali ivoirien authentique, prêt à déguster en quelques minutes.",
        description: `Découvrez le goût authentique de la Côte d'Ivoire avec notre Plakalidrom Original. 
    
Préparé selon une recette traditionnelle transmise de génération en génération, notre plakali est fait à partir de manioc fraîchement sélectionné et transformé avec soin.

**Pourquoi choisir Plakalidrom ?**
• Préparation traditionnelle ivoirienne
• Texture parfaite et goût authentique
• Prêt en seulement 5 minutes
• Sans conservateurs ni additifs artificiels

Accompagnez-le de votre sauce préférée pour un repas complet et savoureux !`,
        price: 8.99,
        originalPrice: null,
        weight: "500g",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=800&fit=crop"
        ],
        badges: ["100% Naturel", "Sans conservateurs"],
        category: "plats-principaux",
        instructions: `**Instructions de réchauffage:**

1. **Au micro-ondes (recommandé):** Retirez l'emballage, placez dans un récipient adapté, chauffez 3-4 minutes à puissance moyenne.

2. **À la poêle:** Faites chauffer avec un peu d'eau à feu doux pendant 5 minutes en remuant délicatement.

3. **À la vapeur:** Placez dans un cuiseur vapeur pendant 8-10 minutes.

**Conseils de dégustation:**
Servez chaud avec une sauce graine, sauce arachide, ou sauce tomate africaine.`,
        nutritionInfo: {
            calories: "180 kcal",
            proteines: "2g",
            glucides: "42g",
            lipides: "0.5g",
            fibres: "3g"
        },
        inStock: true,
        featured: true
    },
    {
        id: 2,
        name: "Plakalidrom Épicé",
        slug: "plakalidrom-epice",
        shortDescription: "Une touche de piment pour les amateurs de sensations fortes.",
        description: `Pour les amateurs de saveurs relevées, découvrez notre Plakalidrom Épicé !

La même qualité exceptionnelle que l'Original, avec une touche subtile de piment africain qui révèle toutes les saveurs du manioc traditionnel.

**Caractéristiques:**
• Épices sélectionnées avec soin
• Piquant équilibré
• Parfait pour accompagner les grillades
• Idéal pour les plats en sauce`,
        price: 9.49,
        originalPrice: null,
        weight: "500g",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=800&fit=crop"
        ],
        badges: ["Épicé", "100% Naturel"],
        category: "plats-principaux",
        instructions: `**Instructions de réchauffage:**

1. **Au micro-ondes:** 3-4 minutes à puissance moyenne.
2. **À la poêle:** 5 minutes à feu doux avec un peu d'eau.

**Conseil:** Accompagnez d'une sauce légère pour équilibrer les saveurs épicées.`,
        nutritionInfo: {
            calories: "185 kcal",
            proteines: "2g",
            glucides: "42g",
            lipides: "0.5g",
            fibres: "3g"
        },
        inStock: true,
        featured: true
    },
    {
        id: 3,
        name: "Pack Découverte",
        slug: "pack-decouverte",
        shortDescription: "3 variétés pour découvrir tous les goûts du Plakalidrom.",
        description: `Vous ne savez pas par où commencer ? Notre Pack Découverte est fait pour vous !

**Ce pack contient:**
• 1 Plakalidrom Original (500g)
• 1 Plakalidrom Épicé (500g)
• 1 Plakalidrom aux Herbes (500g)

Parfait pour une première découverte ou pour offrir, ce pack vous permet de goûter à toute notre gamme et de trouver votre favori.

**Économie de 15% par rapport à l'achat séparé !**`,
        price: 24.99,
        originalPrice: 29.99,
        weight: "3 x 500g",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=600&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=800&fit=crop"
        ],
        badges: ["Économie 15%", "Best-seller"],
        category: "packs",
        instructions: `Chaque produit du pack possède ses propres instructions de préparation. Consultez les fiches individuelles pour plus de détails.`,
        nutritionInfo: null,
        inStock: true,
        featured: true
    },
    {
        id: 4,
        name: "Plakalidrom aux Herbes",
        slug: "plakalidrom-herbes",
        shortDescription: "Parfumé aux herbes fraîches de Côte d'Ivoire.",
        description: `Une touche de fraîcheur avec notre Plakalidrom aux Herbes !

Parfumé avec un mélange d'herbes fraîches traditionnelles, cette variante offre une expérience gustative unique et raffinée.

**Ingrédients aromatiques:**
• Basilic africain
• Feuilles de laurier
• Herbes locales sélectionnées

Idéal pour les palais qui recherchent des saveurs douces et parfumées.`,
        price: 9.29,
        originalPrice: null,
        weight: "500g",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=800&fit=crop"
        ],
        badges: ["Aux herbes", "100% Naturel"],
        category: "plats-principaux",
        instructions: `**Instructions de réchauffage:**

1. **Au micro-ondes:** 3-4 minutes à puissance moyenne.
2. **À la poêle:** 5 minutes à feu doux.

**Conseil:** Évitez de trop chauffer pour préserver les arômes des herbes.`,
        nutritionInfo: {
            calories: "175 kcal",
            proteines: "2g",
            glucides: "40g",
            lipides: "0.5g",
            fibres: "3.5g"
        },
        inStock: true,
        featured: false
    },
    {
        id: 5,
        name: "Pack Familial",
        slug: "pack-familial",
        shortDescription: "6 portions pour régaler toute la famille.",
        description: `Le Pack Familial est parfait pour les repas en famille ou les grandes occasions !

**Ce pack contient:**
• 6 x Plakalidrom Original (500g)

**Avantages:**
• Économie de 20% par rapport à l'achat unitaire
• Parfait pour les familles nombreuses
• Idéal pour les fêtes et réunions

Se conserve 12 mois au congélateur.`,
        price: 42.99,
        originalPrice: 53.94,
        weight: "6 x 500g",
        image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600&h=600&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=800&h=800&fit=crop"
        ],
        badges: ["Économie 20%", "Familial"],
        category: "packs",
        instructions: `Voir instructions du Plakalidrom Original.`,
        nutritionInfo: null,
        inStock: true,
        featured: false
    }
];

export const getProductById = (id) => {
    return products.find(p => p.id === parseInt(id));
};

export const getProductBySlug = (slug) => {
    return products.find(p => p.slug === slug);
};

export const getFeaturedProducts = () => {
    return products.filter(p => p.featured);
};

export const getProductsByCategory = (category) => {
    return products.filter(p => p.category === category);
};
