import { prisma } from '@/app/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '@/app/components/AddToCartButton';

// --- Fonctions utilitaires ---
async function getApiProduct(id) {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  if (!res.ok) return null;
  return res.json();
}

// --- Page Principale ---
export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  
  let product = null;

  // Logique de récupération (Base de données locale OU API externe)
  if (id.startsWith('db-')) {
    const realId = parseInt(id.replace('db-', ''));
    const dbProduct = await prisma.product.findUnique({
      where: { id: realId },
      include: { category: true }
    });
    if (dbProduct) {
        product = {
            ...dbProduct,
            category: dbProduct.category ? dbProduct.category.name : 'Non classé',
        };
    }
  } else {
    product = await getApiProduct(id);
  }

  if (!product) return notFound();

  const productForCart = { ...product, id: id };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Fil d'ariane (Breadcrumb) */}
        <nav className="flex items-center text-sm text-gray-500 mb-8">
          <Link href="/products" className="hover:text-gray-900 transition-colors flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Retour au catalogue
          </Link>
          <span className="mx-2">/</span>
          <span className="capitalize text-gray-900 font-medium truncate max-w-[200px]">{product.title}</span>
        </nav>

        {/* Carte Produit */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            
            {/* COLONNE GAUCHE : IMAGE */}
            <div className="relative bg-gray-100 h-[500px] md:h-auto flex items-center justify-center p-10 group">
              {/* Cercle décoratif en arrière plan */}
              <div className="absolute w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
              
              <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  priority={true}
                  className="object-contain z-10 drop-shadow-xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* COLONNE DROITE : INFO */}
            <div className="p-10 md:p-14 flex flex-col justify-center">
              
              {/* Badge Catégorie */}
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {product.category}
                </span>
              </div>

              {/* Titre */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                {product.title}
              </h1>

              {/* Prix (Unique, sans remise) */}
              <div className="mb-8">
                <span className="text-5xl font-bold text-gray-900">
                  {product.price}<span className="text-2xl align-top">€</span>
                </span>
              </div>

              {/* Description */}
              <div className="prose prose-sm text-gray-600 mb-10 leading-relaxed">
                <p>{product.description}</p>
              </div>

              {/* Zone d'action */}
              <div className="border-t pt-8">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-auto">
                        <AddToCartButton product={productForCart} />
                    </div>
                </div>
                
                {/* Petits avantages (Rassurances) */}
                <div className="mt-6 flex items-center gap-6 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Livraison gratuite
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        Garantie 2 ans
                    </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}