import {
  ChangeDetectorRef,
  Component,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Header } from '../../../shared/header/header';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { QuizService } from '../../../services/quiz.service';
import { Question, SubmitQuizPayload } from '../../../interfaces/question';
import { QuizNavigationComponent } from '../../quiz-navigation-component/quiz-navigation.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-page',
  standalone: true,
  imports: [Header, QuizNavigationComponent, CommonModule],
  templateUrl: './quiz-page-component.html',
  styleUrl: './quiz-page-component.scss',
})
export class QuizPageComponent implements OnInit, OnDestroy {
  timerSub!: Subscription;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private quizService: QuizService,
  ) {}

  // -------------------------
  // Quiz State
  // -------------------------

  quizQuestions: Question[] = [];
  username: string = localStorage.getItem('name') || 'demo@company.com';
  currentQuestionIndex = 0;
  answers = new Map<number, number[]>(); // questionNumber -> selected Option id
  skippedQuestions = new Set<number>();
  timeRemaining = 190;
  quizCompleted = false;
  showSubmitDialog = false;
  startTime = Date.now();
  private timer: any;
  visitedQuestions = new Set<number>();

  // -------------------------
  // Lifecycle
  // -------------------------

  ngOnInit(): void {
    const userRole = localStorage.getItem('userRole');
    if (!userRole || userRole !== 'employee') {
      this.router.navigate(['/']);
    }

    // Mark quiz as started so pre-quiz page cannot be revisited
    localStorage.setItem('quizStarted', 'true');

    // Push a history entry so the browser back button can be intercepted
    history.pushState(null, '', window.location.href);

    this.quizService.getQuestions().subscribe({
      next: (res) => {
        this.quizQuestions = res.map((q) => ({
          ...q,
          isMultipleAnswer: !!q.isMultipleAnswer, // ensures boolean
        }));
        this.markVisited();
        this.startTimer();
      },
      error: (err) => {
        console.error('Error loading questions', err);
      },
    });
  }

  /** Intercept browser back button — keep user on the quiz page */
  @HostListener('window:popstate')
  onPopState(): void {
    history.pushState(null, '', window.location.href);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
  }

  // -------------------------
  // Getters
  // -------------------------

  get currentQuestion(): Question {
    return this.quizQuestions[this.currentQuestionIndex];
  }

  get currentQuestionNumber(): number {
    return this.currentQuestionIndex + 1;
  }

  get totalQuestions(): number {
    return this.quizQuestions.length;
  }

  get answeredQuestions(): Set<number> {
    return new Set(this.answers.keys());
  }
  get answeredQuestionIds(): number[] {
    return Array.from(this.answers.keys());
  }
  get skippedQuestionIds(): number[] {
    return Array.from(this.skippedQuestions.keys()).filter(
      (id) => !this.answeredQuestionIds.includes(id),
    );
  }
  get submittedCount(): number {
    return this.answers.size;
  }

  get skippedCount(): number {
    let count = 0;
    this.visitedQuestions.forEach((qNum) => {
      if (!this.answers.has(qNum) && qNum !== this.currentQuestionNumber) {
        count++;
      }
    });
    return count;
  }
  get timeTaken(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  /** Returns the option the user selected for the current question, or undefined if unanswered */
  get selectedAnswer(): number[] | undefined {
    return this.answers.get(this.currentQuestionNumber);
  }
  isOptionSelected(qNum: number, optionId: number): boolean {
    const selected = this.answers.get(qNum);
    return selected ? selected.includes(optionId) : false;
  }
  get visitedCount(): number {
    return this.visitedQuestions.size;
  }
  submitQuiz() {
    const payload: SubmitQuizPayload = {
      answers: this.quizQuestions.map((q, i) => ({
        questionId: q.id,
        selectedOptionIds: this.answers.has(i + 1) ? this.answers.get(i + 1)! : [],
      })),
      timeTaken: this.timeTaken,
    };

    this.quizService.submitQuiz(payload).subscribe({
      next: (res) => {
        console.log('Result:', res);
        this.router.navigate(['/app-quiz-result'], {
          state: { result: res },
        });
        // logout user after successful submission so protected routes are off limits
        // localStorage.removeItem('token');
        // localStorage.removeItem('userRole');
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  // -------------------------
  // Timer
  // -------------------------

  startTimer(): void {
    this.ngZone.runOutsideAngular(() => {
      this.timer = setInterval(() => {
        if (this.quizCompleted) return;

        if (this.timeRemaining <= 1) {
          this.timeRemaining = 0;
          clearInterval(this.timer);
          this.ngZone.run(() => {
            this.handleQuizSubmit();
            this.cdr.markForCheck();
          });
        } else {
          this.timeRemaining--;
          this.ngZone.run(() => {
            this.cdr.markForCheck();
          });
        }
      }, 1000);
    });
  }

  // -------------------------
  // Handlers
  // -------------------------
  handleAnswerSelect(optionId: number, event: any): void {
  const qNum = this.currentQuestionNumber;

  if (!this.answers.has(qNum)) {
    this.answers.set(qNum, []);
  }

  if (this.currentQuestion.isMultipleAnswer) {
    const selected = this.answers.get(qNum)!;
    if (event.target.checked) {
      if (!selected.includes(optionId)) selected.push(optionId);
    } else {
      this.answers.set(qNum, selected.filter(id => id !== optionId));
    }
  } else {
    this.answers.set(qNum, [optionId]);
  }

  this.saveQuizState();
}
  handleSubmit(): void {
    if (this.currentQuestionIndex === this.totalQuestions - 1) {
      this.showSubmitDialog = true;
    } else {
      this.currentQuestionIndex++;
      this.markVisited();
    }
  }

  saveQuizState(): void {
    const quizState = {
      answers: Array.from(this.answers.entries()),
      skipped: Array.from(this.skippedQuestions),
      currentQuestionIndex: this.currentQuestionIndex,
      timeRemaining: this.timeRemaining,
    };

    localStorage.setItem('quizState', JSON.stringify(quizState));
  }

  handleSkip(): void {
    const questionNumber = this.currentQuestionIndex + 1;

    if (!this.answers.has(questionNumber)) {
      this.skippedQuestions.add(questionNumber);
    }
    this.saveQuizState();

    if (this.currentQuestionIndex < this.totalQuestions - 1) {
      this.currentQuestionIndex++;
      this.markVisited();
    }
  }

  private markVisited(): void {
    if (this.currentQuestion) {
      this.visitedQuestions.add(this.currentQuestionNumber);
    }
  }

  /** Questions that were visited but not yet answered — shown as amber in the navigator */
  get visitedUnanswered(): Set<number> {
    const result = new Set<number>();
    this.visitedQuestions.forEach((qNum) => {
      if (!this.answers.has(qNum) && qNum !== this.currentQuestionNumber) {
        result.add(qNum);
      }
    });
    return result;
  }
  handleQuizSubmit(): void {
    this.quizCompleted = true;
    this.showSubmitDialog = false;

    // mark quiz in progress state so pre-quiz page cannot be revisited
    localStorage.removeItem('quizStarted');

    // perform submission first, then clear auth data on success
    this.submitQuiz();
  }

  handleQuestionSelect(questionNumber: number): void {
    this.currentQuestionIndex = questionNumber - 1;
    this.markVisited();
  }

  handlePrevious(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.markVisited();
    }
  }

  handleNext(): void {
    if (this.currentQuestionIndex < this.totalQuestions - 1) {
      this.currentQuestionIndex++;
      this.markVisited();
    }
  }

  handleRestart(): void {
    this.currentQuestionIndex = 0;
    this.answers.clear();
    this.skippedQuestions.clear();
    this.timeRemaining = 2000;
    this.quizCompleted = false;
  }

  handleLogout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  // Split question text dynamically
getInstruction(text: string): string {
  // First line as instruction
  return text.split('\n')[0];
}

getCode(text: string): string | null {
  // Second line as code snippet
  const lines = text.split('\n');
  return lines.length > 1 ? lines[1] : null;
}
getRemainingLines(text: string): string[] {
  return text.split('\n').slice(2);
}
}
