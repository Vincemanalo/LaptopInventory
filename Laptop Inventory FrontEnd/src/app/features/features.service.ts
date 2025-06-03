import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeaturesService {
  private baseUrl = 'http://10.0.0.1:3000';

  constructor(private http: HttpClient) {}

  // AUTHENTICATION --------------------------------------------------------------------------------------------------------------
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }

  logout(): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    return this.http.post(
      `${this.baseUrl}/auth/logout`,
      {},
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  // LAPTOP ---------------------------------------------------------------------------------------------------------------------
  addLaptop(laptop: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http
      .post<any>(`${this.baseUrl}/device/laptop`, laptop, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  getAllLaptop(page: number = 1, pageSize: number = 10, laptopName?: string, laptopSerialNumber?: string): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (laptopName) {
      params = params.set('laptopName', laptopName);
    }
    if (laptopSerialNumber) {
      params = params.set('laptopSerialNumber', laptopSerialNumber);
    }

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
      params,
    };

    return this.http.get<any>(`${this.baseUrl}/device/laptop`, options).pipe(
      map((data: any) => data),
      retry(3),
      catchError(this.handleError)
    );
  }

  getLaptopById(id: number): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http
      .get<any>(`${this.baseUrl}/device/laptop/${id}`, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  updateLaptop(id: number, laptop: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http
      .put<any>(`${this.baseUrl}/device/laptop/${id}`, laptop, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  disableLaptop(id: number): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http
      .patch<any>(`${this.baseUrl}/device/laptop/${id}`, { status: 'disabled' }, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  // DESKTOP ---------------------------------------------------------------------------------------------------------------------
  addDesktop(desktop: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http
      .post<any>(`${this.baseUrl}/device/desktop`, desktop, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  getAllDesktop(page: number = 1, pageSize: number = 10, desktopName?: string, desktopSerialNumber?: string): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (desktopName) {
      params = params.set('desktopName', desktopName);
    }
    if (desktopSerialNumber) {
      params = params.set('desktopSerialNumber', desktopSerialNumber);
    }

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
      params,
    };

    return this.http.get<any>(`${this.baseUrl}/device/desktop`, options).pipe(
      map((data: any) => data),
      retry(3),
      catchError(this.handleError)
    );
  }

  getDesktopById(id: number): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http
      .get<any>(`${this.baseUrl}/device/desktop/${id}`, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  updateDesktop(id: number, desktop: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http
      .put<any>(`${this.baseUrl}/device/desktop/${id}`, desktop, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  disableDesktop(id: number): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http
      .patch<any>(`${this.baseUrl}/device/desktop/${id}`, { status: 'disabled' }, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  // EMPLOYEE ---------------------------------------------------------------------------------------------------------------------
  addEmployee(employee: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http
      .post<any>(`${this.baseUrl}/user/employee`, employee, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  getAllEmployee(page: number = 1, pageSize: number = 10, search: string = ''): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('search', search.trim());
  
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
      params,
    };
  
    return this.http.get<any>(`${this.baseUrl}/user/employee`, options).pipe(
      map((data: any) => data),
      retry(3),
      catchError(this.handleError)
    );
  }
  
  getEmployeeById(id: number): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http
      .get<any>(`${this.baseUrl}/user/employee/${id}`, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  updateEmployee(id: number, employeeData: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http
      .put<any>(`${this.baseUrl}/user/employee/${id}`, employeeData, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  disableEmployee(id: string): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http
      .patch<any>(`${this.baseUrl}/user/employee/${id}`, { status: 'disabled' }, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  // SERVER ---------------------------------------------------------------------------------------------------------------------
  addServer(server: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http
      .post<any>(`${this.baseUrl}/device/server`, server, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  getAllServer(page: number = 1, pageSize: number = 10, search: string = ''): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('search', search.trim());
  
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
      params,
    };
  
    return this.http.get<any>(`${this.baseUrl}/device/server`, options).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  
  updateServer(id: string, server: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http
      .put<any>(`${this.baseUrl}/device/server/${id}`, server, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  disableServer(id: string): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http
      .patch<any>(`${this.baseUrl}/device/server/${id}`, { status: 'disabled' }, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  getAllDisabledServer(): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http
      .get<any>(`${this.baseUrl}/device/server/archived`, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  retrieveServer(id: string): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http
      .patch<any>(`${this.baseUrl}/device/server/archived/${id}`, {}, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  // ERROR HANDLING --------------------------------------------------------------------------------------------------------------
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
      return throwError(() => new Error(error.error.message));
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}`);
      const errorMessage = error.error?.message || 'Something bad happened; please try again later.';
      return throwError(() => new Error(errorMessage));
    }
  }
}
