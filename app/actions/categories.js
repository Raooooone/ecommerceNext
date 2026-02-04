'use server'

import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// CREATE
export async function createCategory(formData) {
  const name = formData.get('name');

  try {
    await prisma.category.create({
      data: { name }
    });
  } catch (error) {
    console.error("Erreur création catégorie (peut-être nom en double)", error);
    // On pourrait retourner une erreur ici, mais restons simples
  }

  revalidatePath('/categories/manage');
  redirect('/categories/manage');
}

// UPDATE
export async function updateCategory(formData) {
  const id = parseInt(formData.get('id'));
  const name = formData.get('name');

  await prisma.category.update({
    where: { id },
    data: { name }
  });

  revalidatePath('/categories/manage');
  redirect('/categories/manage');
}

// DELETE
export async function deleteCategory(formData) {
  const id = parseInt(formData.get('id'));

  try {
    await prisma.category.delete({
      where: { id }
    });
  } catch (error) {
    console.error("Impossible de supprimer (probablement des produits liés)");
  }

  revalidatePath('/categories/manage');
}