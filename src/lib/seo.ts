interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
}

interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

class SEOService {
  private currentConfig: SEOConfig | null = null;

  // Update page SEO metadata
  updateSEO(config: SEOConfig) {
    this.currentConfig = config;
    this.updateTitle(config.title);
    this.updateMetaDescription(config.description);
    this.updateKeywords(config.keywords);
    this.updateOpenGraph(config);
    this.updateTwitterCard(config);
    this.updateCanonicalUrl(config.canonicalUrl);
    this.updateStructuredData(config);
  }

  private updateTitle(title: string) {
    let titleElement = document.querySelector('title');
    if (!titleElement) {
      titleElement = document.createElement('title');
      document.head.appendChild(titleElement);
    }
    titleElement.textContent = title;
  }

  private updateMetaDescription(description: string) {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
  }

  private updateKeywords(keywords: string[]) {
    let keywordsElement = document.querySelector('meta[name="keywords"]');
    if (!keywordsElement) {
      keywordsElement = document.createElement('meta');
      keywordsElement.setAttribute('name', 'keywords');
      document.head.appendChild(keywordsElement);
    }
    keywordsElement.setAttribute('content', keywords.join(', '));
  }

  private updateOpenGraph(config: SEOConfig) {
    const ogProperties = [
      { property: 'og:title', content: config.title },
      { property: 'og:description', content: config.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
    ];

    if (config.ogImage) {
      ogProperties.push({ property: 'og:image', content: config.ogImage });
    }

    ogProperties.forEach(({ property, content }) => {
      let ogElement = document.querySelector(`meta[property="${property}"]`);
      if (!ogElement) {
        ogElement = document.createElement('meta');
        ogElement.setAttribute('property', property);
        document.head.appendChild(ogElement);
      }
      ogElement.setAttribute('content', content);
    });
  }

  private updateTwitterCard(config: SEOConfig) {
    const twitterCard = config.twitterCard || 'summary';
    
    let twitterElement = document.querySelector('meta[name="twitter:card"]');
    if (!twitterElement) {
      twitterElement = document.createElement('meta');
      twitterElement.setAttribute('name', 'twitter:card');
      document.head.appendChild(twitterElement);
    }
    twitterElement.setAttribute('content', twitterCard);

    // Add other Twitter meta tags
    const twitterTags = [
      { name: 'twitter:title', content: config.title },
      { name: 'twitter:description', content: config.description },
    ];

    if (config.ogImage) {
      twitterTags.push({ name: 'twitter:image', content: config.ogImage });
    }

    twitterTags.forEach(({ name, content }) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });
  }

  private updateCanonicalUrl(url?: string) {
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', url || window.location.href);
  }

  private updateStructuredData(config: SEOConfig) {
    const structuredData: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Pa J.I. Emerhana Foundation',
      'description': config.description,
      'url': window.location.href,
      'logo': 'https://emerhana-foundation.org/logo.png',
      'image': config.ogImage || 'https://emerhana-foundation.org/default-image.jpg',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Niger Delta',
        'addressCountry': 'NG',
      },
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+234-8055551696',
        'contactType': 'customer service',
        'email': 'info@emerhana-foundation.org',
      },
      'sameAs': [
        'https://facebook.com/emerhanafoundation',
        'https://twitter.com/emerhanafoundation',
        'https://linkedin.com/company/emerhanafoundation',
      ],
    };

    let ldJsonElement = document.querySelector('script[type="application/ld+json"]');
    if (!ldJsonElement) {
      ldJsonElement = document.createElement('script');
      ldJsonElement.setAttribute('type', 'application/ld+json');
      document.head.appendChild(ldJsonElement);
    }
    ldJsonElement.textContent = JSON.stringify(structuredData);
  }

  // Generate SEO meta tags for different pages
  generatePageMeta(page: string) {
    const metaConfig: Record<string, SEOConfig> = {
      home: {
        title: 'Pa J.I. Emerhana Foundation — Leadership & Development',
        description: 'Raising visionary leaders for the sustainable development of the Niger Delta. The Pa J.I. Emerhana Foundation for Leadership & Development.',
        keywords: ['Leadership development Niger Delta', 'Leadership foundation Nigeria', 'Girl child education Nigeria', 'Niger Delta development'],
        ogImage: '/assets/emerhana.jpg',
        twitterCard: 'summary_large_image',
      },
      about: {
        title: 'About — Pa J.I. Emerhana Foundation',
        description: 'Learn about the mission, vision, and values of the Pa J.I. Emerhana Foundation for Leadership & Development in the Niger Delta.',
        keywords: ['About Pa J.I. Emerhana Foundation', 'Leadership mission Nigeria', 'Niger Delta development foundation'],
        ogImage: '/assets/emerhana.jpg',
      },
      programs: {
        title: 'Programs — Pa J.I. Emerhana Foundation',
        description: 'Explore the leadership, education, and development programmes of the Pa J.I. Emerhana Foundation.',
        keywords: ['Leadership programs Nigeria', 'Education foundation Niger Delta', 'Development programs Nigeria'],
        ogImage: '/assets/emerhana.jpg',
      },
      donate: {
        title: 'Donate — Pa J.I. Emerhana Foundation',
        description: 'Support the Pa J.I. Emerhana Foundation\'s mission to develop visionary leaders in the Niger Delta.',
        keywords: ['Donate to foundation Nigeria', 'Support leadership development', 'Charitable giving Niger Delta'],
        ogImage: '/assets/emerhana.jpg',
      },
      contact: {
        title: 'Contact — Pa J.I. Emerhana Foundation',
        description: 'Get in touch with the Pa J.I. Emerhana Foundation.',
        keywords: ['Contact foundation Nigeria', 'Leadership development contact', 'Niger Delta foundation contact'],
        ogImage: '/assets/emerhana.jpg',
      },
    };

    const config = metaConfig[page] || metaConfig.home;
    this.updateSEO(config);
  }

  // Generate robots.txt content
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://emerhana-foundation.org/sitemap.xml

# Crawl delay for respectful crawling
Crawl-delay: 1
`;
  }

  // Generate sitemap.xml content
  generateSitemap(): string {
    const urls = [
      { loc: 'https://emerhana-foundation.org/', changefreq: 'daily', priority: '1.0' },
      { loc: 'https://emerhana-foundation.org/about', changefreq: 'weekly', priority: '0.8' },
      { loc: 'https://emerhana-foundation.org/programs', changefreq: 'weekly', priority: '0.8' },
      { loc: 'https://emerhana-foundation.org/donate', changefreq: 'monthly', priority: '0.7' },
      { loc: 'https://emerhana-foundation.org/contact', changefreq: 'monthly', priority: '0.6' },
      { loc: 'https://emerhana-foundation.org/news', changefreq: 'weekly', priority: '0.7' },
      { loc: 'https://emerhana-foundation.org/gallery', changefreq: 'monthly', priority: '0.6' },
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return sitemap;
  }
}

export const seoService = new SEOService();

// React hook for SEO
export function useSEO() {
  const updatePageSEO = (page: string) => {
    seoService.generatePageMeta(page);
  };

  return {
    updatePageSEO,
  };
}