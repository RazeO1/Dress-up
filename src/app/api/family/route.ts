import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { generateInviteCode } from "@/lib/utils";

const createGroupSchema = z.object({
  name: z.string().min(1).max(50),
});

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get groups user is member of
  const { data: memberships, error: mError } = await supabase
    .from("family_members")
    .select("group_id, role")
    .eq("user_id", user.id);

  if (mError) return NextResponse.json({ error: mError.message }, { status: 500 });

  const groupIds = (memberships || []).map((m) => m.group_id);
  if (groupIds.length === 0) return NextResponse.json({ data: [] });

  const { data: groups, error: gError } = await supabase
    .from("family_groups")
    .select(`
      *,
      family_members (
        user_id,
        role,
        profiles (id, full_name, avatar_url)
      )
    `)
    .in("id", groupIds);

  if (gError) return NextResponse.json({ error: gError.message }, { status: 500 });
  return NextResponse.json({ data: groups });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = createGroupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const inviteCode = generateInviteCode();

  const { data: group, error } = await supabase
    .from("family_groups")
    .insert({ name: parsed.data.name, created_by: user.id, invite_code: inviteCode })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Add creator as owner
  await supabase.from("family_members").insert({
    group_id: group.id,
    user_id: user.id,
    role: "owner",
  });

  return NextResponse.json({ data: group });
}
