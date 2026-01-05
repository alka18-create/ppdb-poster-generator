import React, { useState, useEffect } from 'react';
import { Key, X, ExternalLink, Check, ShieldCheck, AlertTriangle } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, currentKey }) => {
  const [inputValue, setInputValue] = useState(currentKey);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    setInputValue(currentKey);
  }, [currentKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(inputValue);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl scale-100 transition-all animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2 text-slate-800">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Key size={20} />
            </div>
            <h3 className="font-bold text-lg">Pengaturan API Key</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3 text-sm text-indigo-900">
            <ShieldCheck size={20} className="shrink-0 text-indigo-600" />
            <p>
              API Key Anda disimpan secara lokal di browser (Local Storage) dan tidak akan dikirim ke server kami. Ini digunakan langsung untuk menghubungi Google Gemini API.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Google Gemini API Key</label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 font-mono text-sm"
                placeholder="Masukkan API Key (AIza...)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-indigo-600 px-2 py-1 rounded"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Belum punya API Key?{' '}
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-indigo-600 hover:underline inline-flex items-center gap-0.5"
              >
                Buat di Google AI Studio <ExternalLink size={10} />
              </a>
            </p>
          </div>

          <div className="pt-2 flex gap-3">
             <button
              onClick={() => { setInputValue(''); onSave(''); onClose(); }}
              className="px-4 py-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors text-sm"
            >
              Hapus Key
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              <Check size={18} /> Simpan Pengaturan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};