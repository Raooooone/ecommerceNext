import { prisma } from '@/app/lib/prisma';
import { deleteOrder } from '@/app/actions/orders';

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: { 
      items: { 
        include: { product: true } 
      } 
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="container mx-auto p-10 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Gestion des Commandes</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            
            {/* En-tête de la commande */}
            <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
              <div>
                <span className="font-bold text-lg text-gray-900">Commande #{order.id}</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-gray-600 font-medium">{order.totalAmount.toFixed(2)} €</span>
                <span className={`ml-3 text-xs px-2 py-1 rounded-full ${order.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                  {order.status}
                </span>
              </div>
              
              {/* Bouton Supprimer */}
              <form action={deleteOrder.bind(null, order.id)}>
                <button 
                  type="submit"
                  className="text-red-500 hover:text-red-700 text-sm font-semibold hover:underline"
                >
                  Supprimer
                </button>
              </form>
            </div>

            {/* Liste des articles avec IMAGES */}
            <div className="p-4">
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    
                    {/* 👇 C'EST ICI QU'ON AFFICHE L'IMAGE */}
                    <div className="w-12 h-12 flex-shrink-0 bg-white border rounded-md overflow-hidden flex items-center justify-center">
                      {item.product && item.product.image ? (
                        <img 
                          src={item.product.image} 
                          alt={item.product.title} 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-xs text-gray-400">No Img</div>
                      )}
                    </div>

                    {/* Détails du produit */}
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">
                        {item.product ? item.product.title : "Produit supprimé"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Prix unitaire : {item.price} €
                      </p>
                    </div>

                    {/* Quantité */}
                    <div className="text-sm font-bold text-gray-600">
                      x {item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
            Aucune commande pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}