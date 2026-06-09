/**
 * Products API service
 * All product-related data fetching through the Flask backend.
 */
import api from './api'

/**
 * Fetch a paginated, filtered list of published products.
 *
 * @param {object} params
 * @param {number}  params.page        - Page number (default 1)
 * @param {number}  params.per_page    - Items per page (default 12)
 * @param {string}  params.category    - Category slug filter
 * @param {string}  params.search      - Full-text search string
 * @param {string}  params.sort        - 'newest' | 'price_asc' | 'price_desc'
 */
export const getProducts = async (params = {}) => {
  const {
    page = 1,
    per_page = 12,
    category = '',
    search = '',
    sort = 'newest',
  } = params

  const query = new URLSearchParams()
  query.set('page', page)
  query.set('per_page', per_page)
  if (category) query.set('category', category)
  if (search)   query.set('search', search)
  if (sort)     query.set('sort', sort)

  const response = await api.get(`/api/products?${query.toString()}`)
  return response.data  // { success, data: [...], meta: { total, page, ... } }
}

/**
 * Fetch a single product by its URL slug.
 * Response includes nested `variants` and `images` arrays.
 *
 * @param {string} slug - The product slug
 */
export const getProductBySlug = async (slug) => {
  const response = await api.get(`/api/products/${slug}`)
  return response.data.data  // the product object
}
