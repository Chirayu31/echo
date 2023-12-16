'use client'

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
        </RecoilRoot>
    </SessionProvider>
}