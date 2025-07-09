"use client";

// Session management for multiple simultaneous users
export interface UserSession {
  sessionId: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    region: string;
  };
  createdAt: number;
  lastActivity: number;
}

class SessionManager {
  private static instance: SessionManager;
  private sessions: Map<string, UserSession> = new Map();
  private currentSessionId: string | null = null;

  private constructor() {
    this.loadSessionsFromStorage();
    this.setupStorageListener();
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  private loadSessionsFromStorage(): void {
    try {
      const sessionsData = localStorage.getItem('huib_sessions');
      if (sessionsData) {
        const sessions = JSON.parse(sessionsData);
        this.sessions = new Map(Object.entries(sessions));
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  }

  private saveSessionsToStorage(): void {
    try {
      const sessionsObj = Object.fromEntries(this.sessions);
      localStorage.setItem('huib_sessions', JSON.stringify(sessionsObj));
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  }

  private setupStorageListener(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'huib_sessions') {
          this.loadSessionsFromStorage();
        }
      });
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private cleanupExpiredSessions(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastActivity > maxAge) {
        this.sessions.delete(sessionId);
      }
    }
    this.saveSessionsToStorage();
  }

  createSession(user: any): string {
    this.cleanupExpiredSessions();
    
    const sessionId = this.generateSessionId();
    const session: UserSession = {
      sessionId,
      user,
      createdAt: Date.now(),
      lastActivity: Date.now(),
    };

    this.sessions.set(sessionId, session);
    this.currentSessionId = sessionId;
    this.saveSessionsToStorage();

    // Store current session ID in sessionStorage (tab-specific)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('huib_current_session', sessionId);
    }

    return sessionId;
  }

  getCurrentSession(): UserSession | null {
    if (typeof window === 'undefined') return null;

    // Get session ID from sessionStorage (tab-specific)
    const sessionId = sessionStorage.getItem('huib_current_session');
    if (!sessionId) return null;

    const session = this.sessions.get(sessionId);
    if (session) {
      // Update last activity
      session.lastActivity = Date.now();
      this.saveSessionsToStorage();
      return session;
    }

    return null;
  }

  getCurrentUser(): any | null {
    const session = this.getCurrentSession();
    return session ? session.user : null;
  }

  isLoggedIn(): boolean {
    return this.getCurrentSession() !== null;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      const sessionId = sessionStorage.getItem('huib_current_session');
      if (sessionId) {
        this.sessions.delete(sessionId);
        this.saveSessionsToStorage();
      }
      sessionStorage.removeItem('huib_current_session');
    }
  }

  getAllSessions(): UserSession[] {
    return Array.from(this.sessions.values());
  }

  getSessionById(sessionId: string): UserSession | null {
    return this.sessions.get(sessionId) || null;
  }

  isAdmin(user: any): boolean {
    return user && user.email === 'fonyuydiland@gmail.com';
  }
}

export default SessionManager; 