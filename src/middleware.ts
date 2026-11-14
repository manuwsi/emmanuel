import { NextResponse, type NextRequest } from 'next/server';

/**
 * Soutrame's own domain. Once a domain such as soutrame.com is added to this Vercel project,
 * list it here: visitors on that domain see the shop at the root, while the portfolio
 * keeps serving it at /soutrame.
 */
const SHOP_HOSTS = ['soutrame.com', 'www.soutrame.com', 'soutrame.fr', 'www.soutrame.fr', 'soutrame.store', 'www.soutrame.store'];

export function middleware(req: NextRequest) {
  const host = (req.headers.get('host') ?? '').toLowerCase().split(':')[0];
  if (SHOP_HOSTS.includes(host) && req.nextUrl.pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/soutrame';
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/'] };
