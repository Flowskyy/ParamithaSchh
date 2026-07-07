import React from 'react';

/**
 * FormattedDescription Component
 * 
 * Parses plain text with bullet points and renders as formatted JSX.
 * Database stores plain text only - styling is applied here.
 * 
 * @param {Object} props
 * @param {string} props.text - Plain text with bullet points (•, -, *) and newlines
 * @param {string} props.className - Additional CSS classes for the container
 * @param {string} props.textClassName - CSS classes for paragraph text
 */
const FormattedDescription = ({ text, className = '', textClassName = 'text-slate-700' }) => {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const lines = text.split('\n');
  const elements = [];
  let currentList = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      if (inList) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc pl-5 space-y-2 my-4">
            {currentList}
          </ul>
        );
        currentList = [];
        inList = false;
      }
      continue;
    }

    // Check if line starts with bullet point
    if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
      const content = trimmed.replace(/^[•\-\*]\s*/, '');
      
      if (!inList) {
        inList = true;
      }
      
      currentList.push(
        <li key={`li-${currentList.length}`} className="text-slate-700">
          {content}
        </li>
      );
    } else {
      // Close list if we were in one
      if (inList) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc pl-5 space-y-2 my-4">
            {currentList}
          </ul>
        );
        currentList = [];
        inList = false;
      }

      // Regular paragraph
      elements.push(
        <p key={`p-${elements.length}`} className={`mb-3 ${textClassName}`}>
          {trimmed}
        </p>
      );
    }
  }

  // Close list if still open
  if (inList) {
    elements.push(
      <ul key={`ul-${elements.length}`} className="list-disc pl-5 space-y-2 my-4">
        {currentList}
      </ul>
    );
  }

  return <div className={className}>{elements}</div>;
};

export default FormattedDescription;
