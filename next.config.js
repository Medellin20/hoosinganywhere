/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (supabaseUrl) {
  const { protocol, hostname, port, pathname } = new URL(supabaseUrl);

  if (protocol === 'https:' || protocol === 'http:') {
    nextConfig.images.remotePatterns.push({
      protocol: protocol === 'https:' ? 'https' : 'http',
      hostname,
      port,
      pathname: `${pathname.replace(/\/$/, '')}/storage/v1/object/public/property-images/**`,
    });
  }
}

module.exports = nextConfig;
