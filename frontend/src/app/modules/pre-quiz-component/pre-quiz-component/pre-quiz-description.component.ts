import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Header } from '../../../shared/header/header';



@Component({
  selector: 'app-pre-quiz-description',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    Header
  ],
  templateUrl: './pre-quiz-description.component.html',
  styleUrls: ['./pre-quiz-description.component.scss']
})
export class PreQuizDescriptionComponent implements OnInit {

  // username: string = localStorage.getItem('name') || 'employee@company.com';

  quizTitle = 'Frontend Technical Assessment';

  totalQuestions = 20;
  totalTime = 30;
   username: string = localStorage.getItem('name') || 'demo@company.com';
  isConfirmed = false;

  constructor(private router: Router) {}

  ngOnInit(): void {

    const role = localStorage.getItem('userRole');

    // allow only employee
    if (!role || role !== 'employee') {
      this.router.navigate(['/']);
      return;
    }

    // prevent reload cheating
    if (localStorage.getItem('quizStarted') === 'true') {
      this.router.navigate(['/app-quiz-page']);
    }
  }

  startQuiz() {
    localStorage.setItem('quizStarted', 'true');
    this.router.navigate(['/app-quiz-page']);
  }
}