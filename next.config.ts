import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/projectspage", destination: "/projects", permanent: true },
    ];
  },
  async headers() {
    return [
      ...["/index.md", "/projects.md", "/portfolio.skill.md"].map((source) => ({
        source,
        headers: [
          { key: "Content-Type", value: "text/markdown; charset=utf-8" },
          {
            key: "Link",
            value:
              (source === "/index.md"
                ? '<https://priyanshugupta.com/>; rel="canonical", '
                : source === "/projects.md"
                  ? '<https://priyanshugupta.com/projects>; rel="canonical", '
                  : "") + '</llms.txt>; rel="describedby"',
          },
        ],
      })),
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
