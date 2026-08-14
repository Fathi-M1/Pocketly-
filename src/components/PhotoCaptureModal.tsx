import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createWorker } from 'tesseract.js';
import { Task, Priority } from '../types';
import { Camera, X, Check, Upload, ChevronRight, ScanText } from 'lucide-react';

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

const inferPriority = (text: string): Priority => {
  const t = text.toLowerCase();
  if (/urgent|asap|important|critical|must|deadline|today|now/.test(t)) return 'high';
  if (/maybe|someday|later|low|whenever|optional/.test(t)) return 'low';
  return 'medium';
};

const parseLines = (rawText: string): ParsedTask[] =>
  rawText
    .split('\n')
    .map((l) => l.replace(/^[\s\-\*\•\d\.\)\[\]xX✓✗□■◻◼]+/, '').trim())
    .filter((l) => l.length > 2)
    .map((title) => ({ title, priority: inferPriority(title), selected: true }));

export const PhotoCaptureModal: React.FC<PhotoCaptureModalProps> = ({
  isOpen,
  onClose,
  onAddTasks,
}) => {
  const [stage, setStage] = useState<'capture' | 'scanning' | 'review' | 'error'>('capture');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [parsedTasks, setParsedTasks] = useState<ParsedTask[]>([]);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const reset = () => { setStage('capture'); setParsedTasks([]); setPreviewUrl(null); setProgress(0); };
  const handleClose = () => { reset(); onClose(); };

  const handleImage = async (file: File) => {
    setPreviewUrl(URL.createObjectURL(file));
    setStage('scanning');
    setProgress(0);

    try {
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const { data } = await worker.recognize(file);
      await worker.terminate();

      const tasks = parseLines(data.text);

      if (!tasks.length) {
        setErrorMsg('No tasks found — make sure the list text is clear and readable.');
        setStage('error');
        return;
      }

      setParsedTasks(tasks);
      setStage('review');
    } catch (e: any) {
      setErrorMsg(e?.message ?? 'OCR failed. Try a clearer, well-lit photo.');
      setStage('error');
    }
  };

  const toggleTask = (i: number) =>
    setParsedTasks((prev) => prev.map((t, idx) => idx === i ? { ...t, selected: !t.selected } : t));

  const cyclePriority = (i: number) => {
    const order: Priority[] = ['low', 'medium', 'high'];
    setParsedTasks((prev) =>
      prev.map((t, idx) =>
        idx === i ? { ...t, priority: order[(order.indexOf(t.priority) + 1) % 3] } : t
      )
    );
  };

  const handleAdd = () => {
    onAddTasks(
      parsedTasks
        .filter((t) => t.selected)
        .map((t) => ({ title: t.title, priority: t.priority, date: today(), category: 'general' as const }))
    );
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
          <h2 className="text-lg font-extrabold text-slate-900">
            {stage === 'capture' ? 'Scan Task List'
              : stage === 'scanning' ? 'Reading Your List...'
              : stage === 'review' ? 'Review Tasks'
              : 'Could Not Read'}
          </h2>
          <button onClick={handleClose} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-4">

          {/* CAPTURE */}
          {stage === 'capture' && (
            <>
              <div className="bg-purple-50 border border-purple-100 rounded-3xl p-5 text-center flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl bg-[#7047EB] flex items-center justify-center shadow-lg shadow-purple-400/30">
                  <ScanText className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">Point at your list</h3>
                <p className="text-xs text-slate-500">Take a photo of any handwritten or printed to-do list. Tasks are auto-extracted instantly — no internet needed.</p>
              </div>

              <button
                onClick={() => cameraInputRef.current?.click()}
                className="w-full bg-[#7047EB] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-purple-400/30 active:scale-[0.98] transition"
              >
                <Camera className="w-5 h-5" />
                Take Photo
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-white border-2 border-slate-200 text-slate-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition"
              >
                <Upload className="w-5 h-5" />
                Upload Image
              </button>

              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} />
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} />
            </>
          )}

          {/* SCANNING */}
          {stage === 'scanning' && (
            <div className="flex flex-col items-center gap-5">
              {previewUrl && (
                <img src={previewUrl} alt="Your list" className="w-full max-h-52 object-contain rounded-2xl border border-slate-200 bg-white" />
              )}
              <div className="w-full flex flex-col gap-3">
                <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-[#7047EB] rounded-full"
                  />
                </div>
                <p className="text-center text-sm font-bold text-slate-600">Scanning text... {progress}%</p>
                <p className="text-center text-xs text-slate-400">Running on-device OCR — no internet needed</p>
              </div>
            </div>
          )}

          {/* REVIEW */}
          {stage === 'review' && (
            <>
              {previewUrl && (
                <img src={previewUrl} alt="Your list" className="w-full max-h-32 object-contain rounded-2xl border border-slate-200 bg-white" />
              )}
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {parsedTasks.length} task{parsedTasks.length !== 1 ? 's' : ''} found · tap priority to change · tap row to toggle
              </p>
              <div className="flex flex-col gap-2">
                {parsedTasks.map((t, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition ${
                      t.selected ? 'bg-white border-purple-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-40'
                    }`}
                  >
                    <button
                      onClick={() => toggleTask(i)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                        t.selected ? 'bg-[#7047EB] border-[#7047EB]' : 'border-slate-300'
                      }`}
                    >
                      {t.selected && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                    <span className="flex-1 text-sm font-semibold text-slate-800 text-left">{t.title}</span>
                    <button
                      onClick={() => cyclePriority(i)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        t.priority === 'high' ? 'bg-red-100 text-red-600'
                        : t.priority === 'medium' ? 'bg-amber-100 text-amber-600'
                        : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {t.priority}
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* ERROR */}
          {stage === 'error' && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <ScanText className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Couldn't read the list</p>
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
