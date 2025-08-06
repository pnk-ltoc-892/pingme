import 'next-auth'
import { DefaultSession } from 'next-auth';

// Package being awared of new updated data-type
declare module 'next-auth' {
    interface User{
        _id?: string;
        username?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
    }
    interface Session{
        user: {
            _id?: string;
            username?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
        } & DefaultSession['user']  // default key
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        username?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
    }
}