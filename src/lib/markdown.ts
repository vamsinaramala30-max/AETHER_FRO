/**
 * Lightweight helper module to sanitize and format markdown content prior to UI parsing.
 */
export const markdownUtils = {
  sanitizeRawMarkdown(content: string): string {
    if (!content) return '';
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip inline scripts
      .replace(/on\w+="[^"]*"/g, ''); // Strip inline event handlers
  },

  extractCodeBlocks(markdown: string): Array<{ language: string; code: string }> {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    const blocks: Array<{ language: string; code: string }> = [];
    let match: RegExpExecArray | null;

    while ((match = codeBlockRegex.exec(markdown)) !== null) {
      blocks.push({
        language: match[1] || 'plaintext',
        code: match[2].trim(),
      });
    }

    return blocks;
  },

  stripFormatting(markdown: string): string {
    return markdown
      .replace(/#{1,6}\s+/g, '') // Remove Headings
      .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove Bold
      .replace(/(\*|_)(.*?)\1/g, '$2') // Remove Italics
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1') // Remove Links
      .replace(/`{1,3}(.*?)(`{1,3})/g, '$1') // Remove Inline Code
      .trim();
  },
};