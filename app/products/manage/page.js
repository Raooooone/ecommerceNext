// app/products/manage/page.js
import { prisma } from '@/app/lib/prisma';
import { deleteProduct } from '@/app/actions/products';
import Link from 'next/link';
import Image from 'next/image';

export default async function ManageProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { id: 'desc' }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gérer le stock</h1>
        <Link 
          href="/products/create" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Nouveau Produit
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 flex items-center gap-4">
                  <div className="relative h-10 w-10 min-w-[40px]">
                     <Image src={product.image} alt={product.title} fill className="object-contain" />
                  </div>
                  <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{product.title}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.price} €</td>
                <td className="px-6 py-4 text-right text-sm font-medium flex justify-end gap-4">
                  {/* Lien Éditer vers /products/[id]/edit */}
                  <Link 
                    href={`/products/${product.id}/edit`} 
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Modifier
                  </Link>

                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={product.id} />
                    <button type="submit" className="text-red-600 hover:text-red-900">
                      Supprimer
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}