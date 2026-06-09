/**
 * Categories API service
 */
import api from './api'

/**
 * Fetch all categories.
 *
 * @param {boolean} withCount - If true, each category includes a `product_count` field.
 */
export const getCategories = async (withCount = false) => {
  const query = withCount ? '?with_count=true' : ''
  const response = await api.get(`/api/categories${query}`)
  return response.data.data  // array of category objects
}

/**
 * Fetch a single category by slug.
 *
 * @param {string} slug - The category slug
 */
export const getCategoryBySlug = async (slug) => {
  const response = await api.get(`/api/categories/${slug}`)
  return response.data.data
}
