import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Get the auth token from localStorage
    const authToken = localStorage.getItem('accessToken');

    // If a token exists, clone the request and add the Authorization header
    if (authToken) {
        const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${authToken}`)
        });
        return next(authReq);
    }

    // If no token, pass the original request along
    return next(req);
};
