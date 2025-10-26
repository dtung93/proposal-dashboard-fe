import React from 'react';

export const BudgetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0h.75A.75.75 0 015.25 6v.75m0 0v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75V6.75m0 0H3.75m0 0h-.75a.75.75 0 00-.75.75v.75c0 .414.336.75.75.75h.75m0 0h.75a.75.75 0 00.75-.75v-.75a.75.75 0 00-.75-.75h-.75M15 4.5v.75A.75.75 0 0114.25 6h-.75m0 0v-.75a.75.75 0 01.75-.75h.75m0 0h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75V6.75m0 0h-.75m0 0h.75a.75.75 0 00.75-.75v-.75a.75.75 0 00-.75-.75h-.75M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);