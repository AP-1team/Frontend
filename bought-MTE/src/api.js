const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')
const TOKEN_KEY = 'bought-mte-access-token'

export function resolveMediaUrl(path) {
  if (!path || /^(https?:)?\/\//i.test(path) || path.startsWith('data:')) return path
  if (/^https?:\/\//i.test(API_BASE_URL)) return new URL(path, API_BASE_URL).toString()
  return path
}

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAccessToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export async function apiRequest(path, { method = 'GET', body, auth = true, ...options } = {}) {
  const headers = new Headers(options.headers)
  if (body !== undefined && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const token = auth ? getAccessToken() : null
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      method,
      headers,
      body: body === undefined || body instanceof FormData ? body : JSON.stringify(body),
    })
  } catch {
    throw new ApiError('서버와 통신할 수 없습니다. API 주소를 확인해주세요.', 0, 'NETWORK_ERROR')
  }

  const text = response.status === 204 ? '' : await response.text()
  let payload = null
  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      throw new ApiError('API 응답이 JSON이 아닙니다. .env.local의 API 프록시 주소를 확인해주세요.', response.status, 'INVALID_RESPONSE')
    }
  }

  if (response.status === 401 && token) {
    clearAccessToken()
    window.dispatchEvent(new CustomEvent('auth:expired'))
  }

  if (!response.ok || payload?.success === false) {
    throw new ApiError(
      payload?.error?.message || '요청을 처리하지 못했습니다.',
      response.status,
      payload?.error?.code || 'REQUEST_FAILED',
    )
  }

  return payload?.data ?? payload
}

export const api = {
  signup: (body) => apiRequest('/auth/signup', { method: 'POST', body, auth: false }),
  login: (body) => apiRequest('/auth/login', { method: 'POST', body, auth: false }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  getMe: () => apiRequest('/users/me'),
  updateMe: (body) => apiRequest('/users/me', { method: 'PATCH', body }),
  getGroups: ({ keyword = '', page = 1 } = {}) => {
    const query = new URLSearchParams({ page: String(page) })
    if (keyword.trim()) query.set('keyword', keyword.trim())
    return apiRequest(`/groups?${query}`, { auth: false })
  },
  getGroup: (id) => apiRequest(`/groups/${id}`),
  createGroup: (body) => apiRequest('/groups', { method: 'POST', body }),
  joinGroup: (id) => apiRequest(`/groups/${id}/join`, { method: 'POST' }),
  deleteGroup: (id) => apiRequest(`/groups/${id}`, { method: 'DELETE' }),
  leaveGroup: (id) => apiRequest(`/groups/${id}/leave`, { method: 'POST' }),
  getMyGroups: (type) => apiRequest(`/users/me/groups?type=${encodeURIComponent(type)}`),
  getPurchases: () => apiRequest('/users/me/purchases'),
  getMessages: (id, page = 1) => apiRequest(`/groups/${id}/messages?page=${page}&size=30`),
  sendMessage: (id, content) => apiRequest(`/groups/${id}/messages`, { method: 'POST', body: { content } }),
  requestPayment: (id) => apiRequest(`/groups/${id}/payment-request`, { method: 'POST' }),
  getNotifications: () => apiRequest('/users/me/notifications'),
  readNotifications: () => apiRequest('/users/me/notifications/read', { method: 'POST' }),
  purchaseGroup: (id) => apiRequest(`/groups/${id}/purchase`, { method: 'POST' }),
  chargeCoins: (amount) => apiRequest('/users/me/coins/charge', { method: 'POST', body: { amount } }),
}

export function createGroupSocketUrl(groupId) {
  const token = getAccessToken()
  const configuredUrl = import.meta.env.VITE_WS_BASE_URL
  const socketUrl = configuredUrl
    ? new URL(configuredUrl.replace('{id}', encodeURIComponent(groupId)))
    : new URL(`/ws/groups/${groupId}`, window.location.origin)

  if (!configuredUrl) socketUrl.protocol = socketUrl.protocol === 'https:' ? 'wss:' : 'ws:'
  socketUrl.searchParams.set('token', token || '')
  return socketUrl.toString()
}