"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginFormField, RegisterFormField } from "@/components/site/form/field-form"
import type { AccountRole } from "@/lib/auth/session"

export const SiteLogin = () => (
  <Card className="w-full">
    <CardHeader className="text-center">
      <CardTitle className="text-2xl font-bold text-hw-grey-900">Welcome Back</CardTitle>
      <CardDescription>Enter your email and password to access your account</CardDescription>
    </CardHeader>
    <CardContent className="px-0">
      <LoginFormField />
    </CardContent>
  </Card>
)

export const SiteRegister = ({ role }: { role: AccountRole }) => {
  const isUser = role === "USER"

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-hw-grey-900">
          Join As A {isUser ? "User" : "Professional"}
        </CardTitle>
        <CardDescription>
          {isUser ? "Book trusted artisans near you." : "Get jobs from customers near you."}{" "}
          <Link href={isUser ? "/register?role=artisan" : "/register"} className="text-hw-primary">
            {isUser ? "Are you an artisan?" : "Looking to hire?"}
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {/* key: reset the form when switching role */}
        <RegisterFormField key={role} role={role} />
      </CardContent>
    </Card>
  )
}
