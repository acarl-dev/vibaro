import type { NextConfig } from "next";

function getApiStorageRemotePattern() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    return null;
  }

  try {
    const patternUrl = new URL(apiBaseUrl);
    patternUrl.pathname = "/storage/**";
    patternUrl.search = "";
    patternUrl.hash = "";

    return patternUrl;
  } catch {
    return null;
  }
}

const apiStorageRemotePattern = getApiStorageRemotePattern();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      ...(apiStorageRemotePattern ? [apiStorageRemotePattern] : []),
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      // Spotify cover art (oEmbed thumbnails)
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "mosaic.scdn.co" },
      // YouTube thumbnails
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      // SoundCloud artwork
      { protocol: "https", hostname: "i1.sndcdn.com" },
      { protocol: "https", hostname: "i2.sndcdn.com" },
      { protocol: "https", hostname: "i3.sndcdn.com" },
      { protocol: "https", hostname: "i4.sndcdn.com" },
      // Apple Music
      { protocol: "https", hostname: "is1-ssl.mzstatic.com" },
      { protocol: "https", hostname: "is2-ssl.mzstatic.com" },
      { protocol: "https", hostname: "is3-ssl.mzstatic.com" },
      { protocol: "https", hostname: "is4-ssl.mzstatic.com" },
      { protocol: "https", hostname: "is5-ssl.mzstatic.com" },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
