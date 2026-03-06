import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './modules/login.component/login.component';
import { LucideAngularModule, Mail, Lock, UserCircle, ShieldCheck, CheckCircle } from 'lucide-angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,LoginComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Technical Assessment Portal');
}
