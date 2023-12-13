import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Acme Dashboard',
    short_name: 'Acme Dashboard',
    description: 'The official Next.js Learn Dashboard built with App Router.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    orientation: 'any',
  };
}
