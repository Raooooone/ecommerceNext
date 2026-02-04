'use server'

import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// CREATE
export async function createProduct(formData) {
  const title = formData.get('title');
  const price = parseFloat(formData.get('price'));
  const description = formData.get('description');
  const categoryId = parseInt(formData.get('categoryId'));
  
  // ICI : On récupère simplement l'URL comme du texte
  const image = formData.get('image'); 

  await prisma.product.create({
    data: {
      title,
      price,
      description,
      image, // On sauvegarde l'URL directement (ex: "https://google.com/image.jpg")
      categoryId,
      rating: 0,
      reviewCount: 0
    }
  });

  revalidatePath('/products/manage');
  redirect('/products/manage');
}

// UPDATE
export async function updateProduct(formData) {
  const id = parseInt(formData.get('id'));
  const title = formData.get('title');
  const price = parseFloat(formData.get('price'));
  const description = formData.get('description');
  const categoryId = parseInt(formData.get('categoryId'));
  
  // ICI AUSSI : On récupère l'URL texte
  const image = formData.get('image');

  await prisma.product.update({
    where: { id },
    data: {
      title,
      price,
      description,
      image,
      categoryId
    }
  });

  revalidatePath('/products/manage');
  revalidatePath(`/products/${id}`);
  redirect('/products/manage');
}

// DELETE
export async function deleteProduct(formData) {
  const id = parseInt(formData.get('id'));
  await prisma.product.delete({ where: { id } });
  revalidatePath('/products/manage');
}