export default function handler(req: any, res: any) {
    const host =
        req.headers.host?.replace(/^www\./, '') || 'agraristech.by';

    const robots = `User-agent: *
Allow: /

Sitemap: https://${host}/sitemap.xml`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(robots);
}