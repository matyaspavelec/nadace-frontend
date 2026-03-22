export const REGISTRATION_STATUSES = {
  NEW: 'Nová registrace',
  PENDING_REVIEW: 'Čeká na kontrolu',
  INVITED_FOR_INTERVIEW: 'Pozván k pohovoru',
  APPROVED: 'Schváleno',
  REJECTED: 'Zamítnuto',
  BLOCKED: 'Zablokováno',
};

export const TRUST_LEVELS = {
  NEW_MEMBER: 'Nový člen',
  ACTIVE_BENEFICIAL: 'Aktivní a přínosný',
  UNPROBLEMATIC: 'Bezproblémový',
  CONFLICTING: 'Konfliktní',
  COMMENT_RESTRICTED: 'Omezené komentáře',
};

export const ROLES = {
  USER: 'Uživatel',
  REGISTRATION_MANAGER: 'Správce registrací',
  PROJECT_REVIEWER: 'Hodnotitel projektů',
  CONTENT_EDITOR: 'Editor obsahu',
  COMMENT_MODERATOR: 'Moderátor komentářů',
  ADMIN: 'Administrátor',
};

export const PROJECT_STATUSES = {
  SUBMITTED: 'Podáno',
  FORMAL_REVIEW: 'Formální kontrola',
  WAITING_FOR_COMPLETION: 'Čeká na doplnění',
  REJECTED_UNSUITABLE: 'Zamítnuto jako nevhodné',
  SENT_FOR_INTERVIEW: 'Předáno k projednání',
  APPROVED_FOR_PUBLICATION: 'Schváleno ke zveřejnění',
  PUBLISHED_FOR_VOTING: 'Zveřejněno k hlasování',
  VOTING_ENDED: 'Hlasování ukončeno',
  RECOMMENDED_FOR_REALIZATION: 'Doporučeno k realizaci',
  POSTPONED: 'Odloženo',
  REJECTED: 'Zamítnuto',
  IN_REALIZATION: 'Realizuje se',
  COMPLETED: 'Dokončeno',
  ARCHIVED: 'Archivováno',
};

export const PROJECT_CATEGORIES = {
  YOUTH: 'Mládež',
  SPORT: 'Sport',
  CULTURE: 'Kultura',
  PUBLIC_SPACE: 'Veřejný prostor',
  EDUCATION: 'Vzdělávání',
  HISTORY_TRADITIONS: 'Historie a tradice',
  SOCIAL_HELP: 'Sociální pomoc',
  SMALL_INVESTMENT: 'Drobná investice',
  LARGE_INVESTMENT: 'Větší investice',
  OTHER: 'Ostatní',
};

export const BUDGET_SIZES = {
  SMALL: 'Malý',
  MEDIUM: 'Střední',
  LARGE: 'Velký',
};

export const INTERVIEW_RESULTS = {
  PENDING: 'Čeká',
  RECOMMENDED: 'Doporučen',
  NOT_RECOMMENDED: 'Nedoporučen',
  POSTPONED: 'Odložen',
};

export const STATUS_COLORS = {
  NEW: '#6b7280',
  PENDING_REVIEW: '#f59e0b',
  INVITED_FOR_INTERVIEW: '#3b82f6',
  APPROVED: '#10b981',
  REJECTED: '#ef4444',
  BLOCKED: '#dc2626',
  SUBMITTED: '#6b7280',
  FORMAL_REVIEW: '#f59e0b',
  WAITING_FOR_COMPLETION: '#f97316',
  REJECTED_UNSUITABLE: '#ef4444',
  SENT_FOR_INTERVIEW: '#8b5cf6',
  APPROVED_FOR_PUBLICATION: '#10b981',
  PUBLISHED_FOR_VOTING: '#3b82f6',
  VOTING_ENDED: '#6366f1',
  RECOMMENDED_FOR_REALIZATION: '#059669',
  POSTPONED: '#9ca3af',
  IN_REALIZATION: '#0891b2',
  COMPLETED: '#16a34a',
  ARCHIVED: '#64748b',
};
