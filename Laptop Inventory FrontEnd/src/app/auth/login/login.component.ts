import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FeaturesService } from '../../features/features.service';
import { CommonModule } from '@angular/common'; // ✅ Import this

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule], // ✅ Add this line
})
export class LoginComponent {
  @ViewChild('usernameInput') usernameInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private featuresService: FeaturesService,
    private zone: NgZone
  ) {}

  login() {
    const email = this.usernameInput.nativeElement.value;
    const password = this.passwordInput.nativeElement.value;

    this.featuresService.login({ email, password }).subscribe({
      next: (response: any) => {
        if (response.token) {
          sessionStorage.setItem('auth_token', response.token);
          this.zone.run(() => this.router.navigate(['/main/dashboard']));
        } else if (response.message) {
          this.errorMessage = response.message;
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMessage = err?.error?.message || 'Login failed';
      },
    });
  }

  ngOnInit(): void {
    const token = sessionStorage.getItem('auth_token');
    if (token) {
      this.router.navigate(['/main/dashboard']);
    }
  }
  
}
