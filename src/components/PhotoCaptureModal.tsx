import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import { Task, Priority } from '../types';
import { Camera, X, Check, Loader2, Upload, AlertCircle, ChevronRight } from 'lucide-react';

interface ParsedTask {
  title: string;
  priority: Priority;
  selected: boolean;
}

interface PhotoCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTasks: (tasks: Omit<Task, 'id' | 'completed'>[]) => void;
}

const today = () => new Date().toISOString().split('T')[0];

export const PhotoCaptureModal: React.FC<PhotoCaptureModalProps> = ({
  isOpen,
  onClose,
  onAddTasks,
}) => {
  const [stage, setStage] = useState<'capture' | 'parsing' | 'review' | 'error'>('capture');
  const [parsedTasks, setParsedTasks] = useState<ParsedTask[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStage('capture');
    setParsedTasks([]);
    setErrorMsg('');
    setPreviewUrl(null);
  };

  const handleClose = () => { reset(); onClose(); };

  const processImage = async (file: File) => {
    setPreviewUrl(URL.createObjectURL(file));
    setStage('parsing');

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (window as any).GEMINI_API_KEY;
      if (!apiKey) throw new Error('No Gemini API key found. Add VITE_GEMINI_API_KEY to your .env file.');

      const ai = new GoogleGenAI({ apiKey });

      const base64 = await fileToBase64(file);

      const result = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: file.type as 'image/jpeg' | 'image/png' | 'image/webp',
                  data: base64,
                },
              },
              {
                text: `Extract every to-do item or task from this image. Return ONLY a JSON array, no markdown, no explanation.
Format: [{"title": "task text", "priority": "low"|"medium"|"high"}]
Rules:
- Each bullet point, numbered item, or checkbox = one task
- Infer priority: words like urgent/asap/important = high, normal = medium, someday/maybe = low
- Clean up the text (fix obvious OCR errors, capitalize properly)
- If no tasks found, return []`,
              },
            ],
          },
        ],
      });

      const text = result.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('Could not parse tasks from image. Try a clearer photo.');

      const items: { title: string; priority: Priority }[] = JSON.parse(jsonMatch[0]);
      if (!items.length) throw new Error('No tasks found in the image. Make sure the list is visible and clear.');

      setParsedTasks(items.map((t) => ({ ...t, selected: true })));
      setStage('review');
    } catch (e: any) {
      setErrorMsg(e.message ?? 'Something went wrong. Please try again.');
      setStage('error');
    }
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res((reader.result as string).split(',')[1]);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

  const toggleTask = (i: number) =>
    setParsedTasks((prev) => prev.map((t, idx) => idx === i ? { ...t, selected: !t.selected } : t));

  const handleAdd = () => {
    const toAdd = parsedTasks
      .filter((t) => t.selected)
      .map((t) => ({
        title: t.title,
        priority: t.priority,
        date: today(),
        category: 'general' as const,
      }));
    onAddTasks(toAdd);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="fixed inset-0 z-50 flex flex-col bg-[#F8F9FE]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-12 pb-4 bg-white border-b border-slate-100">
          <h2 className="text-lg font-extrabold text-slate-900">Scan Task List</h2>
          <button onClick={handleClose} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-5">

          {/* STAGE: capture */}
          {stage === 'capture' && (
            <div className="flex flex-col gap-4">
              <div className="bg-purple-50 border border-purple-100 rounded-3xl p-5 text-center flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-[#7047EB] flex items-center justify-center shadow-lg shadow-purple-400/30">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Photo your to-do list</h3>
                  <p className="text-xs text-slate-500 mt-1">Take a photo or upload an image of any handwritten or printed task list.</p>
                </div>
              </div>

              {/* Camera button (mobile) */}
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="w-full bg-[#7047EB] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-purple-400/30 active:scale-[0.98] transition"
              >
                <Camera className="w-5 h-5" />
                Take Photo
              </button>

              {/* Upload button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-white border-2 border-slate-200 text-slate-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition"
              >
                <Upload className="w-5 h-5" />
                Upload Image
              </button>

              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && processImage(e.target.files[0])} />
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && processImage(e.target.files[0])} />
            </div>
          )}

          {/* STAGE: parsing */}
          {stage === 'parsing' && (
            <div className="flex flex-col items-center gap-5 py-8">
              {previewUrl && (
                <img src={previewUrl} alt="Captured list" className="w-full max-h-52 object-cover rounded-2xl border border-slate-200" />
              )}
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                  <Loader2 className="w-7 h-7 text-[#7047EB] animate-spin" />
                </div>
                <p className="font-bold text-slate-800">Reading your list...</p>
                <p className="text-xs text-slate-400">Gemini AI is extracting your tasks</p>
              </div>
            </div>
          )}

          {/* STAGE: review */}
          {stage === 'review' && (
            <div className="flex flex-col gap-4">
              {previewUrl && (
                <img src={previewUrl} alt="Captured list" className="w-full max-h-40 object-cover rounded-2xl border border-slate-200" />
              )}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Found {parsedTasks.length} task{parsedTasks.length !== 1 ? 's' : ''} — tap to deselect
                </p>
                <div className="flex flex-col gap-2">
                  {parsedTasks.map((t, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => toggleTask(i)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition ${
                        t.selected
                          ? 'bg-white border-purple-200 shadow-sm'
                          : 'bg-slate-50 border-slate-200 opacity-50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                        t.selected ? 'bg-[#7047EB] border-[#7047EB]' : 'border-slate-300'
                      }`}>
                        {t.selected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className="flex-1 text-sm font-semibold text-slate-800">{t.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.priority === 'high' ? 'bg-red-100 text-red-600'
                        : t.priority === 'medium' ? 'bg-amber-100 text-amber-600'
                        : 'bg-slate-100 text-slate-500'
                      }`}>
                        {t.priority}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STAGE: error */}
          {stage === 'error' && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-red-500" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Could not read list</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">{errorMsg}</p>
              </div>
              <button onClick={reset} className="px-5 py-2.5 rounded-xl bg-[#7047EB] text-white font-bold text-sm">
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        {stage === 'review' && (
          <div className="px-5 pb-8 pt-3 bg-white border-t border-slate-100">
            <button
              onClick={handleAdd}
              disabled={!parsedTasks.some((t) => t.selected)}
              className="w-full bg-[#7047EB] disabled:opacity-40 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-purple-400/25 active:scale-[0.98] transition"
            >
              <Check className="w-5 h-5" />
              Add {parsedTasks.filter((t) => t.selected).length} Task{parsedTasks.filter((t) => t.selected).length !== 1 ? 's' : ''} to Today
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
