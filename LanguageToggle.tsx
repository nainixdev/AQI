import React from 'react';
import { Button } from '@/components/ui/button';
import type { Language } from '@/lib/translations';

interface LanguageToggleProps {
  language: Language;
  onToggle: () => void;
}

export function LanguageToggle({ language, onToggle }: LanguageToggleProps) {
  return (
    <Button
      onClick={onToggle}
      variant="outline"
      size="sm"
      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium transition-colors duration-200 border-none"
    >
      <span className={language === 'en' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}>
        EN
      </span>
      <span className="mx-1">/</span>
      <span className={language === 'hi' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}>
        HI
      </span>
    </Button>
  );
}
