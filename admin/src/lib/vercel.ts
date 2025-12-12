export async function getVercelAnalytics() {
  const token = process.env.VERCEL_API_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!token || !projectId) {
    console.warn("Missing Vercel credentials");
    return null;
  }

  const url = new URL("https://vercel.com/api/v1/web/analytics/stats");
  url.searchParams.set("projectId", projectId);
  if (teamId) url.searchParams.set("teamId", teamId);
  
  // Get stats for the last 30 days
  const from = new Date();
  from.setDate(from.getDate() - 30);
  url.searchParams.set("from", from.toISOString());
  url.searchParams.set("to", new Date().toISOString());
  url.searchParams.set("environment", "production");

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Vercel Analytics Error:", error);
      return null;
    }

    const data = await res.json();
    
    // Sum up visitors from the data points
    const totalVisitors = data.data?.reduce((acc: number, curr: any) => acc + curr.visitors, 0) || 0;
    
    return {
      visitors: totalVisitors,
      days: 30
    };
  } catch (error) {
    console.error("Failed to fetch Vercel analytics:", error);
    return null;
  }
}
