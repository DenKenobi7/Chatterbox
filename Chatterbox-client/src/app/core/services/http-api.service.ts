import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from "src/environments/environment";
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  observe: 'response' as 'body',
  params: new HttpParams()
}

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient
  ) {}

  private formatErrors(error:any) {
    return  throwError(error.error);
  }

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    httpOptions.params=params
    return this.http.get<T>(`${environment.apiUrl}${path}`, httpOptions)
      .pipe(catchError(this.formatErrors));
  }

  put<T>(path: string, body: any = {}): Observable<any> {
    return this.http.put<T>(
      `${environment.apiUrl}${path}`,
      JSON.stringify(body),
      httpOptions
    ).pipe(catchError(this.formatErrors));
  }

  post<T>(path: string, body: any = {}): Observable<any> {
    return this.http.post<T>(
      `${environment.apiUrl}${path}`,
      JSON.stringify(body),
      httpOptions
    ).pipe(catchError(this.formatErrors));
  }

  delete<T>(path: string): Observable<any> {
    return this.http.delete<T>(
      `${environment.apiUrl}${path}`,httpOptions
    ).pipe(catchError(this.formatErrors));
  }
}
