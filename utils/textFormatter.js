/**
 * Utility function to convert plain text with bullet points to HTML
 * 
 * ROOT CAUSE EXPLANATION:
 * =====================
 * React automatically escapes HTML characters in JSX to prevent XSS attacks.
 * When you render plain text like "Hello <script>alert('xss')</script>",
 * React will display it as literal text, not execute the script.
 * 
 * However, when you save plain text with newlines to a textarea and then
 * display it in a <div> without proper formatting, React treats newlines
 * as whitespace (collapses them). This is why your bullet points and
 * formatted text appear as one long paragraph.
 * 
 * SOLUTION:
 * Convert the plain text to HTML before saving to database, then render
 * it using dangerouslySetInnerHTML (with proper XSS protection).
 */

/**
 * Escapes HTML special characters to prevent XSS injection
 * @param {string} text - Raw text to escape
 * @returns {string} - Escaped text safe for HTML rendering
 */
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
};

/**
 * Converts plain text with bullet points to formatted HTML
 * @param {string} rawText - Plain text from textarea
 * @returns {string} - HTML string with <ul>, <li>, and <p> tags
 */
export const formatDescriptionToHtml = (rawText) => {
  if (!rawText || typeof rawText !== 'string') return '';
  
  const lines = rawText.split('\n');
  let html = '';
  let inList = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines
    if (!trimmed) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      continue;
    }
    
    // Check if line starts with bullet point
    if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
      // Close previous paragraph if any
      if (!inList) {
        html += '<ul class="list-disc pl-5 space-y-2 my-4">';
        inList = true;
      }
      
      // Remove bullet symbol and escape the content
      const content = escapeHtml(trimmed.replace(/^[•\-\*]\s*/, ''));
      html += `<li>${content}</li>`;
    } else {
      // Close list if we were in one
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      
      // Regular paragraph - escape the content
      const content = escapeHtml(trimmed);
      html += `<p class="mb-3">${content}</p>`;
    }
  }
  
  // Close list if still open
  if (inList) {
    html += '</ul>';
  }
  
  return html;
};

/**
 * Alternative: Convert plain text to HTML without XSS escaping
 * Use this ONLY if you trust the content source (admin panel input)
 * @param {string} rawText - Plain text from textarea
 * @returns {string} - HTML string with <ul>, <li>, and <p> tags
 */
export const formatDescriptionToHtmlUnsafe = (rawText) => {
  if (!rawText || typeof rawText !== 'string') return '';
  
  const lines = rawText.split('\n');
  let html = '';
  let inList = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines
    if (!trimmed) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      continue;
    }
    
    // Check if line starts with bullet point
    if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
      if (!inList) {
        html += '<ul class="list-disc pl-5 space-y-2 my-4">';
        inList = true;
      }
      
      const content = trimmed.replace(/^[•\-\*]\s*/, '');
      html += `<li>${content}</li>`;
    } else {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      
      html += `<p class="mb-3">${trimmed}</p>`;
    }
  }
  
  if (inList) {
    html += '</ul>';
  }
  
  return html;
};
