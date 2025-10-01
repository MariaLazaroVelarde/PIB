import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent {
  Math = Math;

  resumen = {
    enviado: 161.05,
    recibido: 320.50
  };

  transacciones = [
    {
      nombre: 'María González',
      descripcion: 'Almuerzo en restaurante',
      monto: -50.00,
      fecha: '15/1, 09:30 a. m.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      tipo: 'enviado'
    },
    {
      nombre: 'Carlos Mendoza',
      descripcion: 'Pago por servicios',
      monto: 120.50,
      fecha: '14/1, 11:45 a. m.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      tipo: 'recibido'
    },
    {
      nombre: 'Ana Ruiz',
      descripcion: 'Transporte compartido',
      monto: -25.75,
      fecha: '13/1, 04:15 a. m.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      tipo: 'enviado'
    },
    {
      nombre: 'Roberto Silva',
      descripcion: 'Transferencia familiar',
      monto: 200.00,
      fecha: '12/1, 06:20 a. m.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      tipo: 'recibido'
    },
    {
      nombre: 'Laura Vega',
      descripcion: 'Compras en supermercado',
      monto: -85.30,
      fecha: '10/1, 01:30 p. m.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      tipo: 'enviado'
    }
  ];

  filtroActivo = 'todos';

  get transaccionesFiltradas() {
    if (this.filtroActivo === 'todos') {
      return this.transacciones;
    }
    return this.transacciones.filter(t => t.tipo === this.filtroActivo);
  }

  cambiarFiltro(filtro: string) {
    this.filtroActivo = filtro;
  }
}
