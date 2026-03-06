import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  Chart,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

Chart.register(BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

@Component({
  selector: 'app-quiz-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-result.component.html',
  styleUrls: ['./quiz-result.component.scss'],
})
export class QuizResultComponent implements OnInit, OnDestroy {
  @Input() totalQuestions!: number;
  @Input() submittedCount!: number;
  @Input() skippedCount!: number;
  @Input() timeTaken!: number;
  @Input() correctCount!: number;

  @Output() restart = new EventEmitter<void>();
  candidateName = 'Dhanshri Chaudhari';

  totalScore = 78;

  subjects = [
    { name: 'C#', score: 85 },
    { name: 'SQL', score: 72 },
    { name: 'Angular', score: 60 },
  ];

  recommendedCourses = [
    'Advanced Angular',
    'ASP.NET Core Best Practices',
    'SQL Query Optimization',
  ];
  constructor(private router: Router) {
    const nav = history.state;
    this.totalQuestions = nav.result.totalQuestions;
    this.submittedCount = nav.result.submittedCount;
    this.skippedCount = nav.result.skippedCount;
    this.timeTaken = nav.result.timeTaken;
    this.correctCount = nav.result.correctAnswers;
  }

  ngOnInit(): void {
    // AuthGuard has already verified the token above — now clear it so every
    // subsequent navigation to a protected route redirects to login.
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('quizStarted');
    localStorage.removeItem('quizState');

    // Push a history entry so the browser back button can be intercepted
    history.pushState(null, '', window.location.href);
  }
  ngAfterViewInit() {
    const ctx: any = document.getElementById('subjectChart');

    new Chart('subjectChart', {
      type: 'bar',
      data: {
        labels: this.subjects.map((s) => s.name),
        datasets: [
          {
            label: 'Score',
            data: this.subjects.map((s) => s.score),
          },
        ],
      },
    });
  }

  ngOnDestroy(): void {
    // Token already cleared in ngOnInit; nothing extra needed.
  }

  /** Intercept browser back button — keep user on the result page */
  @HostListener('window:popstate')
  onPopState(): void {
    history.pushState(null, '', window.location.href);
  }
  get completionRate(): number {
    if (!this.totalQuestions) return 0;
    return (this.submittedCount / this.totalQuestions) * 100;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec`;
  }

  onRestartClick(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }

 downloadPDF(){

const element=document.getElementById('reportSection');

html2canvas(element!).then(canvas=>{

const img=canvas.toDataURL('image/png');

const pdf=new jsPDF('p','mm','a4');

pdf.addImage(img,'PNG',10,10,190,0);

pdf.save("AssessmentReport.pdf");

});}
  getPerformance(score: number) {
    if (score >= 80) return 'Excellent';

    if (score >= 60) return 'Good';

    return 'Moderate';
  }
}
