import fs from 'fs';
import path from 'path';

export default function recentPostsPlugin(context: any) {
  return {
    name: 'recent-posts-plugin',
    async loadContent() {
      const locale = context.i18n.currentLocale;
      const defaultLocale = context.i18n.defaultLocale;
      const isDefaultLocale = locale === defaultLocale;

      // Map source dirs to their i18n plugin directory names
      const blogI18nMapping: Record<string, string> = {
        'blog': 'docusaurus-plugin-content-blog',
        'blog-whale-gems': 'docusaurus-plugin-content-blog-blog-whale-gems',
      };

      const docsI18nMapping: Record<string, string> = {
        'docs': 'docusaurus-plugin-content-docs/current',
        'docs-tech': 'docusaurus-plugin-content-docs-docs-tech/current',
        'docs-english': 'docusaurus-plugin-content-docs-docs-english/current',
        'docs-book': 'docusaurus-plugin-content-docs-docs-book/current',
        'docs-class': 'docusaurus-plugin-content-docs-docs-class/current',
      };

      const parseFile = (filePath: string, stat: fs.Stats) => {
        const content = fs.readFileSync(filePath, 'utf-8');
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        let title = '';
        let slug = '';
        let dateStr = '';

        if (frontmatterMatch) {
          const fm = frontmatterMatch[1];
          const titleMatch = fm.match(/title:\s*["']?(.*?)["']?(\n|$)/);
          if (titleMatch) title = titleMatch[1].trim();

          const slugMatch = fm.match(/slug:\s*["']?(.*?)["']?(\n|$)/);
          if (slugMatch) slug = slugMatch[1].trim();

          const dateMatch = fm.match(/date:\s*["']?(.*?)["']?(\n|$)/);
          if (dateMatch) dateStr = dateMatch[1].trim();
        }

        if (!title) {
          const h1Match = content.match(/^#\s+(.*)/m);
          if (h1Match) title = h1Match[1].trim();
          else title = path.basename(filePath, path.extname(filePath));
        }

        return { title, slug, dateStr, mtime: stat.mtime };
      };

      const getPosts = (dir: string, type: 'blog' | 'docs', basePath: string, i18nDirName?: string) => {
        const fullDir = path.join(context.siteDir, dir);
        if (!fs.existsSync(fullDir)) return [];

        // Determine the i18n override directory
        let i18nDir: string | null = null;
        if (!isDefaultLocale && i18nDirName) {
          const candidate = path.join(context.siteDir, 'i18n', locale, i18nDirName);
          if (fs.existsSync(candidate)) {
            i18nDir = candidate;
          }
        }

        // Collect all source files (keyed by relative path)
        const sourceFiles = new Map<string, string>();
        const walkSource = (currentPath: string) => {
          const files = fs.readdirSync(currentPath);
          for (const file of files) {
            const filePath = path.join(currentPath, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
              walkSource(filePath);
            } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
              const relPath = path.relative(fullDir, filePath);
              sourceFiles.set(relPath, filePath);
            }
          }
        };
        walkSource(fullDir);

        // Collect i18n override files (keyed by relative path)
        const i18nFiles = new Map<string, string>();
        if (i18nDir) {
          const walkI18n = (currentPath: string) => {
            const files = fs.readdirSync(currentPath);
            for (const file of files) {
              const filePath = path.join(currentPath, file);
              const stat = fs.statSync(filePath);
              if (stat.isDirectory()) {
                walkI18n(filePath);
              } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
                const relPath = path.relative(i18nDir!, filePath);
                i18nFiles.set(relPath, filePath);
              }
            }
          };
          walkI18n(i18nDir);
        }

        let results: any[] = [];

        for (const [relPath, sourceFilePath] of sourceFiles) {
          const file = path.basename(relPath);

          // Skip drafts
          if (file.startsWith('draft')) continue;

          // Use i18n version if available, otherwise use source
          const resolvedFilePath = i18nFiles.get(relPath) || sourceFilePath;
          const stat = fs.statSync(sourceFilePath); // always use source stat for dates
          const { title, slug, dateStr } = parseFile(resolvedFilePath, stat);

          let date = stat.mtime;
          let finalPath = '';

          if (type === 'blog') {
            const datePrefixMatch = file.match(/^(\d{4}-\d{2}-\d{2})/);
            if (datePrefixMatch) {
               date = new Date(datePrefixMatch[1]);
            } else if (dateStr) {
               date = new Date(dateStr);
            }
            const filenameWithoutDate = file.replace(/^\d{4}-\d{2}-\d{2}-?/, '').replace(/\.mdx?$/, '').trim();
            finalPath = `/${basePath}/${slug || filenameWithoutDate}`;
          } else {
            if (dateStr) {
               date = new Date(dateStr);
            }
            const relativePath = relPath.replace(/\.mdx?$/, '');
            let cleanPath = relativePath.replace(/(^|\/)index$/, '').replace(/(^|\/)README$/, '');

            if (slug) {
              if (slug.startsWith('/')) {
                cleanPath = slug.slice(1);
              } else {
                const parentDir = path.dirname(relativePath);
                cleanPath = parentDir === '.' ? slug : `${parentDir}/${slug}`;
              }
            }

            if (cleanPath === '') {
              finalPath = `/${basePath}`;
            } else {
              finalPath = `/${basePath}/${cleanPath}`;
            }
          }

          // Prepend locale prefix for non-default locales
          if (!isDefaultLocale) {
            finalPath = `/${locale}${finalPath}`;
          }

          finalPath = finalPath.replace(/\/+/g, '/');

          results.push({
            title,
            link: finalPath,
            date: date.toISOString(),
            type
          });

          // Remove from i18n map so we don't process it again
          i18nFiles.delete(relPath);
        }

        return results;
      };

      const blogPosts = [
        ...getPosts('blog', 'blog', 'blog', blogI18nMapping['blog']),
        ...getPosts('blog-whale-gems', 'blog', 'whale-gems', blogI18nMapping['blog-whale-gems']),
      ];

      const docsPosts = [
        ...getPosts('docs', 'docs', 'docs', docsI18nMapping['docs']),
        ...getPosts('docs-tech', 'docs', 'technique', docsI18nMapping['docs-tech']),
        ...getPosts('docs-english', 'docs', 'english', docsI18nMapping['docs-english']),
        ...getPosts('docs-book', 'docs', 'read', docsI18nMapping['docs-book']),
        ...getPosts('docs-class', 'docs', 'class', docsI18nMapping['docs-class']),
      ];

      blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      docsPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return {
        recentBlogs: blogPosts.slice(0, 5),
        recentDocs: docsPosts.slice(0, 5)
      };
    },
    async contentLoaded({content, actions}: any) {
      actions.setGlobalData(content);
    }
  };
}
