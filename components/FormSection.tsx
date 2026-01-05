import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({ 
  title, 
  icon: Icon, 
  children, 
  className = '',
  gradient = 'from-indigo-500 to-violet-500'
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/60 ${className}`}>
      <div className="bg-white px-6 py-5 border-b border-slate-100 flex items-center gap-4 relative overflow-hidden">
        {/* Decorative background blur for header */}
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${gradient}`}></div>
        
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md`}>
          <Icon size={20} />
        </div>
        <h3 className="font-bold text-slate-800 text-lg tracking-tight">{title}</h3>
      </div>
      <div className="p-6 space-y-6">
        {children}
      </div>
    </div>
  );
};

export const InputGroup: React.FC<{ label: string; required?: boolean; children: React.ReactNode; helpText?: string }> = ({ label, required, children, helpText }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-slate-700 ml-1">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
    {helpText && <p className="text-xs text-slate-500 ml-1">{helpText}</p>}
  </div>
);