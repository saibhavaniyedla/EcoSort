import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-12 px-8 bg-surface-container-low">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto w-full">
        <div className="text-sm font-medium text-on-surface-variant">
          © 2026 EcoSort. All rights reserved.
        </div>
        <div className="flex gap-8">
          <a href="#" className="text-sm font-medium text-primary hover:underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity">Privacy Policy</a>
          <a href="#" className="text-sm font-medium text-primary hover:underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity">Terms of Service</a>
          <a href="#" className="text-sm font-medium text-primary hover:underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity">Contact</a>
        </div>
      </div>
    </footer>
  );
}
