import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  bucket: z.enum(["wardrobe-images", "wardrobe-thumbnails", "body-photos", "try-on-results"]),
  fileName: z.string().min(1),
  contentType: z.string().regex(/^image\/(jpeg|png|webp)$/),
});

export async function POST(request: Request) {
  const supabase = await createAdminClient();
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const path = `${user.id}/${Date.now()}-${parsed.data.fileName}`;

  const { data, error } = await supabase.storage
    .from(parsed.data.bucket)
    .createSignedUploadUrl(path);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: { ...data, path } });
}
