export function getHostname() {
    if (typeof window === 'undefined') return '';
    return window.location.hostname.replace(/^www\./, '');
}