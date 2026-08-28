import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    const { data: portfolio, error } = await supabase
      .from("portfolios")
      .select(
        "id, slug, template_id, portfolio_data, status, published_at, updated_at",
      )
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) throw error;
    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error("Portfolio load failed", error);
    return NextResponse.json(
      { error: "Unable to load your portfolio." },
      { status: 500 },
    );
  }
}
