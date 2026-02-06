'use server'

import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createOrder(cartItems, totalAmount) {
  try {
    if (!totalAmount || totalAmount <= 0) {
      return { success: false, message: "Le montant total est invalide." };
    }

    if (!cartItems || cartItems.length === 0) {
      return { success: false, message: "Le panier est vide." };
    }

    await prisma.$transaction(async (tx) => {
      const defaultCat = await tx.category.upsert({
        where: { id: 1 },
        update: {},
        create: { id: 1, name: "Général" }
      });

      await tx.order.create({
        data: {
          totalAmount: parseFloat(totalAmount),
          status: 'En attente',
          items: {
            create: cartItems.map(item => {
              const rawId = String(item.id);
              const realId = rawId.startsWith('db-') 
                  ? parseInt(rawId.replace('db-', '')) 
                  : parseInt(rawId);

              return {
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

    revalidatePath('/orders');
    
    
    return { success: true };

  } catch (error) {
    console.error("Erreur détaillée:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteOrder(orderId) {
  try {
    
    await prisma.order.delete({
      where: { id: orderId }
    });
    
    revalidatePath('/orders');
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}