'use client'

import { useState, useEffect } from 'react';
import { globalCart } from '@/app/store'; 
import { createOrder } from '@/app/actions/orders'; 
import Link from 'next/link';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setCartItems([...globalCart]);
  }, []);

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const clearCart = () => {
    // eslint-disable-next-line react-hooks/immutability
    globalCart.length = 0;
    setCartItems([]);
  };

  const handleCheckout = async () => {
    setLoading(true);
    const result = await createOrder(cartItems, total);
    setLoading(false);

    if (result && result.success) {
        setIsSuccess(true);
        setTimeout(() => {
            clearCart(); 
            setIsSuccess(false); 
        }, 3000);
    } else {
        alert(" Erreur : " + (result?.message || "Erreur inconnue"));
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full animate-in fade-in zoom-in duration-700">
            <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 shadow-sm">
              
            </div>
            <h2 className="text-4xl font-black text-zinc-900 mb-4 tracking-tight"></h2>
            <p className="text-zinc-500 font-medium leading-relaxed">
              Votre commande a été validée. Merci de faire partie de notre aventure.
            </p>
            <div className="mt-10 h-1 w-32 bg-zinc-100 mx-auto rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 animate-[shimmer_2s_infinite]" style={{ width: '100%' }}></div>
            </div>
        </div>
      </div>
    );
  }

  // --- PANIER VIDE CLAIR ---
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center text-4xl mb-8 border border-zinc-100">
          
        </div>
        <h2 className="text-3xl font-black text-zinc-900 mb-3 tracking-tight">Le panier est vide</h2>
        <p className="text-zinc-400 mb-10 max-w-xs font-medium">Il est temps de le remplir avec vos articles préférés !</p>
        <Link href="/products" className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
          Découvrir les produits
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/30 text-zinc-900 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <h1 className="text-6xl font-black text-zinc-900 tracking-tighter">Panier</h1>
            <p className="text-zinc-400 font-bold mt-2 text-sm italic">{cartItems.length} merveille(s) sélectionnée(s)</p>
          </div>
          <button onClick={clearCart} className="group text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-red-400 transition-colors">
            Vider le panier <span className="inline-block transition-transform group-hover:rotate-12">🗑️</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* --- LISTE DES ARTICLES --- */}
          <div className="lg:col-span-7 space-y-10">
            {cartItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className="group flex flex-wrap sm:flex-nowrap items-center gap-8 pb-10 border-b border-zinc-100 last:border-0">
                
                {/* Image Produit */}
                <div className="w-32 h-32 bg-white rounded-3xl overflow-hidden flex-shrink-0 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-md transition-shadow duration-500">
                  <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                </div>
                
                {/* Infos Produit */}
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-500 text-[10px] font-black uppercase tracking-widest">
                      {String(item.id).startsWith('db-') ? 'Local' : 'Import'}
                    </span>
                  </div>
                  <h3 className="font-bold text-zinc-900 text-xl mb-1 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                  <p className="text-zinc-400 text-sm font-medium">Prix unitaire: {item.price} €</p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm font-bold">
                        <span className="text-zinc-300">Quantité</span>
                        <span className="w-8 h-8 flex items-center justify-center bg-zinc-50 rounded-lg">{item.quantity}</span>
                    </div>
                    <span className="text-2xl font-black text-zinc-900 tracking-tighter">
                        {(item.price * item.quantity).toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- RÉSUMÉ DE CAISSE --- */}
          <div className="lg:col-span-5">
            <div className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] sticky top-12">
              <h2 className="text-2xl font-black text-zinc-900 mb-8 tracking-tight">Récapitulatif</h2>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-zinc-400 font-bold text-sm uppercase">
                  <span>Articles</span>
                  <span className="text-zinc-900">{total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-zinc-400 font-bold text-sm uppercase">
                  <span>Livraison</span>
                  <span className="text-green-500 tracking-widest italic">Offerte</span>
                </div>
                <div className="pt-8 border-t border-zinc-100 flex justify-between items-end">
                  <span className="text-zinc-900 font-black text-xl">Total</span>
                  <span className="text-5xl font-black tracking-tighter text-blue-600">
                    {total.toFixed(2)}<span className="text-lg ml-1">€</span>
                  </span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={loading}
                className={`w-full py-6 rounded-full font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-3
                  ${loading ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' : 'bg-zinc-900 text-white hover:bg-blue-600 shadow-xl shadow-blue-50'}
                `}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                ) : (
                  "Valider l'achat"
                )}
              </button>
              
             
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}