'use server'

import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
// Note : J'ai retiré 'redirect' car nous allons gérer la redirection côté client (Front)

export async function createOrder(cartItems, totalAmount) {
  try {
    // Vérification de sécurité
    if (!totalAmount || totalAmount <= 0) {
      return { success: false, message: "Le montant total est invalide." };
    }

    if (!cartItems || cartItems.length === 0) {
      return { success: false, message: "Le panier est vide." };
    }

    await prisma.$transaction(async (tx) => {
      // A. Assurer la catégorie par défaut (ID 1)
      const defaultCat = await tx.category.upsert({
        where: { id: 1 },
        update: {},
        create: { id: 1, name: "Général" }
      });

      // B. Créer la commande et lier/créer les produits en une seule passe
      await tx.order.create({
        data: {
          totalAmount: parseFloat(totalAmount),
          status: 'En attente',
          items: {
            create: cartItems.map(item => {
              // Nettoyage de l'ID pour Prisma (Int)
              const rawId = String(item.id);
              const realId = rawId.startsWith('db-') 
                  ? parseInt(rawId.replace('db-', '')) 
                  : parseInt(rawId);

              return {
                // Cette partie assure que le produit existe ou le crée si nécessaire
                product: {
                  connectOrCreate: {
                    where: { id: realId },
                    create: {
                      id: realId,
                      title: item.title,
                      price: parseFloat(item.price),
                      description: item.description || "",
                      image: item.image || "",
                      categoryId: defaultCat.id
                    }
                  }
                },
                quantity: parseInt(item.quantity),
                price: parseFloat(item.price)
              };
            })
          }
        }
      });
    });

    // On rafraîchit la page des commandes pour que la nouvelle commande apparaisse
    revalidatePath('/orders');
    
    // ✅ C'EST ICI QUE ÇA CHANGE :
    // On ne redirige pas. On renvoie "succès" au client.
    return { success: true };

  } catch (error) {
    console.error("Erreur détaillée:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteOrder(orderId) {
  try {
    // On supprime d'abord les lignes de commande (si pas de Cascade défini en base)
    // Mais avec onDelete: Cascade dans le schema, delete order suffit.
    // Par sécurité on peut laisser le delete simple :
    await prisma.order.delete({
      where: { id: orderId }
    });
    
    revalidatePath('/orders');
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}