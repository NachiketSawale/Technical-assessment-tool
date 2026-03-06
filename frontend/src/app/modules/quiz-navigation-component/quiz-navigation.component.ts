import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-navigation.component.html',
  styleUrls: ['./quiz-navigation.component.scss'],
})
export class QuizNavigationComponent {
  @Input() totalQuestions!: number;
  @Input() currentQuestion!: number;

  // Using arrays only (clean & simple)
  @Input() answeredQuestions!: Set<number>;
  @Input() skippedQuestions!: Set<number>;

  @Output() questionSelect = new EventEmitter<number>();
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  get questionArray(): number[] {
    return Array.from({ length: this.totalQuestions }, (_, i) => i + 1);
  }

 getButtonClass(questionNum: number): string {

  if (this.currentQuestion === questionNum) {
    return 'active';
  }

  if (this.answeredQuestions?.has(questionNum)) {
    return 'answered';
  }

  if (this.skippedQuestions?.has(questionNum)) {
    return 'skipped';
  }

  return 'unanswered';
}

  onQuestionClick(questionNum: number) {
    this.questionSelect.emit(questionNum);
  }
}
