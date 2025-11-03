import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly EMAIL_KEY = 'userEmail';

  constructor(private router: Router) { }

  login(email: string): void {
    const mockToken = btoa(email + Date.now());
    localStorage.setItem(this.TOKEN_KEY, mockToken);
    localStorage.setItem(this.EMAIL_KEY, email);
    this.router.navigate(['/departamentos']);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EMAIL_KEY);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.TOKEN_KEY) !== null;
  }

  getUserEmail(): string | null {
    return localStorage.getItem(this.EMAIL_KEY);
  }
}
