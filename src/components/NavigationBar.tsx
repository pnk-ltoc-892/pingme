'use client'

import React from 'react'
import { Button } from './ui/button.tsx'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { User } from 'next-auth'


const session = true
const NavigationBar = () => {

    const {data: session} = useSession()
    // console.log(data);

    const user: User = session?.user as User  // as User: assertion to fix ts error

    return (
        <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a href="#" className="text-xl font-bold mb-4 md:mb-0">
                    True Feedback
                </a>
                {session ? (
                    <>
                        <span className="mr-4">
                            Welcome, {user?.username || user?.email}
                        </span>
                        <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
                            Logout
                        </Button>
                    </>
                ) : (
                    <Link href="/sign-in">
                        <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button>
                    </Link>
                )}
            </div>
        </nav>
    )
}

export default NavigationBar