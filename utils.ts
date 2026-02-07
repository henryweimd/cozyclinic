import React from 'react';

// Parses text like "Check for [Tachycardia|Rapid heart rate] now."
// Returns an array of strings and React nodes.
export const parseMedicalText = (text: string): (string | React.ReactNode)[] => {
  const parts = text.split(/(\[[^\]]+\])/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      const content = part.slice(1, -1);
      const [term, definition] = content.split('|');
      
      return React.createElement(
        'span',
        {
          key: index,
          className: "group relative inline-block cursor-help font-semibold text-teal-600 border-b-2 border-teal-200 border-dotted"
        },
        term,
        React.createElement(
          'span',
          {
            className: "pointer-events-none absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 z-50"
          },
          React.createElement(
            'span',
            {
              className: "block rounded-lg bg-gray-800 p-2 text-xs text-white shadow-xl text-center"
            },
            definition,
            React.createElement(
              'svg',
              {
                className: "absolute left-1/2 top-full -ml-1 h-2 w-2 text-gray-800",
                x: "0px",
                y: "0px",
                viewBox: "0 0 255 255"
              },
              React.createElement('polygon', {
                className: "fill-current",
                points: "0,0 127.5,127.5 255,0"
              })
            )
          )
        )
      );
    }
    return part;
  });
};