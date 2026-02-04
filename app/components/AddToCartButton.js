'use client'

import { useRouter } from 'next/navigation';
import { globalCart } from '@/app/store';

export default function AddToCartButton({ product }) {
  const router = useRouter();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Empêche les comportements parasites
    e.stopPropagation(); // Empêche le clic de "traverser"

    console.log("🟢 CLIC REÇU !"); // Pour vérifier dans la console F12

    // Logique d'ajout (inchangée)
    const existingItem = globalCart.find((item) => String(item.id) === String(product.id));
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      globalCart.push({ ...product, quantity: 1 });
    }
    router.push('/cart');
  };

  return (
    <div className="relative z-50"> {/* <-- ON AJOUTE UN CONTENEUR Z-50 */}
      <button 
        type="button"
        onClick={handleAddToCart}
        // J'ajoute 'cursor-pointer' et 'relative z-50' pour forcer le dessus
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-bold shadow-lg cursor-pointer relative z-50 active:scale-95"
      >
        Ajouter au panier
      </button>
    </div>
  );
}