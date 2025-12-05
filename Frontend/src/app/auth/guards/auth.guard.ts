import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    
    // Check if user has a valid access token
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken) {
        // Token exists, allow access
        return true;
    } else {
        // No token, redirect to login
        console.warn('🔒 Access denied - No auth token found. Redirecting to login...');
        router.navigate(['/login'], { 
            queryParams: { returnUrl: state.url } 
        });
        return false;
    }
};
