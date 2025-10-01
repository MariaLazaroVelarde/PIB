import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MetamaskService } from '../../services/metamask.service';
import { UserService, UserProfile } from '../../services/user.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  isConnected = false;
  account = '';
  balance = '0';

  usuario: UserProfile = {
    nombre: 'Usuario Crypto',
    email: 'usuario@cryptopay.com',
    telefono: '+51 999 888 777',
    fechaNacimiento: '1990-05-15',
    genero: 'masculino',
    direccion: 'Lima, Perú',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    perfilPublico: true,
    mostrarTelefono: false
  };

  menuItems = [
    {
      icon: 'shield',
      titulo: 'Seguridad',
      subtitulo: 'PIN, biometría y más',
      ruta: '/seguridad'
    },
    {
      icon: 'bell',
      titulo: 'Notificaciones',
      subtitulo: 'Configura tus alertas',
      ruta: '/notificaciones'
    },
    {
      icon: 'bank',
      titulo: 'Cuentas bancarias',
      subtitulo: 'Administra tus cuentas',
      ruta: '/cuentas-bancarias'
    },
    {
      icon: 'help',
      titulo: 'Ayuda y soporte',
      subtitulo: 'Centro de ayuda',
      ruta: '/ayuda'
    },
    {
      icon: 'document',
      titulo: 'Términos y condiciones',
      subtitulo: 'Políticas de uso',
      ruta: '/terminos'
    },
    {
      icon: 'info',
      titulo: 'Acerca de',
      subtitulo: 'Versión 2.1.0',
      ruta: '/acerca-de'
    }
  ];

  constructor(
    private router: Router,
    private metamaskService: MetamaskService,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Suscribirse a los cambios del usuario
    this.userService.user$.subscribe(user => {
      this.usuario = user;
      console.log('👤 Usuario actualizado en perfil:', user);
    });

    this.metamaskService.connected$.subscribe(connected => {
      this.isConnected = connected;
      console.log('🔗 Estado de conexión:', connected);
    });

    this.metamaskService.account$.subscribe(account => {
      this.account = account || '';
      console.log('👤 Cuenta actual:', account);
    });

    this.metamaskService.balance$.subscribe(balance => {
      this.balance = balance;
      console.log('💰 Balance actualizado:', balance);
    });

    // Verificar red actual
    this.checkNetwork();
  }

  async checkNetwork() {
    if (this.isConnected) {
      await this.metamaskService.getCurrentNetwork();
    }
  }

  async refreshBalance() {
    console.log('🔄 Refrescando balance...');
    await this.metamaskService.refreshBalance();
  }

  navegarA(ruta: string) {
    this.router.navigate([ruta]);
  }

  cerrarSesion() {
    // Desconectar MetaMask
    this.metamaskService.disconnect();

    // Mostrar mensaje de confirmación
    console.log('Sesión cerrada exitosamente');

    // Redirigir al login
    this.router.navigate(['/login']);
  }

  getShortAddress(): string {
    return this.metamaskService.getShortAddress(this.account);
  }
}
