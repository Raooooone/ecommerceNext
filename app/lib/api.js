// app/lib/api.js

const API_URL = 'https://fakestoreapi.com';

/**
 * Fetch all products
 * @returns {Promise<Array>} List of products
 */
export async function getAllProducts() {
  try {
    const res = await fetch(`${API_URL}/products`, {
      next: {
        revalidate: 3600 // ISR: 1 hour
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return empty array to prevent page crash
    return [];
  }
}

/**
 * Fetch a single product by ID (Fixed version)
 * @param {number} id - Product ID
 * @returns {Promise<Object|null>} Product or null if not found
 */
export async function getProductById(id) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      next: {
        revalidate: 60 // ISR: 1 minute
      }
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    // Fix for "Unexpected end of JSON input"
    const text = await res.text();
    if (!text) return null;

    return JSON.parse(text);
  } catch (error) {
    console.error(`Error fetch product ${id}:`, error);
    return null;
  }
}

/**
 * Fetch all categories
 * @returns {Promise<Array<string>>} Categories
 */
export async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/products/categories`, {
      next: {
        revalidate: 86400 // ISR: 24 hours
      }
    });

    if (!res.ok) {
      throw new Error('Error categories');
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetch categories:', error);
    return [];
  }
}

/**
 * Fetch products by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} Products
 */
export async function getProductsByCategory(category) {
  try {
    const res = await fetch(`${API_URL}/products/category/${category}`, {
      next: {
        revalidate: 3600 // ISR: 1 hour
      }
    });

    if (!res.ok) {
      throw new Error(`Category ${category} not found`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error fetch category ${category}:`, error);
    return [];
  }
}