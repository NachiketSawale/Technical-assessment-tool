import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login.component/login.component';
import { PreQuizDescriptionComponent } from './modules/pre-quiz-component/pre-quiz-component/pre-quiz-description.component';
import { QuizPageComponent } from './modules/quiz-page-component/quiz-page-component/quiz-page-component';
import { QuizResultComponent } from './modules/quiz-result.compoent/quiz-result.component/quiz-result.component';


export const routes: Routes = [
  { path: '', redirectTo: 'app-login', pathMatch: 'full' },
  {
    path: 'app-login',
    component: LoginComponent,
    // canActivate: [AuthGuard], // redirect logged-in users away from the login page
  },
  {
    path: 'app-pre-quiz-description',
    component: PreQuizDescriptionComponent,
    // canActivate: [AuthGuard], // redirect logged-in users away from the login page
  },
  {
    path: 'app-quiz-page',
    component: QuizPageComponent,
    // canActivate: [AuthGuard], // redirect logged-in users away from the login page
  },
  {
    path: 'app-quiz-result',
    component: QuizResultComponent,
    // canActivate: [AuthGuard], // redirect logged-in users away from the login page
  },
];
