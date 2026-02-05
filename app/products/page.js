import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/app/lib/prisma';
import { getAllProducts } from '@/app/lib/api';

export const metadata = {
  title: 'Catalogue Produits | E-Commerce Store',
  description: 'Découvrez notre sélection exclusive de produits.',
};

export default async function ProductsPage() {
  // Récupération simultanée des données (API + Base de données)
  const [apiProducts, dbProducts] = await Promise.all([
    getAllProducts(),
    prisma.product.findMany({
      include: { category: true },
      orderBy: { id: 'desc' }
    })
  ]);

  // Normalisation des données DB
  const formattedDbProducts = dbProducts.map((product) => ({
    ...product,
    displayId: `db-${product.id}`, 
    categoryName: product.category ? product.category.name : 'Général',
    source: 'db' 
  }));

  // Normalisation des données API
  const formattedApiProducts = apiProducts.map((product) => ({
    ...product,
    displayId: product.id.toString(),
    categoryName: product.category || 'API',
    source: 'api'
  }));

  const allProducts = [...formattedDbProducts, ...formattedApiProducts];

  return (
    <div className="min-h-screen bg-white py-24">
      <div className="container mx-auto px-6">
        
        {/* --- SECTION HEADER SIMPLIFIÉE --- */}
        <div className="mb-24 text-center">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-zinc-900">
            Découvrir nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500">produits</span>
          </h1>
          <div className="mt-6 h-1.5 w-24 bg-indigo-600 mx-auto rounded-full" />
        </div>

        {/* --- GRILLE DE PRODUITS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {allProducts.map((product) => (
            <Link
              key={product.displayId}
              href={`/products/${product.displayId}`} 
              className="group"
            >
              <article className="relative flex flex-col h-full transition-all duration-500">
                
                {/* Container Image Premium */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-zinc-50 border border-zinc-100 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                  {/* Badge Source */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="backdrop-blur-md bg-white/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-zinc-200/50 text-zinc-600">
                      {product.source === 'db' ? 'Local' : 'API'}
                    </span>
                  </div>

                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain p-10 transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 25vw"
                    priority={product.id <= 4}
                  />
                </div>

                {/* Détails du produit */}
                <div className="pt-6 px-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-2">
                    {product.categoryName}
                  </p>
                  <h2 className="text-lg font-bold text-zinc-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {product.title}
                  </h2>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-zinc-900 tracking-tighter">
                        {product.price.toFixed(2)}€
                      </span>
                    </div>
                    
                    {/* Bouton style Minimaliste */}
                    <div className="h-10 w-10 flex items-center justify-center rounded-full border border-zinc-200 group-hover:bg-zinc-900 group-hover:border-zinc-900 group-hover:text-white transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}