import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mi-qr',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mi-qr.component.html',
  styleUrls: ['./mi-qr.component.css']
})
export class MiQrComponent {
  usuario = {
    nombre: 'Juan Pérez',
    telefono: '+51 999 888 777',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  };

  constructor(private router: Router) {}

  compartirQR() {
    // Simular compartir QR
    this.mostrarAlerta('QR compartido exitosamente');
  }

  descargarQR() {
    // Simular descarga de QR
    this.mostrarAlerta('QR descargado en la galería');
  }

  mostrarAlerta(mensaje: string) {
    const alerta = document.createElement('div');
    alerta.className = 'fixed top-4 left-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-y-[-100px]';
    alerta.innerHTML = `
      <div class="flex items-center space-x-3">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
        </svg>
        <p class="font-medium">${mensaje}</p>
      </div>
    `;

    document.body.appendChild(alerta);

    setTimeout(() => {
      alerta.style.transform = 'translateY(0)';
    }, 100);

    setTimeout(() => {
      alerta.style.transform = 'translateY(-100px)';
      setTimeout(() => {
        document.body.removeChild(alerta);
      }, 300);
    }, 2000);
  }

  shouldShowWhite(index: number): boolean {
    // Patrón simple para simular un QR code
    const patterns = [
      0,1,0,1,1,0,1,0,
      1,0,1,0,0,1,0,1,
      0,1,1,1,0,1,1,0,
      1,0,0,1,1,0,0,1,
      1,1,0,0,1,1,0,0,
      0,0,1,1,0,0,1,1,
      1,0,1,0,1,0,1,0,
      0,1,0,1,0,1,0,1
    ];
    return patterns[index % patterns.length] === 1;
  }

  volver() {
    this.router.navigate(['/perfil']);
  }
}
