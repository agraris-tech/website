const ALLOWED_HOSTS = new Set([
    'agraristech.by',
    'agraris.ru',
    'agraris.tech',
]);

function getCurrentHost(req: any): string {
    const forwardedHost = req.headers['x-forwarded-host'];

    const rawHost =
        (
            Array.isArray(forwardedHost)
                ? forwardedHost[0]
                : forwardedHost
        ) ||
        req.headers.host ||
        'agraristech.by';

    const cleanHost = String(rawHost)
        .split(',')[0]
        .trim()
        .toLowerCase()
        .replace(/^www\./, '')
        .split(':')[0];

    return ALLOWED_HOSTS.has(cleanHost)
        ? cleanHost
        : 'agraristech.by';
}

export default function handler(req: any, res: any) {
    const host = getCurrentHost(req);

    const robots = [
        'User-agent: *',
        'Allow: /',
        '',
        `Sitemap: https://${host}/sitemap.xml`,
        '',
    ].join('\n');

    res.setHeader(
        'Content-Type',
        'text/plain; charset=utf-8',
    );

    res.setHeader(
        'Cache-Control',
        'public, max-age=0, s-maxage=3600',
    );

    return res.status(200).send(robots);
}