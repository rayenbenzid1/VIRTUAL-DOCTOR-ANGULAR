import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Get the auth token from localStorage
    const authToken = localStorage.getItem('accessToken');

    // If a token exists, clone the request and add the Authorization header
    if (authToken) {
        console.log('🔑 Adding Auth Token to request:', req.url);
        const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${authToken}`)
        });
        return next(authReq);
    } else {
        console.warn('⚠️ No Auth Token found for request:', req.url);
    }

    // If no token, pass the original request along
    return next(req);
};
