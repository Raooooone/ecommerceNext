import { prisma } from '@/app/lib/prisma';
import { updateCategory } from '@/app/actions/categories';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function EditCategoryPage({ params }) {
  // NEXT 15 FIX
  const { id } = await params;
  const categoryId = parseInt(id);

  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });

  if (!category) return notFound();

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <Link href="/categories/manage" className="text-gray-500 hover:text-gray-700 mb-4 inline-block">← Annuler</Link>
      <h1 className="text-2xl font-bold mb-6">Modifier : {category.name}</h1>

      <form action={updateCategory} className="space-y-4 bg-white p-6 rounded shadow">
        
        <input type="hidden" name="id" value={category.id} />

        <div>
          <label className="block text-sm font-medium">Nom</label>
          <input 
            type="text" 
            name="name" 
            defaultValue={category.name} 
            required 
            className="w-full border p-2 rounded" 
          />
        </div>

        <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700">
          Mettre à jour
        </button>
      </form>
    </div>
  );
}