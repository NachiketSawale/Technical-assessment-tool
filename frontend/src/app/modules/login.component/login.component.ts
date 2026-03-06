import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { Header } from '../../shared/header/header';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [LucideAngularModule, CommonModule, ReactiveFormsModule, Header],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  activeTab: 'employee' | 'admin' = 'employee';
  employeeForm!: FormGroup;
  adminForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
  ) {
    this.adminForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('userRole');
    localStorage.removeItem('quizStarted');

    this.employeeForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@rib-software\\.com$'),
        ],
      ],
    });
    
  }

  switchTab(tab: 'employee' | 'admin') {
    this.activeTab = tab;
  }

  employeeLogin() {
    if (this.employeeForm.invalid) {
      if (this.employeeForm.get('email')?.errors?.['required']) {
        Swal.fire({
          icon: 'warning',
          title: 'Validation Error',
          text: 'Email is required.',
        });
        return;
      }
      if (this.employeeForm.get('email')?.errors?.['email']) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Email',
          text: 'Please enter a valid email address',
        });
        return;
      }
      if (this.employeeForm.get('email')?.errors?.['pattern']) {
        Swal.fire({
          icon: 'warning',
          title: 'Company Email Only',
          text: 'Use @rib-software.com email',
        });
        return;
      }
      if (this.employeeForm.get('email')?.errors?.['email']) {
        this.employeeForm.get('email')?.setErrors({ email: true });
      }
      this.employeeForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const { email } = this.employeeForm.value;
    localStorage.setItem('userRole', 'employee');
    localStorage.setItem('email', email);

    this.loginService.login(this.employeeForm.value).subscribe(
      (response) => {
        this.loginService.loginSuccess(response.token);
        setTimeout(() => {
          this.isLoading = false;
          console.log('Login success');
          this.router.navigate(['/app-pre-quiz-description']);
        }, 2000);
      },
      (error) => {
        console.error('Login error:', error);
        this.isLoading = false;
      },
    );
  }

  adminLogin() {
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }
    console.log('Admin login', this.adminForm.value);
  }
}
