// app/products/[id]/edit/page.js
import { prisma } from '@/app/lib/prisma';
import { updateProduct } from '@/app/actions/products';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function EditProductPage({ params }) {
  // NEXT.JS 15 FIX
  const { id } = await params;
  const productId = parseInt(id);

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: productId } }),
    prisma.category.findMany()
  ]);

  if (!product) return notFound();

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <Link href="/products/manage" className="text-gray-500 hover:text-gray-700 mb-4 inline-block">← Annuler</Link>
      <h1 className="text-2xl font-bold mb-6">Modifier : {product.title}</h1>

      <form action={updateProduct} className="space-y-4 bg-white p-6 rounded shadow">
        
        <input type="hidden" name="id" value={product.id} />

        <div>
          <label className="block text-sm font-medium">Titre</label>
          <input type="text" name="title" defaultValue={product.title} required className="w-full border p-2 rounded" />
        </div>
        
        <div>
          <label className="block text-sm font-medium">Prix</label>
          <input type="number" step="0.01" name="price" defaultValue={product.price} required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Catégorie</label>
          <select name="categoryId" defaultValue={product.categoryId} className="w-full border p-2 rounded">
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <input type="url" name="image" defaultValue={product.image} required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea name="description" rows="3" defaultValue={product.description} required className="w-full border p-2 rounded"></textarea>
        </div>

        <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700">
          Enregistrer
        </button>
      </form>
    </div>
  );
}