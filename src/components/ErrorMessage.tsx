import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  message: string;
}

export default function ErrorMessage({ message }: Props) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm mt-1">
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
}