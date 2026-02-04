import { prisma } from '@/app/lib/prisma';
import { createProduct } from '@/app/actions/products';
import Link from 'next/link';

export default async function CreateProductPage() {
  const categories = await prisma.category.findMany();

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <Link href="/products/manage" className="text-gray-500 hover:text-gray-700 mb-4 inline-block">← Retour</Link>
      <h1 className="text-2xl font-bold mb-6">Ajouter un produit</h1>

      <form action={createProduct} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium">Titre</label>
          <input type="text" name="title" required className="w-full border p-2 rounded" />
        </div>
        
        <div>
          <label className="block text-sm font-medium">Prix</label>
          <input type="number" step="0.01" name="price" required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Catégorie</label>
          <select name="categoryId" className="w-full border p-2 rounded">
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* RETOUR À L'INPUT URL SIMPLE */}
        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <input 
            type="url" 
            name="image" 
            required 
            placeholder="https://..."
            className="w-full border p-2 rounded" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea name="description" rows="3" required className="w-full border p-2 rounded"></textarea>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Créer le produit
        </button>
      </form>
    </div>
  );
}