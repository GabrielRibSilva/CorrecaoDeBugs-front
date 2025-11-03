import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../header/header.component';

@Component({
  selector: 'app-admin', // O seletor não importa muito, mas mantive o padrão do Angular
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    <app-header></app-header>
    <main class="content-wrapper">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: `
    .content-wrapper {
      padding: 1.5rem;
    }
  `
})
export class AdminComponent { }
