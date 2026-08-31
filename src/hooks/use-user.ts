import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/types"

export function useUser() {
  const supabase = createClient()

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return null

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (error) throw error
      return { user, profile: profile as Profile }
    },
    retry: false,
  })
}
