import React, { useState } from 'react';
import { Copy, Check, FileText } from 'lucide-react';

interface TextPreviewProps {
  content: string;
  title?: string;
}

export const TextPreview: React.FC<TextPreviewProps> = ({ content, title = "Generated Text Prompt" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden text-slate-300 shadow-lg flex flex-col h-full max-h-[600px]">
      <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <FileText size={16} className="text-blue-400" />
            <span className="text-sm font-medium text-slate-200">{title}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-700 hover:bg-slate-600 text-white transition-colors"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          {copied ? 'Tersalin!' : 'Salin Teks'}
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <pre className="text-xs sm:text-sm font-mono leading-relaxed whitespace-pre-wrap font-sans text-slate-300">
          {content}
        </pre>
      </div>
    </div>
  );
};