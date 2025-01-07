/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
          {
            source: '/signout',
            destination: 'http://34.133.212.1:3000/', // Replace with the URL you want
            permanent: false, // Set to true if it's a permanent redirect
          },
        ];
      },
};

export default nextConfig;
