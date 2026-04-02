export default function handler(req: any, res: any) {
    const host =
        req.headers.host?.replace(/^www\./, '') || 'agraristech.by';

    const baseUrl = `https://${host}`;
    const now = new Date().toISOString();

    const urls = [
        '/',
        '/about',
        '/catalog',
        '/contacts',
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
        .map(
            (path) => `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${path === '/' ? '1.0' : '0.8'}</priority>
  </url>`
        )
        .join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.status(200).send(xml);
}