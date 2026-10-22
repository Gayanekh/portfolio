// Saving and publishing a portfolio from the browser, shared by the template
// builder (Minimal, Bold) and the site template editor. Both send the same
// request; only the shape of portfolioData differs by template.

// Carries a message that is safe to show to the user.
export class RequestError extends Error {}

// Reads the body as text first, so a non-JSON response (such as a 413 page)
// cannot throw while handling an error.
async function readResponse(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function failureMessage(
  action: "save" | "publish" | "unpublish",
  status: number,
  body: Record<string, unknown> | null,
) {
  if (status === 413) {
    return `Unable to ${action}: the portfolio is too large (HTTP 413).`;
  }
  if (status === 401) {
    return `Your session has expired. Sign in again to ${action}.`;
  }
  const serverError = typeof body?.error === "string" ? body.error : null;
  return `${serverError ?? `Unable to ${action}.`} (HTTP ${status})`;
}

export async function sendPortfolio(
  action: "save" | "publish",
  templateId: string,
  portfolioData: unknown,
) {
  const response = await fetch(`/api/portfolios/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ templateId, portfolioData }),
  });
  const body = await readResponse(response);
  if (!response.ok) {
    throw new RequestError(failureMessage(action, response.status, body));
  }
  const portfolio = body?.portfolio as { slug?: unknown } | undefined;
  if (typeof portfolio?.slug !== "string") {
    throw new RequestError(`Unable to ${action}: unexpected server response.`);
  }
  return { slug: portfolio.slug };
}

// Takes the page off the web (back to a draft); its address is kept.
export async function unpublishPortfolio() {
  const response = await fetch("/api/portfolios/unpublish", { method: "POST" });
  const body = await readResponse(response);
  if (!response.ok) {
    throw new RequestError(failureMessage("unpublish", response.status, body));
  }
}

// The saved portfolio of the signed-in user, or null when there is none yet.
export interface SavedPortfolio {
  slug: string;
  template_id: string;
  portfolio_data: unknown;
  status: "draft" | "published";
}

export async function loadPortfolio(): Promise<SavedPortfolio | null> {
  const response = await fetch("/api/portfolios");
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const result = await response.json();
  return result.portfolio ?? null;
}
