import React from 'react';

export const EmptyStateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m-1.5 9v-2.625c0-.621.504-1.125 1.125-1.125H8.25a3.375 3.375 0 013.375 3.375v1.5a2.25 2.25 0 01-2.25 2.25H6.375c-.621 0-1.125-.504-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H1.5m19.5 0v-2.625c0-.621-.504-1.125-1.125-1.125h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25" />
    </svg>
);