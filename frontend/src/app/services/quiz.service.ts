import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Question, SubmitQuizPayload, QuizResult, Option } from '../interfaces/question';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private apiUrl = 'https://localhost:7035/api/Questions/live';
   //private githubUrl = 'https://api.github.com/repos/DhanshriS1808/quiz-data/contents/quiz/quiz.json';
  constructor(private http: HttpClient) {}

  // getQuestions() {
  //   const token = localStorage.getItem('token');

  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`
  //   });

  //   return this.http.get<Question[]>(this.apiUrl, { headers }).pipe(
  //     map((data) =>
  //       data.map((q) => ({
  //         id: q.id,
  //         question: q.question,
  //         options: q.options,
        
  //       }))
  //     )
  //   );
  // }
getQuestions() {
  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  // Normalize various possible backend shapes into the frontend `Question` interface.
  return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
    map((data) =>
      data.map((q) => {
        const rawOptions = q.options ?? q.optionsList ?? q.answers ?? q.choices ?? [] as Option[];

        const options = Array.isArray(rawOptions)
          ? rawOptions.map((o: any, idx: number) => ({
              id: o.id ?? o.optionId ?? o.option_id ?? idx + 1,
              optionText: o.text ?? o.optionText ?? o.answer ?? o.value ?? o.option ?? '',
              questionId: o.questionId ?? q.id,

            }))
          : [];

        return {
          id: q.id ?? q.questionId ?? null,
          questionText: q.questionText ?? q.question ?? q.title ?? q.question_text ?? '',
          options,
          correctAnswer: q.correctAnswer ?? q.correctOption ?? q.answerId ?? null,
          isLive: q.isLive ?? q.live ?? true,
           isMultipleAnswer: !!q.isMultipleAnswer, // ✅ convert to boolean
        } as Question;
      }),
    ),
  );
}
  // getQuestions(): Observable<Question[]> {
  //   const headers = new HttpHeaders({
  //     Accept: 'application/vnd.github.v3+json',
  //   });

  //   return this.http.get<any>(this.githubUrl, { headers }).pipe(
  //     map((res) => {
  //       // res.content is Base64 encoded
  //       const data = JSON.parse(atob(res.content));

  //       return data.map((q: any) => {
  //         const rawOptions = q.options ?? q.optionsList ?? q.answers ?? q.choices ?? [];

  //         const options = Array.isArray(rawOptions)
  //           ? rawOptions.map((o: any, idx: number) => ({
  //               id: o.id ?? o.optionId ?? o.option_id ?? idx + 1,
  //               optionText:
  //                 o.text ?? o.optionText ?? o.answer ?? o.value ?? o.option ?? '',
  //               questionId: o.questionId ?? q.id,
  //             }))
  //           : [];

  //         return {
  //           id: q.id ?? q.questionId ?? null,
  //           questionText:
  //             q.questionText ?? q.question ?? q.title ?? q.question_text ?? '',
  //           options,
  //           correctAnswer: q.correctAnswer ?? q.correctOption ?? q.answerId ?? null,
  //           isLive: q.isLive ?? q.live ?? true,
  //           isMultipleAnswer: !!q.isMultipleAnswer,
  //         } as Question;
  //       });
  //     })
  //   );
  // }

 submitQuiz(payload: SubmitQuizPayload) {

  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.post<QuizResult>('https://localhost:7035/api/Quiz/submit',payload,{ headers });
}
}