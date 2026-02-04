import { createCategory } from '@/app/actions/categories';
import Link from 'next/link';

export default function CreateCategoryPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <Link href="/categories/manage" className="text-gray-500 hover:text-gray-700 mb-4 inline-block">← Retour</Link>
      <h1 className="text-2xl font-bold mb-6">Nouvelle Catégorie</h1>

      <form action={createCategory} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium">Nom de la catégorie</label>
          <input type="text" name="name" required className="w-full border p-2 rounded" placeholder="Ex: Electronics" />
        </div>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Créer
        </button>
      </form>
    </div>
  );
}