"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
})

const signupSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
})

interface AuthFormProps {
  mode: "login" | "signup"
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const schema = mode === "login" ? loginSchema : signupSchema

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: mode === "login"
      ? { email: "", password: "" }
      : { full_name: "", email: "", password: "" },
  })

  async function onSubmit(data: { email: string; password: string; full_name?: string }) {
    setLoading(true)
    setError(null)
    const supabase = createClient()

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (error) {
        setError(error.message)
      } else {
        router.push("/wardrobe")
        router.refresh()
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.full_name ?? "" },
        },
      })
      if (error) {
        setError(error.message)
      } else {
        router.push("/wardrobe")
        router.refresh()
      }
    }
    setLoading(false)
  }

  return (
    <div className="mx-auto w-full max-w-[420px]">
      <div className="border-2 border-[#1A1A1A] bg-[#FFF8F0] p-6 shadow-[8px_8px_0_#1A1A1A]">
        <div className="mb-6 text-center">
          <p className="font-label text-xs uppercase tracking-widest text-[#8A8A7A]">
            {mode === "login" ? "01 ACCOUNT" : "02 ACCOUNT"}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#1A1A1A]">
            {mode === "login" ? "LOG IN" : "CREATE ACCOUNT"}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1">
              <Label htmlFor="full_name">NAME</Label>
              <Input
                id="full_name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                {...register("full_name")}
              />
              {errors.full_name && (
                <p className="text-xs text-[#FF3366]">{String(errors.full_name.message)}</p>
              )}
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="email">EMAIL</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-[#FF3366]">{String(errors.email.message)}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">PASSWORD</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-[#FF3366]">{String(errors.password.message)}</p>
            )}
          </div>

          {error && (
            <div className="border-l-4 border-l-[#FF3366] bg-[#FFF8F0] p-3">
              <p className="text-sm text-[#FF3366]">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1A1A1A] border-t-transparent" />
                {mode === "login" ? "SIGNING IN..." : "CREATING..."}
              </span>
            ) : mode === "login" ? (
              "SIGN IN →"
            ) : (
              "CREATE ACCOUNT →"
            )}
          </Button>
        </form>

        <div className="mt-6 border-t-2 border-[#1A1A1A] pt-4 text-center">
          {mode === "login" ? (
            <p className="text-sm text-[#8A8A7A]">
              No account?{" "}
              <a href="/signup" className="font-bold text-[#1A1A1A] hover:underline">
                Create one →
              </a>
            </p>
          ) : (
            <p className="text-sm text-[#8A8A7A]">
              Already have an account?{" "}
              <a href="/login" className="font-bold text-[#1A1A1A] hover:underline">
                Sign in →
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
