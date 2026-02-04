import { prisma } from '@/app/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
// Import du bouton magique
import AddToCartButton from '@/app/components/AddToCartButton';

// ... (Gardez vos fonctions getApiProduct ici) ...
async function getApiProduct(id) {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  
  // ... (Gardez votre logique de récupération prisma/api ici) ...
  let product = null;
  let isLocalProduct = false;

  if (id.startsWith('db-')) {
    isLocalProduct = true;
    const realId = parseInt(id.replace('db-', ''));
    const dbProduct = await prisma.product.findUnique({
      where: { id: realId },
      include: { category: true }
    });
    if (dbProduct) {
        product = {
            ...dbProduct,
            category: dbProduct.category ? dbProduct.category.name : 'Non classé',
            rating: { rate: dbProduct.rating, count: dbProduct.reviewCount }
        };
    }
  } else {
    product = await getApiProduct(id);
  }

  if (!product) return notFound();

  // On prépare l'objet avec le bon ID
  const productForCart = { ...product, id: id };

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/products" className="text-gray-500 mb-8 inline-block">← Retour</Link>

      <div className="grid md:grid-cols-2 gap-12 bg-white p-8 rounded shadow">
        <div className="relative h-96">
<Image
    src={product.image}
    alt={product.title}
    fill
    // AJOUTEZ CES 2 PROPRIÉTÉS :
    priority={true} // Charge l'image en priorité (règle le warning LCP)
    className="object-contain p-8 z-0" // z-0 pour que l'image reste au fond
    sizes="(max-width: 768px) 100vw, 50vw"
  />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <span className="text-4xl font-bold text-gray-900 mb-6">{product.price} €</span>
          <p className="text-gray-600 mb-8">{product.description}</p>

          {/* 👇 ON APPELLE JUSTE LE BOUTON ICI */}
          <AddToCartButton product={productForCart} />

        </div>
      </div>
    </div>
  );
}