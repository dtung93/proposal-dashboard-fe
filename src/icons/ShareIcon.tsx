// FIX: Created file content for components/icons/ShareIcon.tsx to provide the share icon SVG component.
import React from 'react';

export const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.195.025.39.042.586.042h4.414c.196 0 .39-.017.586-.042m-5.586 2.186a2.25 2.25 0 110-2.186m0 2.186c.195-.025.39-.042.586-.042h4.414c.196 0 .39.017.586.042m0 0a2.25 2.25 0 100-2.186m0 2.186a2.25 2.25 0 110-2.186"
    />
  </svg>
);
