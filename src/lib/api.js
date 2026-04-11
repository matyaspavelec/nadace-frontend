const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

async function request(path, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, ...data };
  }

  return data;
}

export const api = {
  // Auth
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  verifyEmail: (token) => request(`/auth/verify-email?token=${token}`),
  getProfile: () => request('/auth/me'),
  updateMyProfile: (data) => request('/auth/me', { method: 'PATCH', body: JSON.stringify(data) }),
  deleteMyAccount: (data) => request('/auth/me', { method: 'DELETE', body: JSON.stringify(data) }),
  changePassword: (data) => request('/auth/change-password', { method: 'POST', body: JSON.stringify(data) }),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (data) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),

  // Users (admin)
  getUsers: (params = '') => request(`/users?${params}`),
  getUser: (id) => request(`/users/${id}`),
  updateUserStatus: (id, data) => request(`/users/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
  updateUserRole: (id, data) => request(`/users/${id}/role`, { method: 'PATCH', body: JSON.stringify(data) }),
  updateUserTrust: (id, data) => request(`/users/${id}/trust`, { method: 'PATCH', body: JSON.stringify(data) }),
  updateUserProfile: (id, data) => request(`/users/${id}/profile`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Interviews
  getInterviews: (params = '') => request(`/interviews?${params}`),
  createInterview: (data) => request('/interviews', { method: 'POST', body: JSON.stringify(data) }),
  updateInterview: (id, data) => request(`/interviews/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Projects
  getPublicProjects: (params = '') => request(`/projects/public?${params}`),
  getPublicProject: (id) => request(`/projects/public/${id}`),
  getMyProjects: () => request('/projects/my'),
  submitProject: (formData) => request('/projects', { method: 'POST', body: formData, headers: {} }),
  getAdminProjects: (params = '') => request(`/projects/admin?${params}`),
  getAdminProject: (id) => request(`/projects/admin/${id}`),
  updateProjectStatus: (id, data) => request(`/projects/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
  updateProjectInternal: (id, data) => request(`/projects/${id}/internal`, { method: 'PATCH', body: JSON.stringify(data) }),
  updateProjectDetail: (id, data) => request(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  requestCompletion: (id, data) => request(`/projects/${id}/request-completion`, { method: 'POST', body: JSON.stringify(data) }),

  // Reviews
  addReview: (data) => request('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  getProjectReviews: (projectId) => request(`/reviews/project/${projectId}`),

  // Votes
  vote: (data) => request('/votes', { method: 'POST', body: JSON.stringify(data) }),
  getMyVote: (projectId) => request(`/votes/my/${projectId}`),
  getVoteResults: (projectId) => request(`/votes/results/${projectId}`),

  // Comments
  addComment: (data) => request('/comments', { method: 'POST', body: JSON.stringify(data) }),
  getComments: (projectId) => request(`/comments/project/${projectId}`),
  hideComment: (id, data) => request(`/comments/${id}/hide`, { method: 'PATCH', body: JSON.stringify(data) }),
  unhideComment: (id) => request(`/comments/${id}/unhide`, { method: 'PATCH' }),
  deleteComment: (id) => request(`/comments/${id}`, { method: 'DELETE' }),

  // Admin
  getStats: () => request('/admin/stats'),
  getAuditLog: (params = '') => request(`/admin/audit-log?${params}`),
  getNotifications: () => request('/admin/notifications'),
  markNotificationRead: (id) => request(`/admin/notifications/${id}/read`, { method: 'PATCH' }),

  // CMS
  getPages: () => request('/cms/pages'),
  getPage: (slug) => request(`/cms/pages/${slug}`),
  getAdminPages: () => request('/cms/pages-admin'),
  createPage: (data) => request('/cms/pages-admin', { method: 'POST', body: JSON.stringify(data) }),
  updatePage: (id, data) => request(`/cms/pages-admin/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePage: (id) => request(`/cms/pages-admin/${id}`, { method: 'DELETE' }),
  getDocuments: (params = '') => request(`/cms/documents?${params}`),
  getNews: (params = '') => request(`/cms/news?${params}`),
  getNewsArticle: (id) => request(`/cms/news/${id}`),
  createNews: (data) => request('/cms/news-admin', { method: 'POST', body: JSON.stringify(data) }),
  updateNews: (id, data) => request(`/cms/news-admin/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteNews: (id) => request(`/cms/news-admin/${id}`, { method: 'DELETE' }),
  uploadDocument: (formData) => request('/cms/documents-admin', { method: 'POST', body: formData, headers: {} }),
  deleteDocument: (id) => request(`/cms/documents-admin/${id}`, { method: 'DELETE' }),
};
