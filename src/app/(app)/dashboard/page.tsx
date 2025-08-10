'use client'
import { MessageCard } from '@/components/MessageCard.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { Switch } from '@/components/ui/switch.tsx'
import { Message } from '@/model/Message.model.ts'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema.ts'
import { ApiResponse } from '@/types/ApiResponse.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'


const UserDashboard = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)

    const { data: session } = useSession()

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })
    const { register, watch, setValue } = form;

    const acceptMessages = watch('acceptMessage')

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }


    // Fetch if user is accepting messages
    const fetchAcceptMessages = useCallback(
        async () => {
            setIsSwitchLoading(true)
            try {
                const response = await axios.get<ApiResponse>('/api/accept-messages');
                // @ts-ignore
                setValue('acceptMessage', response.data.isAcceptingMessages);
            }
            catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast("Error", {
                    description: axiosError.response?.data.message ?? 'Failed to fetch message settings',
                })
            }
            finally {
                setIsSwitchLoading(false);
            }
        },
        [setValue])


    // Fetch Messages
    const fetchMessages = useCallback(
        async (refresh: boolean = false) => {
            setIsLoading(true);
            setIsSwitchLoading(false);
            try {
                const response = await axios.get<ApiResponse>('/api/get-messages');
                setMessages(response.data.messages || []);
                if (refresh) {
                    toast("Refreshed Messages", {
                        description: 'Showing latest messages',
                    })
                }
            }
            catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast("Error", {
                    description: axiosError.response?.data.message ?? 'Failed to fetch messages',
                })
            }
            finally {
                setIsLoading(false);
                setIsSwitchLoading(false);
            }
        },
        [setIsLoading, setMessages]
    );


    // Handle switch change
    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages,
            });
            setValue('acceptMessage', !acceptMessages);
            toast(response.data.message)
        }
        catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast('Error', {
                description:
                    axiosError.response?.data.message ??
                    'Failed to update message settings'
            });
        }
    };

    // Fetch initial state from the server
    useEffect(() => {
        if (!session || !session.user) return;

        fetchMessages();
        fetchAcceptMessages();
    }, [session, setValue, fetchAcceptMessages, fetchMessages]);


    // session.user => Do it optionally => session?.user
    const user = session?.user as User;

    const [baseURL, setBaseURL] = useState("")
    const [profileURL, setProfileURL] = useState("")
    
    useEffect(() => {
        setBaseURL(`${window.location.protocol}//${window.location.host}`)
        setProfileURL(`${baseURL}/u/${user?.username || ""}`)
    }, [user?.username]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileURL);
        toast('URL Copied!', {
            description: 'Profile URL has been copied to clipboard.',
        });
    };

    if (!session || !session.user) {
        return <div></div>;
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileURL}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register('acceptMessage')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard
                            // @ts-ignore
                            key={message._id}
                            // @ts-ignore
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    );
}


export default UserDashboard