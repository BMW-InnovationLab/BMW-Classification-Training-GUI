import {
    HttpEvent,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
    HttpInterceptor
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

export class ErrorHandler implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = error.error && error.error.detail || '';
                if (errorMessage === '' || error.status === 500 || error.status === 404) {
                    errorMessage = 'An error has occurred';
                }
                return throwError(errorMessage);
            }));
    }
}
