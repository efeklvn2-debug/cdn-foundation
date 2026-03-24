interface CMSConfig {
  apiUrl: string;
  apiKey?: string;
  contentTypes: string[];
}

interface CMSContent {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  publishedAt: string;
  updatedAt: string;
  author?: string;
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  metadata?: Record<string, any>;
}

interface CMSResponse<T = any> {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

class CMSClient {
  private config: CMSConfig;

  constructor(config: CMSConfig) {
    this.config = config;
  }

  async getContent(contentType: string, params?: Record<string, any>): Promise<CMSResponse<CMSContent>> {
    try {
      const response = await fetch(`${this.config.apiUrl}/${contentType}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        params: params ? new URLSearchParams(params) : undefined,
      });

      if (!response.ok) {
        throw new Error(`CMS request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('CMS Error:', error);
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getContentBySlug(contentType: string, slug: string): Promise<CMSContent | null> {
    try {
      const response = await fetch(`${this.config.apiUrl}/${contentType}/slug/${slug}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('CMS Error:', error);
      return null;
    }
  }

  async createContent(contentType: string, data: Partial<CMSContent>): Promise<CMSContent | null> {
    try {
      const response = await fetch(`${this.config.apiUrl}/${contentType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`CMS request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('CMS Error:', error);
      return null;
    }
  }

  async updateContent(contentType: string, id: string, data: Partial<CMSContent>): Promise<CMSContent | null> {
    try {
      const response = await fetch(`${this.config.apiUrl}/${contentType}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`CMS request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('CMS Error:', error);
      return null;
    }
  }

  async deleteContent(contentType: string, id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.apiUrl}/${contentType}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('CMS Error:', error);
      return false;
    }
  }

  // Content caching
  private cache = new Map<string, { data: CMSContent; timestamp: number }>();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  getCachedContent(contentType: string, slug: string): CMSContent | null {
    const cacheKey = `${contentType}:${slug}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    return null;
  }

  setCachedContent(contentType: string, slug: string, content: CMSContent): void {
    const cacheKey = `${contentType}:${slug}`;
    this.cache.set(cacheKey, {
      data: content,
      timestamp: Date.now(),
    });
  }

  // Content transformation utilities
  transformContent(content: CMSContent): any {
    return {
      ...content,
      formattedDate: new Date(content.publishedAt).toLocaleDateString(),
      readingTime: this.estimateReadingTime(content.content),
      featuredImageUrl: content.featuredImage ? `${this.config.apiUrl}/uploads/${content.featuredImage}` : null,
    };
  }

  private estimateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  // Content validation
  validateContent(content: Partial<CMSContent>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!content.title || content.title.trim() === '') {
      errors.push('Title is required');
    }

    if (!content.slug || content.slug.trim() === '') {
      errors.push('Slug is required');
    }

    if (!content.content || content.content.trim() === '') {
      errors.push('Content is required');
    }

    if (!content.publishedAt) {
      errors.push('Published date is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Initialize CMS client
export const cmsClient = new CMSClient({
  apiUrl: import.meta.env.VITE_CMS_API_URL || '/api/cms',
  apiKey: import.meta.env.VITE_CMS_API_KEY,
  contentTypes: ['pages', 'posts', 'programs', 'gallery', 'news'],
});

// React hook for CMS content
export function useCMS() {
  const getContent = async (contentType: string, params?: Record<string, any>) => {
    return await cmsClient.getContent(contentType, params);
  };

  const getContentBySlug = async (contentType: string, slug: string) => {
    // Check cache first
    const cached = cmsClient.getCachedContent(contentType, slug);
    if (cached) {
      return cached;
    }

    const content = await cmsClient.getContentBySlug(contentType, slug);
    if (content) {
      cmsClient.setCachedContent(contentType, slug, content);
    }
    return content;
  };

  const createContent = async (contentType: string, data: Partial<CMSContent>) => {
    return await cmsClient.createContent(contentType, data);
  };

  const updateContent = async (contentType: string, id: string, data: Partial<CMSContent>) => {
    return await cmsClient.updateContent(contentType, id, data);
  };

  const deleteContent = async (contentType: string, id: string) => {
    return await cmsClient.deleteContent(contentType, id);
  };

  return {
    getContent,
    getContentBySlug,
    createContent,
    updateContent,
    deleteContent,
  };
}

// Content management utilities
export const contentUtils = {
  // Generate slug from title
  generateSlug: (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  },

  // Extract excerpt from content
  excerpt: (content: string, length: number = 150): string => {
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > length 
      ? plainText.substring(0, length) + '...' 
      : plainText;
  },

  // Format date
  formatDate: (date: string | Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  // Validate content
  validateContent: (content: Partial<CMSContent>) => {
    return cmsClient.validateContent(content);
  },
};