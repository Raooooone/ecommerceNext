'use client'

import { useState, useEffect } from 'react';
import { globalCart } from '@/app/store'; 
import { createOrder } from '@/app/actions/orders'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setCartItems([...globalCart]);
  }, []);

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Fonction pour tout nettoyer (mémoire + affichage)
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
        // 1. On affiche le message de succès MAINTENANT
        setIsSuccess(true);
        
        // 2. On attend 3 secondes AVANT de vider le panier
        setTimeout(() => {
            // 3. C'est ici qu'on vide le panier (après le délai)
            clearCart(); 

            // 4. On cache le message de succès
            // Cela va forcer l'affichage du composant "Votre panier est vide" juste en dessous
            setIsSuccess(false); 
            
            // Note : Si vous voulez rediriger ailleurs (ex: accueil), décommentez ceci :
            // router.push('/products');
        }, 3000);

    } else {
        const message = result?.message || "Erreur inconnue";
        alert("❌ Erreur : " + message);
    }
  };

  // ✨ AFFICHAGE SPÉCIAL SUCCÈS
  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="bg-green-100 text-green-800 p-8 rounded-lg shadow-lg inline-block max-w-lg">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-2">Commande validée !</h2>
            <p className="text-lg">Votre commande a été traitée avec succès.</p>
            <p className="text-sm mt-4 text-green-700 animate-pulse">
                Mise à jour du panier dans quelques secondes...
            </p>
        </div>
      </div>
    );
  }

  // Affichage Panier Vide (Standard)
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Votre panier est vide 😕</h2>
        <Link href="/products" className="text-blue-600 hover:underline">
          Retourner au catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Mon Panier</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {cartItems.map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex items-center gap-4 p-4 border-b last:border-0">
            <div className="w-20 h-20 relative bg-gray-100 rounded overflow-hidden flex-shrink-0">
               {item.image && (
                 <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
               )}
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-gray-500 text-sm">Prix : {item.price} €</p>
              <span className={`text-xs px-2 py-1 rounded ${String(item.id).startsWith('db-') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {String(item.id).startsWith('db-') ? 'Stock Local' : 'Externe'}
              </span>
            </div>
            <div className="flex flex-col items-center mx-4">
               <span className="font-bold text-lg">x{item.quantity}</span>
            </div>
            <div className="font-bold text-blue-600 w-24 text-right">
              {(item.price * item.quantity).toFixed(2)} €
            </div>
          </div>
        ))}

        <div className="p-6 bg-gray-50 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <button onClick={clearCart} className="text-red-500 text-sm hover:underline">
            Vider le panier
          </button>
          
          <div className="text-right flex flex-col items-end">
            <div className="text-xl">Total : <span className="font-bold">{total.toFixed(2)} €</span></div>
            
            <button 
                onClick={handleCheckout}
                disabled={loading}
                className={`mt-4 text-white px-8 py-3 rounded-lg font-bold transition
                    ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
                `}
            >
              {loading ? 'Traitement...' : 'Passer la commande'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}