'use server'

import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';

// 1. AJOUTER AU PANIER
// On reçoit cartId depuis le composant React (Client)
export async function addToCart(cartId, productId) {
  
  // Si le panier n'existe pas en base, on le crée avec cet ID
  let cart = await prisma.cart.findUnique({ where: { id: cartId } });
  
  if (!cart) {
    await prisma.cart.create({
      data: { id: cartId } // On force l'ID généré par le client
    });
  }

  // Ajout du produit (logique identique)
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cartId,
        productId: productId
      }
    }
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + 1 }
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cartId,
        productId: productId,
        quantity: 1
      }
    });
  }
  
  // Pas de revalidatePath ici car la page panier sera en Client Side
}

// 2. RÉCUPÉRER LE PANIER (Pour l'affichage)
export async function getCart(cartId) {
  if (!cartId) return null;

  return await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: { product: true },
        orderBy: { id: 'asc' }
      }
    }
  });
}

// 3. ACTIONS DE MODIFICATION
export async function removeCartItem(itemId) {
  await prisma.cartItem.delete({ where: { id: itemId } });
}

export async function updateQuantity(itemId, newQuantity) {
  if (newQuantity < 1) return;
  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: newQuantity }
  });
}