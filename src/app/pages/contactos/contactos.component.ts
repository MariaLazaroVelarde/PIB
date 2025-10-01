import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contactos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.css']
})
export class ContactosComponent {
  busqueda = '';
  filtroActivo = 'todos';

  favoritos = [
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

  contactos = [
    {
      nombre: 'María González',
      telefono: '+51 987 654 321',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      esFavorito: true
    },
    {
      nombre: 'Carlos Mendoza',
      telefono: '+51 976 543 210',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      esFavorito: false
    },
    {
      nombre: 'Ana Ruiz',
      telefono: '+51 965 432 109',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      esFavorito: true
    },
    {
      nombre: 'Roberto Silva',
      telefono: '+51 954 321 098',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      esFavorito: false
    },
    {
      nombre: 'Laura Vega',
      telefono: '+51 943 210 987',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      esFavorito: true
    }
  ];

  constructor(private router: Router) {}

  get contactosFiltrados() {
    let contactosFiltrados = this.contactos;

    if (this.filtroActivo === 'favoritos') {
      contactosFiltrados = contactosFiltrados.filter(c => c.esFavorito);
    }

    if (this.busqueda.trim()) {
      contactosFiltrados = contactosFiltrados.filter(c =>
        c.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        c.telefono.includes(this.busqueda)
      );
    }

    return contactosFiltrados;
  }

  get conteoFavoritos() {
    return this.contactos.filter(c => c.esFavorito).length;
  }

  cambiarFiltro(filtro: string) {
    this.filtroActivo = filtro;
  }

  enviarDinero(contacto: any) {
    this.router.navigate(['/enviar-dinero'], {
      queryParams: {
        contacto: contacto.nombre,
        telefono: contacto.telefono
      }
    });
  }

  toggleFavorito(contacto: any) {
    contacto.esFavorito = !contacto.esFavorito;
  }
}
