import { NextApiRequest, NextApiResponse } from "next";

export default function robots(req: NextApiRequest, res: NextApiResponse) {
  const baseUrl = "http://localhost:3000";

  const robots = `# Robot.txt para GlowFinder
# Permitir acceso a todos los bots de búsqueda

User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /static/

# Sitemap
Sitemap: ${baseUrl}/api/sitemap.xml

# Bots específicos
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Crawl-delay
Crawl-delay: 1`;

  res.setHeader("Content-Type", "text/plain");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate"
  );
  res.write(robots);
  res.end();
}
