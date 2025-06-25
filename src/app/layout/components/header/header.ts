import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { SessionStorage } from '@shared/services/session-storage';
import { NavigationEnd, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  showLogOutButton = signal(false);
  sessionStorageService = inject(SessionStorage);
  router = inject(Router);
  sub!: Subscription;

  ngOnInit(){
    let validateRoute = this.router.url !== '/';
    this.showLogOutButton.set(validateRoute);
    this.sub = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      validateRoute = this.router.url !== '/';
      this.showLogOutButton.set(validateRoute);
    });
  }
  
  logout(){
    Swal.fire({
        title: 'Are you sure you want to log out?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#ec4899',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.sessionStorageService.removeItem('formData');
          this.router.navigate(['/home']);
        }
      });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
