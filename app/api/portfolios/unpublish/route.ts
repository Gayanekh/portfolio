import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Takes the signed-in user's page off the web: back to a draft, so /p/<slug>
// no longer shows it (get_published_portfolio only returns published pages).
// The page and its address are kept; publishing again puts it back.
export async function POST() {
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

    const { data: record, error } = await supabase
      .from("portfolios")
      .update({ status: "draft", updated_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .select("id, slug, template_id, status, updated_at")
      .maybeSingle();

    if (error) throw error;
    if (!record) {
      return NextResponse.json(
        { error: "There is no page to unpublish yet." },
        { status: 404 },
      );
    }
    return NextResponse.json({ portfolio: record });
  } catch (error) {
    console.error("Portfolio unpublish failed", error);
    return NextResponse.json(
      { error: "Unable to unpublish your portfolio." },
      { status: 500 },
    );
  }
}
