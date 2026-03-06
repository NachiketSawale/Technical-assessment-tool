import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  // USER LOGIN
  @Input() username: string | null = null;

  // controls quiz stats visibility
  @Input() showQuizStats: boolean = false;

  // QUIZ DATA (only used when logged in)
  @Input() timeRemaining!: number;
  @Input() totalQuestions!: number;
  @Input() submittedCount!: number;
  @Input() skippedCount!: number;
  @Input() currentQuestionNumber!: number;
  warningShown: boolean = false;
  
   ngOnChanges(changes: SimpleChanges) {
    if (changes['timeRemaining'] && !this.warningShown) {
      if (this.timeRemaining <= 180) { // 3 minutes = 180 seconds
        this.showWarning();
        this.warningShown = true;
      }
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${this.pad(mins)}:${this.pad(secs)}`;
  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  get progress(): number {
    if (!this.totalQuestions) return 0;
    return (this.submittedCount / this.totalQuestions) * 100;
  }

  get isLowTime(): boolean {
    return this.timeRemaining < 300;
  }

   showWarning() {
    Swal.fire({
      title: '⚠️ Hurry Up!',
      text: 'Only 3 minutes left to complete your quiz!',
      icon: 'warning',
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
      background: '#1e293b',
      color: '#fff',
    });
  }
}