import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/app/lib/prisma';
import { getAllProducts } from '@/app/lib/api';

export const metadata = {
  title: 'Tous nos Produits | E-Commerce Store',
  description: 'Découvrez notre catalogue complet de produits de qualité',
};

export default async function ProductsPage() {
  const [apiProducts, dbProducts] = await Promise.all([
    getAllProducts(),
    prisma.product.findMany({
      include: { category: true },
      orderBy: { id: 'desc' }
    })
  ]);

  // --- MODIFICATION ICI ---
  const formattedDbProducts = dbProducts.map((product) => ({
    ...product,
    // On crée un ID spécial pour l'affichage (String)
    // EXEMPLE : Si l'ID est 5, il devient "db-5"
    displayId: `db-${product.id}`, 
    category: product.category ? product.category.name : 'Non classé',
    rating: {
      rate: product.rating || 0,
      count: product.reviewCount || 0
    },
    source: 'db' 
  }));

  // On ajoute aussi une propriété displayId aux produits de l'API pour être cohérent
  const formattedApiProducts = apiProducts.map((product) => ({
    ...product,
    displayId: product.id.toString(), // L'API garde son ID normal ("1", "2"...)
    source: 'api'
  }));

  const allProducts = [...formattedDbProducts, ...formattedApiProducts];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Nos Produits</h1>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {allProducts.map((product) => (
          <Link
            key={product.displayId} // On utilise l'ID unique
            // 👇 C'EST ICI QUE LE LIEN CHANGE
            // Cela va donner : /products/db-1  OU  /products/1
            href={`/products/${product.displayId}`} 
            className="group"
          >
            <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
              <div className="relative h-64 bg-gray-100 p-4">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                 {/* ... Le reste de l'affichage (titre, prix...) reste identique ... */}
                 <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.title}
                 </h2>
                 <span className="text-2xl font-bold text-blue-600">
                    {product.price.toFixed(2)} €
                 </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}