import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { WardrobeItem, WardrobeItemInsert } from "@/types"

export function useWardrobeItems(category?: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ["items", category],
    queryFn: async (): Promise<WardrobeItem[]> => {
      let query = supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false })

      if (category && category !== "all") {
        query = query.eq("category", category)
      }

      const { data, error } = await query
      if (error) throw error
      return (data as WardrobeItem[]) ?? []
    },
  })
}

export function useCreateItem() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (item: WardrobeItemInsert) => {
      const { data, error } = await supabase
        .from("items")
        .insert([item])
        .select()
        .single()
      if (error) throw error
      return data as WardrobeItem
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] })
    },
  })
}

export function useUpdateItem(id: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: Partial<WardrobeItem>) => {
      const { data, error } = await supabase
        .from("items")
        .update(updates)
        .eq("id", id)
        .select()
        .single()
      if (error) throw error
      return data as WardrobeItem
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] })
    },
  })
}

export function useDeleteItem() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("items").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] })
    },
  })
}
