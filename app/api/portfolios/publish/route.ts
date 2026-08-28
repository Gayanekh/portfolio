import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSlug, getUniqueSlug, isPortfolioData } from "@/lib/portfolios";

export async function POST(request: Request) {
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

    const body = await request.json();
    const templateId = body?.templateId;
    const portfolioData = body?.portfolioData;

    if (
      !(["minimal", "bold"] as string[]).includes(templateId) ||
      !isPortfolioData(portfolioData)
    ) {
      return NextResponse.json(
        { error: "Portfolio data is invalid." },
        { status: 400 },
      );
    }

    const { data: existing, error: existingError } = await supabase
      .from("portfolios")
      .select("id, slug")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingError) throw existingError;

    const slug =
      existing?.slug ||
      (await getUniqueSlug(supabase, createSlug(portfolioData.name)));
    const now = new Date().toISOString();
    const { data: record, error } = await supabase
      .from("portfolios")
      .upsert(
        {
          ...(existing?.id ? { id: existing.id } : {}),
          user_id: user.id,
          slug,
          template_id: templateId,
          portfolio_data: portfolioData,
          published_portfolio_data: portfolioData,
          status: "published",
          published_at: now,
          updated_at: now,
        },
        { onConflict: "user_id" },
      )
      .select("id, slug, template_id, status, published_at, updated_at")
      .single();

    if (error) throw error;
    return NextResponse.json({ portfolio: record });
  } catch (error) {
    console.error("Portfolio publish failed", error);
    return NextResponse.json(
      { error: "Unable to publish your portfolio." },
      { status: 500 },
    );
  }
}
