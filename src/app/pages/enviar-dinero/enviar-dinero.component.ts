import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-enviar-dinero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enviar-dinero.component.html',
  styleUrls: ['./enviar-dinero.component.css']
})
export class EnviarDineroComponent implements OnInit {
  monto = '';
  descripcion = '';
  contactoSeleccionado: any = null;

  contactosRecientes = [
    {
      nombre: 'María',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      nombre: 'Ana',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      nombre: 'Laura',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Verificar si se pasó información de contacto desde la página de contactos
    this.route.queryParams.subscribe(params => {
      if (params['contacto']) {
        this.contactoSeleccionado = {
          nombre: params['contacto'],
          telefono: params['telefono']
        };
      }
    });
  }

  agregarNumero(numero: string) {
    if (numero === '.' && this.monto.includes('.')) return;
    if (this.monto.length < 10) {
      this.monto += numero;
    }
  }

  borrarUltimo() {
    this.monto = this.monto.slice(0, -1);
  }

  get montoNumerico() {
    return parseFloat(this.monto) || 0;
  }

  get puedeEnviar() {
    return this.montoNumerico > 0 && this.contactoSeleccionado;
  }

  seleccionarContacto(contacto: any) {
    this.contactoSeleccionado = contacto;
  }

  verTodosContactos() {
    this.router.navigate(['/contactos']);
  }

  enviarDinero() {
    if (!this.puedeEnviar) return;

    // Simular envío exitoso
    this.mostrarAlertaExito();
  }

  mostrarAlertaExito() {
    // Crear alerta de éxito con Tailwind CSS
    const alerta = document.createElement('div');
    alerta.className = 'fixed top-4 left-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-y-[-100px]';
    alerta.innerHTML = `
      <div class="flex items-center space-x-3">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <div>
          <p class="font-semibold">¡Pago enviado exitosamente!</p>
          <p class="text-sm">S/ ${this.montoNumerico.toFixed(2)} enviado a ${this.contactoSeleccionado.nombre}</p>
        </div>
      </div>
    `;

    document.body.appendChild(alerta);

    // Animar entrada
    setTimeout(() => {
      alerta.style.transform = 'translateY(0)';
    }, 100);

    // Remover después de 3 segundos
    setTimeout(() => {
      alerta.style.transform = 'translateY(-100px)';
      setTimeout(() => {
        document.body.removeChild(alerta);
        this.router.navigate(['/inicio']);
      }, 300);
    }, 3000);
  }

  volver() {
    this.router.navigate(['/contactos']);
  }
}
