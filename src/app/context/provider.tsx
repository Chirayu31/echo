'use client'

import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "next-auth/react"
import { RecoilRoot } from "recoil"

export default function AuthProvider({
    children,
    session
}: {
    children: React.ReactNode
    session: any
}): React.ReactNode {
    return <SessionProvider session={session}>
        <RecoilRoot>
            {children}
            <Toaster />
        </RecoilRoot>
    </SessionProvider>
}