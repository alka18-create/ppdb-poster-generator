import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  GraduationCap, 
  Palette, 
  Sparkles, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Terminal,
  Phone,
  FileText,
  Wand2,
  Key
} from 'lucide-react';
import { 
  PpdbFormData, 
  INITIAL_FORM_DATA, 
  TRACK_OPTIONS, 
  SOCIAL_PLATFORMS, 
  AccreditationType,
  EducationLevel,
  VisualStyle,
  AspectRatio,
  SocialMedia
} from './types';
import { FormSection, InputGroup } from './components/FormSection';
import { JsonPreview } from './components/JsonPreview';
import { TextPreview } from './components/TextPreview';
import { ApiKeyModal } from './components/ApiKeyModal';
import { constructPrompt, generateImage } from './services/geminiService';

export default function App() {
  const [formData, setFormData] = useState<PpdbFormData>(INITIAL_FORM_DATA);
  const [generatedJson, setGeneratedJson] = useState<object | null>(null);
  const [promptText, setPromptText] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'json' | 'text'>('json');
  
  // API Key State
  const [apiKey, setApiKey] = useState<string>('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Load API Key from local storage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) setApiKey(storedKey);
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('gemini_api_key', key);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  };

  // Helper to check if we have a usable key (Env or User provided)
  // process.env.API_KEY might be replaced by bundler, so we check existence.
  const hasValidKey = !!apiKey || (typeof process !== 'undefined' && !!process.env.API_KEY);

  const handleInputChange = (field: keyof PpdbFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTrackToggle = (track: string) => {
    setFormData(prev => {
      const current = prev.tracks;
      if (current.includes(track)) {
        return { ...prev, tracks: current.filter(t => t !== track) };
      } else {
        return { ...prev, tracks: [...current, track] };
      }
    });
  };

  const handleContactChange = (index: number, value: string) => {
    const newContacts = [...formData.contactPersons];
    newContacts[index] = value;
    setFormData(prev => ({ ...prev, contactPersons: newContacts }));
  };

  const addContact = () => {
    setFormData(prev => ({
      ...prev,
      contactPersons: [...prev.contactPersons, '']
    }));
  };

  const removeContact = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contactPersons: prev.contactPersons.filter((_, i) => i !== index)
    }));
  };

  const handleSocialMediaChange = (index: number, field: keyof SocialMedia, value: string) => {
    const newSocials = [...formData.socialMedia];
    newSocials[index] = { ...newSocials[index], [field]: value };
    setFormData(prev => ({ ...prev, socialMedia: newSocials }));
  };

  const addSocialMedia = () => {
    setFormData(prev => ({
      ...prev,
      socialMedia: [...prev.socialMedia, { platform: 'Instagram', handle: '' }]
    }));
  };

  const removeSocialMedia = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.filter((_, i) => i !== index)
    }));
  };

  const generatePromptJson = () => {
    const text = constructPrompt(formData);
    setPromptText(text); 
    
    const jsonOutput = {
      model: "nanno-banana (gemini-2.5-flash-image)",
      prompt: text,
      parameters: {
        aspect_ratio: formData.aspectRatio,
        negative_prompt: "blurry, low quality, distorted text, ugly, watermark, grainy",
        safety_settings: "BLOCK_MEDIUM_AND_ABOVE"
      },
      meta: {
        school: formData.schoolName,
        year: formData.academicYear,
        style: formData.visualStyle
      }
    };
    setGeneratedJson(jsonOutput);
    setActiveTab('json');
    setGeneratedImage(null);
    setError(null);
  };

  const generatePromptText = () => {
    const text = constructPrompt(formData);
    setPromptText(text);
    setActiveTab('text');
    setGeneratedImage(null);
    setError(null);
  };

  const handleGenerateImage = async () => {
    if (!hasValidKey) {
       setIsApiKeyModalOpen(true);
       return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const prompt = constructPrompt(formData);
      const imageBase64 = await generateImage(prompt, formData.aspectRatio, apiKey);
      if (imageBase64) {
        setGeneratedImage(imageBase64);
      } else {
        setError("Gagal membuat gambar. Silakan coba lagi.");
      }
    } catch (err: any) {
      const msg = err?.message || "Terjadi kesalahan saat menghubungi API Gemini.";
      setError(msg);
      if (msg.includes("API Key") || msg.includes("403") || msg.includes("401")) {
        setIsApiKeyModalOpen(true);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Reusable input style
  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-200 text-slate-800 placeholder:text-slate-400";
  const selectClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-200 text-slate-800 appearance-none cursor-pointer";

  return (
    <div className="pb-20">
      <ApiKeyModal 
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={handleSaveApiKey}
        currentKey={apiKey}
      />

      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-300/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-300/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10">
        
        {/* Header */}
        <header className="relative pt-8 md:pt-12 mb-12">
          {/* API Key Button (Top Right) */}
          <div className="absolute top-0 right-0 z-10">
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm border ${
                hasValidKey
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                  : 'bg-white text-slate-600 border-slate-200 hover:text-indigo-600 hover:border-indigo-200'
              }`}
            >
              <Key size={16} className={hasValidKey ? "fill-emerald-700" : ""} />
              {hasValidKey ? 'API Key Terpasang' : 'Set API Key'}
            </button>
          </div>

          <div className="text-center space-y-4 mt-8 md:mt-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={12} />
              Powered by Gemini 2.5
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
              Nanno Banana <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600">
                PPDB Generator
              </span>
            </h1>
            <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Buat prompt poster Penerimaan Peserta Didik Baru yang profesional dan estetik dalam hitungan detik.
            </p>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form (Span 7) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. Data Lembaga */}
            <FormSection title="Data Lembaga" icon={Building2} gradient="from-blue-500 to-cyan-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputGroup label="Nama Sekolah / Madrasah" required>
                  <input 
                    type="text" 
                    className={inputClass}
                    placeholder="Contoh: MAN 1 Kota Cerdas"
                    value={formData.schoolName}
                    onChange={(e) => handleInputChange('schoolName', e.target.value)}
                  />
                </InputGroup>
                
                <InputGroup label="Tahun Ajaran" required>
                  <input 
                    type="text" 
                    className={inputClass}
                    placeholder="2025/2026"
                    value={formData.academicYear}
                    onChange={(e) => handleInputChange('academicYear', e.target.value)}
                  />
                </InputGroup>
              </div>

              <InputGroup label="Akreditasi">
                <div className="relative">
                  <select 
                    className={selectClass}
                    value={formData.accreditation}
                    onChange={(e) => handleInputChange('accreditation', e.target.value as AccreditationType)}
                  >
                    <option value="Unggul (A)">Unggul (A)</option>
                    <option value="Baik Sekali (B)">Baik Sekali (B)</option>
                    <option value="Baik (C)">Baik (C)</option>
                    <option value="Belum Terakreditasi">Belum Terakreditasi</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </InputGroup>

              <InputGroup label="Tagline / Slogan">
                <input 
                  type="text" 
                  className={inputClass}
                  placeholder="Mencetak Generasi Rabbani"
                  value={formData.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                />
              </InputGroup>
            </FormSection>

            {/* 2. Informasi PPDB */}
            <FormSection title="Informasi PPDB" icon={GraduationCap} gradient="from-indigo-500 to-violet-500">
              <InputGroup label="Jenjang Pendidikan">
                <div className="relative">
                  <select 
                    className={selectClass}
                    value={formData.level}
                    onChange={(e) => handleInputChange('level', e.target.value as EducationLevel)}
                  >
                    {['MA', 'MTs', 'MI', 'RA', 'SMK', 'SMA', 'SMP', 'SD'].map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </InputGroup>

              <InputGroup label="Jalur Pendaftaran">
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {TRACK_OPTIONS.map((track) => (
                    <label 
                      key={track} 
                      className={`flex items-center space-x-3 cursor-pointer p-3 rounded-xl border transition-all duration-200 ${
                        formData.tracks.includes(track)
                          ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        formData.tracks.includes(track) ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'
                      }`}>
                        {formData.tracks.includes(track) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                      </div>
                      <input 
                        type="checkbox" 
                        checked={formData.tracks.includes(track)}
                        onChange={() => handleTrackToggle(track)}
                        className="hidden"
                      />
                      <span className={`text-sm font-medium ${formData.tracks.includes(track) ? 'text-indigo-900' : 'text-slate-700'}`}>
                        {track}
                      </span>
                    </label>
                  ))}
                </div>
                {formData.tracks.includes('Isi Sendiri') && (
                  <input 
                    type="text" 
                    className={`${inputClass} mt-3 animate-in fade-in slide-in-from-top-1`}
                    placeholder="Tuliskan jalur pendaftaran lainnya..."
                    value={formData.customTrack}
                    onChange={(e) => handleInputChange('customTrack', e.target.value)}
                  />
                )}
              </InputGroup>

              <InputGroup label="Syarat Pendaftaran">
                <textarea 
                  className={`${inputClass} min-h-[100px] resize-y`}
                  placeholder="- Fotocopy Ijazah&#10;- Pas Foto 3x4&#10;- KK & Akta Kelahiran"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                />
              </InputGroup>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputGroup label="Hari" required>
                  <input 
                    type="text" 
                    className={inputClass}
                    placeholder="Contoh: Senin - Jumat"
                    value={formData.days}
                    onChange={(e) => handleInputChange('days', e.target.value)}
                  />
                </InputGroup>
                <InputGroup label="Tanggal" required>
                   <input 
                    type="text" 
                    className={inputClass}
                    placeholder="Contoh: 1 Mei - 30 Juni"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </InputGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
                 <InputGroup label="Waktu" required>
                  <input 
                    type="text" 
                    className={inputClass}
                    placeholder="08.00 - 14.00 WIB"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                  />
                </InputGroup>
              </div>

              <InputGroup label="Tempat / Lokasi" required>
                <input 
                  type="text" 
                  className={inputClass}
                  placeholder="Kampus MAN 1 Kota Cerdas, Jl. Pendidikan No. 1"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </InputGroup>

              <InputGroup label="Contact Person">
                <div className="space-y-3">
                  {formData.contactPersons.map((contact, index) => (
                    <div key={index} className="flex gap-2 animate-in fade-in slide-in-from-left-2">
                       <div className="flex-1 relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                             <Phone size={18} />
                          </div>
                          <input 
                            type="text" 
                            className={`${inputClass} pl-10`}
                            placeholder="0812-3456-7890 (Bpk. Ahmad)"
                            value={contact}
                            onChange={(e) => handleContactChange(index, e.target.value)}
                          />
                       </div>
                      <button 
                        onClick={() => removeContact(index)}
                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        disabled={formData.contactPersons.length === 1}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={addContact}
                    className="mt-2 text-sm text-indigo-600 font-semibold flex items-center gap-2 hover:text-indigo-700 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors w-fit"
                  >
                    <div className="bg-indigo-100 p-1 rounded-full"><Plus size={14} /></div>
                    Tambah Kontak Lain
                  </button>
                </div>
              </InputGroup>

              <InputGroup label="Social Media (Footer)">
                <div className="space-y-3">
                  {formData.socialMedia.map((social, index) => (
                    <div key={index} className="flex gap-2 animate-in fade-in slide-in-from-left-2">
                      <div className="relative w-1/3 min-w-[120px]">
                        <select
                          className={`${selectClass} pr-8`}
                          value={social.platform}
                          onChange={(e) => handleSocialMediaChange(index, 'platform', e.target.value)}
                        >
                          {SOCIAL_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                      <input 
                        type="text" 
                        className={`${inputClass} flex-1`}
                        placeholder="@username atau link"
                        value={social.handle}
                        onChange={(e) => handleSocialMediaChange(index, 'handle', e.target.value)}
                      />
                      <button 
                        onClick={() => removeSocialMedia(index)}
                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        disabled={formData.socialMedia.length === 1}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                   <button 
                    onClick={addSocialMedia}
                    className="mt-2 text-sm text-indigo-600 font-semibold flex items-center gap-2 hover:text-indigo-700 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors w-fit"
                  >
                    <div className="bg-indigo-100 p-1 rounded-full"><Plus size={14} /></div>
                    Tambah Sosmed Lain
                  </button>
                </div>
              </InputGroup>
            </FormSection>

            {/* 3. Gaya Visual */}
            <FormSection title="Gaya Visual" icon={Palette} gradient="from-purple-500 to-pink-500">
              <InputGroup label="Pilih Gaya Visual">
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {(['Modern minimalis', 'Islami elegan', 'Ceria (PAUD/MI)', 'Profesional (MA)', 'Paper cut'] as VisualStyle[]).map((style) => (
                    <div 
                      key={style}
                      onClick={() => handleInputChange('visualStyle', style)}
                      className={`cursor-pointer border-2 rounded-xl p-4 text-sm font-medium transition-all duration-200 flex items-center justify-between ${
                        formData.visualStyle === style 
                          ? 'border-purple-500 bg-purple-50 text-purple-900 shadow-md transform scale-[1.02]' 
                          : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-purple-200 hover:bg-white'
                      }`}
                    >
                      <span>{style}</span>
                      {formData.visualStyle === style && <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>}
                    </div>
                  ))}
                </div>
              </InputGroup>

              <InputGroup label="Info Visual Tambahan (Opsional)">
                <input 
                  type="text" 
                  className={inputClass}
                  placeholder="Contoh: Dominan warna hijau, ada ilustrasi buku..."
                  value={formData.additionalVisualInfo}
                  onChange={(e) => handleInputChange('additionalVisualInfo', e.target.value)}
                />
              </InputGroup>

              <InputGroup label="Rasio / Ukuran">
                 <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mt-2">
                  {(['3:4', '9:16', '4:5', '1:1', '5:4', '4:3', '16:9', '2:1'] as AspectRatio[]).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => handleInputChange('aspectRatio', ratio)}
                      className={`px-2 py-3 text-xs font-bold rounded-xl border transition-all duration-200 ${
                        formData.aspectRatio === ratio
                          ? 'bg-slate-800 text-white border-slate-800 shadow-lg transform -translate-y-1'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                 </div>
              </InputGroup>
            </FormSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <button
                  onClick={generatePromptJson}
                  className="group relative overflow-hidden py-4 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 skew-x-12 -translate-x-full"></div>
                  <div className="flex items-center justify-center gap-3 relative z-10">
                     <Wand2 size={22} className="group-hover:rotate-12 transition-transform" />
                     <span>Generate JSON</span>
                  </div>
                </button>

                <button
                  onClick={generatePromptText}
                  className="group py-4 px-6 bg-white border-2 border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 rounded-2xl font-bold text-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <FileText size={22} className="group-hover:scale-110 transition-transform" />
                  <span>Generate Teks</span>
                </button>
            </div>

          </div>

          {/* Right Column: Preview & Output (Span 5) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
            
            {(activeTab === 'json' && generatedJson) || (activeTab === 'text' && promptText) ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                      <span className="w-3 h-8 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-full shadow-sm"></span>
                      Hasil Output
                    </h3>
                    <div className="text-xs font-semibold px-2 py-1 bg-slate-200 text-slate-600 rounded uppercase">
                      {activeTab} Mode
                    </div>
                  </div>
                  
                  {activeTab === 'json' && generatedJson && <JsonPreview data={generatedJson} />}
                  {activeTab === 'text' && promptText && <TextPreview content={promptText} />}
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3.5 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl shadow-lg shadow-indigo-200 text-white shrink-0">
                        <ImageIcon size={24} />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-xl text-slate-800">Preview Gambar</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                          Ingin melihat hasilnya langsung? Gunakan model <span className="font-semibold text-indigo-600">Gemini 2.5</span> untuk men-generate poster dari prompt ini.
                        </p>
                      </div>
                    </div>
                      
                    {error && (
                      <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-start gap-3">
                          <AlertCircle size={18} className="mt-0.5 shrink-0" />
                          <span className="font-medium">{error}</span>
                      </div>
                    )}

                    {generatedImage ? (
                      <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
                          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-100 relative group">
                              <img src={generatedImage} alt="Generated Poster" className="w-full h-auto" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                          </div>
                          <a 
                              href={generatedImage} 
                              download={`ppdb-${formData.schoolName.replace(/\s+/g, '-').toLowerCase()}.png`}
                              className="block w-full text-center py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
                          >
                              Download Poster HD
                          </a>
                      </div>
                    ) : (
                      <button
                        onClick={hasValidKey ? handleGenerateImage : () => setIsApiKeyModalOpen(true)}
                        disabled={isGenerating}
                        className={`w-full py-3.5 border-2 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-3 group shadow-sm ${
                          hasValidKey 
                            ? 'bg-white border-indigo-100 hover:border-indigo-600 text-indigo-700 hover:bg-indigo-50'
                            : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300'
                        }`}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            Sedang Memproses...
                          </>
                        ) : hasValidKey ? (
                          <>
                            <Sparkles size={20} className="group-hover:text-indigo-600" />
                            Generate Gambar (Beta)
                          </>
                        ) : (
                          <>
                            <Key size={20} />
                            Masukkan API Key untuk Generate
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 lg:sticky lg:top-8">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <Terminal size={40} className="opacity-40" />
                </div>
                <p className="font-bold text-lg text-slate-500">Menunggu Prompt...</p>
                <p className="text-sm text-slate-400 mt-2 text-center max-w-[200px]">
                  Lengkapi data di sebelah kiri lalu klik tombol Generate
                </p>
              </div>
            )}
            
          </div>

        </main>
      </div>
    </div>
  );
}