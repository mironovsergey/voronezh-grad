import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  // Check if this is a udata request that should return XML
  const isUdataRequest = url.includes('udata://');
  console.log('[API Proxy] Is udata request:', isUdataRequest);

  // Determine final fetch URL
  let targetUrl = url;
  const isAbsolute = url.startsWith('http://') || url.startsWith('https://');
  if (isUdataRequest || isAbsolute) {
    // use URL as-is (for udata:// or absolute URLs)
    targetUrl = url;
  } else if (url.startsWith('/')) {
    targetUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}.json`;
  } else {
    targetUrl = `${process.env.NEXT_PUBLIC_API_URL}/${url}.json`;
  }

  console.log('[API Proxy] Final URL to fetch:', targetUrl);

  try {
    console.log('[API Proxy] Sending request to:', targetUrl);
    const response = await fetch(targetUrl);
    console.log('[API Proxy] Response status:', response.status);
    console.log('[API Proxy] Response content-type:', response.headers.get('content-type'));

    if (!response.ok) {
      console.log('[API Proxy] Error response from API');
      return NextResponse.json(
        { error: `API returned status ${response.status}` },
        { status: response.status }
      );
    }

    // For udata requests, return XML response
    if (isUdataRequest) {
      const xmlText = await response.text();
      console.log('[API Proxy] XML response length:', xmlText.length);
      console.log('[API Proxy] XML response preview:', xmlText.substring(0, 200) + '...');

      return new NextResponse(xmlText, {
        headers: {
          'Content-Type': 'application/xml',
        },
      });
    }

    // For other requests, return JSON as before
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[API Proxy] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
