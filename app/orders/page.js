import { prisma } from '@/app/lib/prisma';
import { deleteOrder } from '@/app/actions/orders'; // L'import va marcher maintenant !

export default async function OrdersPage() {
  // On récupère les commandes
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">Gestion des Commandes</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border p-4 rounded shadow flex justify-between items-center bg-white">
            
            {/* Infos Commande */}
            <div>
              <div className="font-bold text-lg">Commande #{order.id}</div>
              <div className="text-gray-500">Total: {order.totalAmount} € - {order.status}</div>
              <div className="text-sm text-gray-400">
                {order.items.length} articles
              </div>
            </div>

            {/* Bouton Supprimer */}
            <form action={deleteOrder.bind(null, order.id)}>
              <button 
                type="submit"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Supprimer
              </button>
            </form>

          </div>
        ))}

        {orders.length === 0 && <p>Aucune commande pour le moment.</p>}
      </div>
    </div>
  );
}