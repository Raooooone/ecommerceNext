import { prisma } from '@/app/lib/prisma';
import { deleteCategory } from '@/app/actions/categories';
import Link from 'next/link';

export default async function ManageCategoriesPage() {
  // 1. Récupérer les catégories + le nombre de produits liés
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { id: 'asc' }
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* En-tête avec navigation */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gérer les Catégories</h1>
        <div className="space-x-4">
            <Link href="/products/manage" className="text-gray-600 hover:text-blue-600 hover:underline">
                ← Gérer les Produits
            </Link>
            <Link 
              href="/categories/create" 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              + Nouvelle Catégorie
            </Link>
        </div>
      </div>

      {/* Tableau des catégories */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produits</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-6 py-4 text-sm text-gray-500">
                  #{cat.id}
                </td>
                
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {cat.name}
                </td>
                
                <td className="px-6 py-4 text-sm text-gray-500">
                    {/* Affiche le nombre de produits dans cette catégorie */}
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {cat._count.products} produits
                    </span>
                </td>
                
                <td className="px-6 py-4 text-right text-sm font-medium flex justify-end gap-4">
                  {/* Lien Modifier */}
                  <Link 
                    href={`/categories/${cat.id}/edit`} 
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Modifier
                  </Link>

                  {/* Bouton Supprimer (Server Action) */}
                  <form action={deleteCategory}>
                    <input type="hidden" name="id" value={cat.id} />
                    <button type="submit" className="text-red-600 hover:text-red-900">
                      Supprimer
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {categories.length === 0 && (
            <div className="p-8 text-center text-gray-500">
                Aucune catégorie trouvée. Commencez par en créer une !
            </div>
        )}
      </div>
    </div>
  );
}