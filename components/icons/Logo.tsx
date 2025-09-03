import React from 'react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="40" height="40" rx="8" fill="var(--color-primary)"/>
    <path d="M12 20.5L17.5 26L28.5 15" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
