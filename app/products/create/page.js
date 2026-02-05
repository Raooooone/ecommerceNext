import { prisma } from '@/app/lib/prisma';
import { createProduct } from '@/app/actions/products';
import Link from 'next/link';

export default async function CreateProductPage() {
  const categories = await prisma.category.findMany();

  return (
    // 1. FOND NOIR PROFOND & SUBTIL
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Effets de lumière blanche diffuse (Glows) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gray-800/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Navigation retour */}
        <div className="mb-8">
          <Link 
            href="/products/manage" 
            className="group flex items-center text-gray-400 hover:text-white transition-all duration-300 font-medium w-fit"
          >
            <div className="p-2 bg-white/10 rounded-full mr-3 group-hover:bg-white group-hover:text-black transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <span>Retour à la gestion</span>
          </Link>
        </div>

        {/* 2. CARTE MINIMALISTE (Bordure fine blanche) */}
        <div className="bg-[#111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
          
          <div className="px-8 pt-10 pb-6 border-b border-white/10">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Nouveau Produit
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Ajoutez un article à votre catalogue.</p>
          </div>

          <form action={createProduct} className="p-8 space-y-8">
            
            {/* --- SECTION 1 --- */}
            <div className="space-y-6">
              
              {/* Titre */}
              <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-white transition-colors">Nom du produit</label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  placeholder="Ex: Montre Argent..."
                  className="w-full px-5 py-4 rounded-xl bg-[#1a1a1a] border border-white/10 text-white placeholder-gray-600 focus:border-white focus:ring-1 focus:ring-white/50 focus:bg-[#222] transition-all outline-none" 
                />
              </div>

              {/* Grille Prix & Catégorie */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {/* MODIFICATION ICI : € */}
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Prix (€)</label>
                  <div className="relative group">
                    <input 
                      type="number" 
                      step="0.01" // 2 décimales pour l'Euro
                      name="price" 
                      required 
                      placeholder="0.00"
                      className="w-full pl-5 pr-14 py-4 rounded-xl bg-[#1a1a1a] border border-white/10 text-white placeholder-gray-600 focus:border-white focus:ring-1 focus:ring-white/50 focus:bg-[#222] transition-all outline-none font-mono text-lg" 
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      {/* Symbole € */}
                      <span className="text-white font-bold bg-white/10 px-3 py-1 rounded text-sm">€</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Catégorie</label>
                  <div className="relative">
                      <select 
                          name="categoryId" 
                          className="w-full px-5 py-4 rounded-xl bg-[#1a1a1a] border border-white/10 text-white focus:border-white focus:ring-1 focus:ring-white/50 transition-all outline-none appearance-none cursor-pointer"
                      >
                          {categories.map(c => (
                            <option key={c.id} value={c.id} className="bg-black text-white py-2">{c.name}</option>
                          ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gray-400">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10"></div>

            {/* --- SECTION 2 --- */}
            <div className="space-y-6">
              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Image du produit</label>
                <div className="flex rounded-xl overflow-hidden border border-white/10 bg-[#1a1a1a] focus-within:border-white focus-within:ring-1 focus-within:ring-white/50 transition-all">
                  <div className="flex items-center justify-center px-4 bg-white/5 border-r border-white/10">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <input 
                    type="url" 
                    name="image" 
                    required 
                    placeholder="https://..."
                    className="flex-1 px-5 py-4 bg-transparent text-white placeholder-gray-600 border-none focus:ring-0 outline-none w-full" 
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Description</label>
                <textarea 
                  name="description" 
                  rows="4" 
                  required 
                  placeholder="Détails du produit..."
                  className="w-full px-5 py-4 rounded-xl bg-[#1a1a1a] border border-white/10 text-white placeholder-gray-600 focus:border-white focus:ring-1 focus:ring-white/50 focus:bg-[#222] transition-all outline-none resize-none"
                ></textarea>
              </div>
            </div>

            {/* BOUTON BLANC (CONTRASTE FORT) */}
            <div className="pt-6">
              <button 
                type="submit" 
                className="w-full py-4 px-6 rounded-xl text-lg font-bold text-black bg-white hover:bg-gray-200 focus:ring-4 focus:ring-white/30 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex justify-center items-center shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                Créer le produit
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}