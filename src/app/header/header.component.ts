import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userEmail: string | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
