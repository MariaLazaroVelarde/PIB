import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MetamaskService } from '../../services/metamask.service';
import { UserService, UserProfile } from '../../services/user.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  Math = Math;
  saldoVisible = true;
  mostrarNotificaciones = false;

  // MetaMask data
  isConnected = false;
  account = '';
  balance = '0';
  ethPriceUSD = 2500; // Precio aproximado de ETH en USD
  balanceUSD = 0;

  // User data
  usuario: UserProfile = {
    nombre: 'Usuario Crypto',
    email: 'usuario@cryptopay.com',
    telefono: '+51 999 888 777',
    fechaNacimiento: '1990-05-15',
    genero: 'masculino',
    direccion: 'Lima, Perú',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    perfilPublico: true,
    mostrarTelefono: false,
    saldo: 1250.75,
  };

  notificaciones = [
    {
      id: 1,
      tipo: 'pago_recibido',
      titulo: 'Pago recibido',
      mensaje: 'Carlos Mendoza te envió S/ 120.50 por servicios',
      tiempo: 'Hace 5 min',
      leida: false,
    },
    {
      id: 2,
      tipo: 'pago_enviado',
      titulo: 'Pago enviado',
      mensaje: 'Enviaste S/ 50.00 a María González',
      tiempo: 'Hace 2 horas',
      leida: false,
    },
    {
      id: 3,
      tipo: 'promocion',
      titulo: '¡Promoción especial!',
      mensaje: 'Transfiere sin comisión hasta el 31 de enero',
      tiempo: 'Ayer',
      leida: true,
    },
    {
      id: 4,
      tipo: 'sistema',
      titulo: 'Actualización de seguridad',
      mensaje: 'Tu cuenta ha sido verificada exitosamente',
      tiempo: 'Hace 2 días',
      leida: true,
    },
    {
      id: 5,
      tipo: 'pago_recibido',
      titulo: 'Nuevo contacto',
      mensaje: 'Ana Ruiz te agregó como contacto favorito',
      tiempo: 'Hace 3 días',
      leida: false,
    },
  ];

  actividadReciente = [
    {
      id: 1,
      nombre: 'María González',
      descripcion: 'Almuerzo en restaurante',
      monto: -50.0,
      fecha: 'Hoy, 2:30 PM',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 2,
      nombre: 'Carlos Mendoza',
      descripcion: 'Pago por servicios',
      monto: 120.5,
      fecha: 'Ayer, 11:45 AM',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 3,
      nombre: 'Ana Ruiz',
      descripcion: 'Transporte compartido',
      monto: -25.75,
      fecha: '13/1/2024',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
  ];

  constructor(
    private router: Router,
    private metamaskService: MetamaskService,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Obtener precio actual de ETH
    this.getETHPrice();

    // Suscribirse a los cambios del usuario
    this.userService.user$.subscribe((user) => {
      this.usuario = user;
      console.log('👤 Usuario actualizado en inicio:', user);
    });

    // Suscribirse a los cambios de MetaMask
    this.metamaskService.connected$.subscribe((connected) => {
      this.isConnected = connected;
      console.log('🔗 Estado de conexión en inicio:', connected);
    });

    this.metamaskService.account$.subscribe((account) => {
      this.account = account || '';
    });

    this.metamaskService.balance$.subscribe((balance) => {
      this.balance = balance;
      // Calcular valor en USD
      this.balanceUSD = parseFloat(balance) * this.ethPriceUSD;
      console.log('💰 Balance en inicio:', balance, 'USD:', this.balanceUSD);
    });
  }

  async getETHPrice() {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      );
      const data = await response.json();
      this.ethPriceUSD = data.ethereum.usd;
      console.log('💵 Precio ETH actualizado:', this.ethPriceUSD);

      // Recalcular balance USD si ya tenemos balance
      if (this.balance !== '0') {
        this.balanceUSD = parseFloat(this.balance) * this.ethPriceUSD;
      }
    } catch (error) {
      console.error('❌ Error obteniendo precio ETH:', error);
      // Usar precio por defecto si falla la API
      this.ethPriceUSD = 2500;
    }
  }

  getShortAddress(): string {
    return this.metamaskService.getShortAddress(this.account);
  }

  async refreshBalance() {
    console.log('🔄 Refrescando balance desde inicio...');
    await this.metamaskService.refreshBalance();
  }

  navegarA(ruta: string) {
    this.router.navigate([ruta]);
  }

  toggleSaldoVisible() {
    this.saldoVisible = !this.saldoVisible;
    // Simular haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }

  mostrarProximamente() {
    this.mostrarMensaje('Función próximamente disponible');
  }

  trackByTransaccion(_index: number, transaccion: any): number {
    return transaccion.id;
  }

  // Métodos para notificaciones
  toggleNotificaciones() {
    this.mostrarNotificaciones = !this.mostrarNotificaciones;

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    // Si se abre el panel, marcar como vistas (pero no leídas)
    if (this.mostrarNotificaciones) {
      this.mostrarMensaje(
        'Tienes ' +
          this.contarNotificacionesNoLeidas() +
          ' notificaciones nuevas'
      );
    }
  }

  cerrarNotificaciones() {
    this.mostrarNotificaciones = false;
  }

  tieneNotificacionesNoLeidas(): boolean {
    return this.notificaciones.some((n) => !n.leida);
  }

  contarNotificacionesNoLeidas(): number {
    return this.notificaciones.filter((n) => !n.leida).length;
  }

  marcarComoLeida(notificacion: any) {
    notificacion.leida = true;

    // Haptic feedback suave
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }

    // Mostrar mensaje de la notificación
    this.mostrarMensaje(notificacion.mensaje);
  }

  marcarTodasComoLeidas() {
    const noLeidas = this.contarNotificacionesNoLeidas();
    this.notificaciones.forEach((n) => (n.leida = true));

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 50, 50]);
    }

    this.mostrarMensaje(`${noLeidas} notificaciones marcadas como leídas`);
  }

  trackByNotificacion(_index: number, notificacion: any): number {
    return notificacion.id;
  }

  // Simular nuevas notificaciones (para demo)
  simularNuevaNotificacion() {
    const nuevaNotificacion = {
      id: Date.now(),
      tipo: 'pago_recibido',
      titulo: 'Nuevo pago recibido',
      mensaje: `Recibiste S/ ${(Math.random() * 100 + 10).toFixed(
        2
      )} de un contacto`,
      tiempo: 'Ahora',
      leida: false,
    };

    this.notificaciones.unshift(nuevaNotificacion);

    // Haptic feedback fuerte
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }

    this.mostrarMensaje('¡Nueva notificación recibida!');
  }

  private mostrarMensaje(mensaje: string) {
    const alerta = document.createElement('div');
    alerta.className =
      'fixed top-4 left-4 right-4 bg-blue-500 text-white p-4 rounded-2xl shadow-lg z-50 transform transition-all duration-300 translate-y-[-100px] mx-auto max-w-sm';
    alerta.innerHTML = `
      <div class="flex items-center space-x-3">
        <svg class="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
        </svg>
        <p class="font-medium">${mensaje}</p>
      </div>
    `;

    document.body.appendChild(alerta);

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }

    setTimeout(() => {
      alerta.style.transform = 'translateY(0)';
    }, 100);

    setTimeout(() => {
      alerta.style.transform = 'translateY(-100px)';
      setTimeout(() => {
        if (document.body.contains(alerta)) {
          document.body.removeChild(alerta);
        }
      }, 300);
    }, 2500);
  }
}
