"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/hooks/use-user"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWardrobeStore } from "@/stores/wardrobe"

export default function SettingsPage() {
  const { data: userData, isLoading, refetch } = useUser()
  const addToast = useWardrobeStore((s) => s.addToast)

  const [fullName, setFullName] = useState(""),
    [isEditing, setIsEditing] = useState(false),
    [saving, setSaving] = useState(false)

  useEffect(() => {
    if (userData?.profile) {
      setFullName(userData.profile.full_name ?? "")
    }
  }, [userData])

  const updateProfile = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? "Failed to update profile")
      }
      return res.json()
    },
    onSuccess: () => {
      addToast("PROFILE UPDATED", "success")
      setIsEditing(false)
      refetch()
    },
    onError: (err) => {
      addToast(err.message ?? "Failed to update profile", "error")
    },
  })

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin border-4 border-[#1A1A1A] border-t-[#A8FF3E] mx-auto" />
          <p className="mt-2 font-label text-xs uppercase tracking-wider text-[#8A8A7A]">
            LOADING PROFILE...
          </p>
        </div>
      </div>
    )
  }

  if (!userData?.user) {
    return (
      <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
        <p className="font-label text-sm uppercase tracking-wider text-[#8A8A7A]">
          NOT LOGGED IN
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      <div className="border-2 border-[#1A1A1A] bg-[#FFF8F0] p-4">
        <h2 className="font-display text-xl font-bold uppercase tracking-wider text-[#1A1A1A] mb-4">
          ACCOUNT
        </h2>

        {isEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              updateProfile.mutate()
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="fullName">FULL NAME</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setFullName(userData.profile?.full_name ?? "")
                }}
                disabled={updateProfile.isPending}
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? "SAVING..." : "SAVE"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="font-label text-xs uppercase tracking-wider text-[#8A8A7A]">
                EMAIL
              </p>
              <p className="font-bold text-[#1A1A1A]">{userData.user.email}</p>
            </div>

            <div className="space-y-2">
              <p className="font-label text-xs uppercase tracking-wider text-[#8A8A7A]">
                FULL NAME
              </p>
              <p className="font-bold text-[#1A1A1A]">
                {userData.profile?.full_name ?? "—"}
              </p>
            </div>

            <Button onClick={() => setIsEditing(true)} className="mt-2">
              EDIT PROFILE
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
