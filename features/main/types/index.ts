export interface Banner { id: string; imageUrl: string; link: string; type: 'floating' | 'admin'; }
export interface NotificationItem { id: string; title: string; body: string; isRead: boolean; createdAt: string; }
export interface ChatMessage { id: string; role: 'user' | 'bot'; content: string; createdAt: string; }
export interface SearchResult { id: string; title: string; description?: string; type: string; }
