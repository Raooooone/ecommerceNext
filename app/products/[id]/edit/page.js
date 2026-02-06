/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable react-hooks/error-boundaries */
import { prisma } from '@/app/lib/prisma';
import { updateProduct } from '@/app/actions/products';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function EditProductPage({ params }) {
  const resolvedParams = await params;
  const rawId = resolvedParams.id;

  const cleanId = rawId.startsWith('db-') ? rawId.replace('db-', '') : rawId;
  const productId = parseInt(cleanId);

  if (isNaN(productId)) {
    console.error("Format d'ID invalide :", rawId);
    return notFound();
  }

  try {
    const [product, categories] = await Promise.all([
      prisma.product.findUnique({ where: { id: productId } }),
      prisma.category.findMany()
    ]);

    if (!product) return notFound();

    return (
      <div className="min-h-screen bg-black text-white py-12 px-4 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="mb-8">
            <Link href="/products/manage" className="flex items-center text-gray-400 hover:text-white transition-colors">
              <span className="mr-2">←</span> Annuler
            </Link>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-8 pt-10 pb-6 border-b border-white/10">
              <h1 className="text-3xl font-bold tracking-tight">Modifier le produit</h1>
              <p className="text-gray-500 text-sm mt-1">ID interne : {product.id}</p>
            </div>

            <form action={updateProduct} className="p-8 space-y-6">
              <input type="hidden" name="id" value={product.id} />

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nom</label>
                  <input type="text" name="title" defaultValue={product.title} required className="w-full px-5 py-4 rounded-xl bg-[#1a1a1a] border border-white/10 text-white focus:border-white outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Prix (€)</label>
                    <input type="number" step="0.01" name="price" defaultValue={product.price} required className="w-full px-5 py-4 rounded-xl bg-[#1a1a1a] border border-white/10 text-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Catégorie</label>
                    <select name="categoryId" defaultValue={product.categoryId} className="w-full px-5 py-4 rounded-xl bg-[#1a1a1a] border border-white/10 text-white outline-none appearance-none">
                      {categories.map(c => (
                        <option key={c.id} value={c.id} className="bg-black">{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Image (URL)</label>
                  <input type="url" name="image" defaultValue={product.image} required className="w-full px-5 py-4 rounded-xl bg-[#1a1a1a] border border-white/10 text-white outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description</label>
                  <textarea name="description" rows="4" defaultValue={product.description} required className="w-full px-5 py-4 rounded-xl bg-[#1a1a1a] border border-white/10 text-white outline-none resize-none"></textarea>
                </div>
              </div>

              // eslint-disable-next-line react-hooks/error-boundaries
              <button type="submit" className="w-full py-4 rounded-xl font-bold text-black bg-white hover:bg-gray-200 transition-all shadow-lg active:scale-95">
                Sauvegarder les modifications
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Erreur Edit Page:", error);
    return notFound();
  }
}