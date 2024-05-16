// app/auth/login/page.js o page.tsx
import React from 'react';
import { Login } from '@/components/auth/Login';

const LoginPage = () => {
    return (
        <div className='w-full flex justify-center h-full items-center'>
            <Login />
        </div>
    );
}

export default LoginPage;
