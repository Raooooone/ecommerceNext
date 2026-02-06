'use server'
import { prisma } from '@/app/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProduct(formData) {
  try {
    const title = formData.get('title') //Récupère les valeurs envoyées par le formulaire HTML
    const price = formData.get('price')
    const description = formData.get('description')
    const categoryId = formData.get('categoryId')
    const image = formData.get('image')

    if (!title || !price || !categoryId) {
      throw new Error("Les champs Titre, Prix et Catégorie sont obligatoires.")
    }// Empêche l’envoi de données vides et sécurité serveur

    //validation des types 
    const parsedPrice = parseFloat(price) 
    const parsedCategoryId = parseInt(categoryId)

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      throw new Error("Le prix doit être un nombre valide supérieur à 0.")// Prix valide et positif
    }

    if (isNaN(parsedCategoryId)) {
      throw new Error("La catégorie sélectionnée est invalide.")//Catégorie valide
    }

    await prisma.product.create({ //Crée un nouveau produit dans la table product
      data: {
        title: title.trim(),
        price: parsedPrice,
        description: description?.trim() || '',
        image: image || '', 
        categoryId: parsedCategoryId
      }
    })

  } catch (error) {
    console.error("Erreur Create:", error.message) //Capture toutes les erreurs (validation, Prisma, serveur)
    // On ne redirige ici que si l'erreur n'est pas une redirection voulue par Next.js
    redirect(`/error?message=${encodeURIComponent(error.message)}`) 
  }

  revalidatePath('/products/manage')
  redirect('/products/manage')
}


export async function updateProduct(formData) {
  let productId;
  try {
    const id = parseInt(formData.get('id'))
    productId = id;
    if (!id || isNaN(id)) {
      throw new Error("Identifiant du produit manquant ou invalide.")
    }

    const title = formData.get('title')
    const price = formData.get('price')
    const description = formData.get('description')
    const categoryId = formData.get('categoryId')
    const image = formData.get('image')

    if (!title || !price || !categoryId) {
      throw new Error("Les champs Titre, Prix et Catégorie ne peuvent pas être vides.")
    }

    const parsedPrice = parseFloat(price)
    const parsedCategoryId = parseInt(categoryId)

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      throw new Error("Le prix doit être valide.")
    }

    await prisma.product.update({
      where: { id },
      data: {
        title: title.trim(),
        price: parsedPrice,
        description: description?.trim() || '',
        image: image || '',
        categoryId: parsedCategoryId
      }
    })

  } catch (error) {
    console.error("Erreur Update:", error)
    redirect(`/error?message=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/products/manage')
  revalidatePath(`/products/${productId}`) 
  redirect('/products/manage')
}


export async function deleteProduct(formData) {
  try {
    const id = parseInt(formData.get('id'))
    if (!id || isNaN(id)) {
      throw new Error("Impossible de supprimer : ID invalide.")
    }

    await prisma.product.delete({ where: { id } })

  } catch (error) {
    console.error("Erreur Delete:", error)
    redirect(`/error?message=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/products/manage')
  // Optionnel : redirect('/products/manage') si vous voulez forcer un rafraîchissement complet
}