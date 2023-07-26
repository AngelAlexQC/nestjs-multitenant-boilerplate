import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';

const defaultOptions: SweetAlertOptions = {
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  // colors
  background: '#fff',
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
};

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  success(message: string, options?: SweetAlertOptions): void {
    Swal.fire({
      ...defaultOptions,
      ...options,
      icon: 'success',
      title: message,
    });
  }

  error(message: string, options?: SweetAlertOptions): void {
    Swal.fire({
      ...defaultOptions,
      ...options,
      icon: 'error',
      title: message,
    });
  }
}
