"use client";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession()

  return (
    <main>
      <nav className="mt-8 ml-12">
        <div className="w-16 h-16 flex items-center rounded-full justify-center text-white text-5xl font-semibold bg-gradient-to-b hover:bg-gradient-to-r from-[#FDF303] via-[#74D018] to-[#00FAA0] pb-2 cursor-pointer">
          <p>
            e
          </p>
        </div>
      </nav>

      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center mt-4">
        empower your finances with echo.
      </h1>

      <div className="mt-16 w-full flex items-center flex-col">
        <p className="leading-7 [&:not(:first-child)]:mt-6 max-w-[550px] text-justify	text-lg">
          Are you ready to take control of your financial future? Meet Echo, your intelligent budgeting companion. Echo utilizes cutting-edge AI technology to revolutionize the way you manage your money, making budgeting simpler, smarter, and more intuitive than ever.
        </p>
        {session && session.user?.email ?
          (
            <>
              <Link href={"/dashboard"}>
                <Button className="mt-10">
                  Go to dashboard
                </Button>
              </Link>
            </>
          ) : (
            <Button className="mt-10" onClick={() => { signIn("google") }}>
              Sign in now!
            </Button>
          )}

      </div>

    </main>
  )
}
