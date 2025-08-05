/**
 * HTML utility functions for content processing
 */

/**
 * Removes all script tags and their content from an HTML string
 * @param htmlContent - The HTML content as a string
 * @returns The HTML content with all script tags removed
 */
export const removeScriptTags = (htmlContent: string): string => {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return '';
  }

  // Remove script tags and their content using regex
  // This regex matches:
  // 1. <script...> ... </script> (with any attributes and content)
  // 2. <script.../> (self-closing script tags)
  const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  const selfClosingScriptRegex = /<script\b[^>]*\/>/gi;

  const cleanedContent = htmlContent
    .replace(scriptRegex, '') // Remove regular script tags
    .replace(selfClosingScriptRegex, ''); // Remove self-closing script tags

  return cleanedContent.trim();
};

/**
 * Removes multiple types of potentially harmful or unwanted tags from HTML content
 * @param htmlContent - The HTML content as a string
 * @param tagsToRemove - Array of tag names to remove (default: ['script'])
 * @returns The HTML content with specified tags removed
 */
export const removeHtmlTags = (
  htmlContent: string,
  tagsToRemove: string[] = ['script'],
): string => {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return '';
  }

  let cleanedContent = htmlContent;

  tagsToRemove.forEach(tag => {
    // Create regex for each tag type
    const tagRegex = new RegExp(
      `<${tag}\\b[^<]*(?:(?!<\\/${tag}>)<[^<]*)*<\\/${tag}>`,
      'gi',
    );
    const selfClosingTagRegex = new RegExp(`<${tag}\\b[^>]*\\/>`, 'gi');

    cleanedContent = cleanedContent
      .replace(tagRegex, '') // Remove regular tags
      .replace(selfClosingTagRegex, ''); // Remove self-closing tags
  });

  return cleanedContent.trim();
};

/**
 * Sanitizes HTML content by removing scripts and other potentially harmful elements
 * @param htmlContent - The HTML content as a string
 * @returns Sanitized HTML content
 */
export const sanitizeHtmlContent = (htmlContent: string): string => {
  return removeHtmlTags(htmlContent, [
    'script',
    'style',
    'iframe',
    'object',
    'embed',
    'link',
  ]);
};
