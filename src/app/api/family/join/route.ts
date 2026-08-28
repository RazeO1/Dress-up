import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  invite_code: z.string().min(6).max(6),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Find group by invite code
  const { data: group, error: gError } = await supabase
    .from("family_groups")
    .select("id")
    .eq("invite_code", parsed.data.invite_code.toUpperCase())
    .single();

  if (gError || !group) {
    return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
  }

  // Check if already a member
  const { data: existing } = await supabase
    .from("family_members")
    .select("role")
    .eq("group_id", group.id)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    return NextResponse.json({ error: "Already a member" }, { status: 400 });
  }

  // Add as member
  const { error: mError } = await supabase.from("family_members").insert({
    group_id: group.id,
    user_id: user.id,
    role: "member",
  });

  if (mError) return NextResponse.json({ error: mError.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
