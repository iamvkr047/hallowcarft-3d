import React, { useState } from 'react';
import { X, Sparkles, Loader2, AlertCircle, Tag, FileText, CheckCircle2 } from 'lucide-react';
import { useAppDataStore } from '../../zustand/store';
import { publishStickerWithImage, type UserStickersType } from '../../appwrite/db';
import type { CarveSettings } from '../../types';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewUrl: string | null;
  imageFile: File | null;
  settings?: CarveSettings;
  onSuccess?: (sticker: UserStickersType) => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  previewUrl,
  imageFile,
  settings,
  onSuccess,
}) => {
  const { user } = useAppDataStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for your craft.');
      return;
    }

    if (!imageFile) {
      setError('No snapshot image captured. Please try again.');
      return;
    }

    if (!user) {
      setError('You must be logged in to publish a sticker.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Parse comma-separated tags
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const res = await publishStickerWithImage(imageFile, {
      userId: user.$id,
      authorName: user.name || user.email,
      title: title.trim(),
      description: description.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      settings: settings ? JSON.stringify(settings) : undefined,
    });

    setIsSubmitting(false);

    if (res.status && res.data) {
      setIsSuccess(true);
      if (onSuccess) {
        onSuccess(res.data);
      }
      setTimeout(() => {
        setIsSuccess(false);
        setTitle('');
        setDescription('');
        setTagsInput('');
        onClose();
      }, 1500);
    } else {
      setError(res.message || 'Failed to publish craft sticker.');
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setError(null);
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Publish Pumpkin Sticker</h2>
              <p className="text-xs text-stone-400">Share your 3D craft to the web showcase</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {isSuccess ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Sticker Published!</h3>
              <p className="text-xs text-stone-400 max-w-xs">
                Your pumpkin sticker is now live in the community showcase gallery.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Sticker Card Preview */}
              <div className="flex items-center justify-center bg-stone-950/70 border border-stone-800/80 rounded-xl p-4">
                <div className="relative w-48 aspect-square rounded-xl overflow-hidden border-2 border-orange-500/30 shadow-lg shadow-orange-950/40 bg-stone-950 flex items-center justify-center group">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Pumpkin Craft Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-xs text-stone-500">No snapshot available</div>
                  )}
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 px-2 py-1 bg-stone-900/85 backdrop-blur-md rounded-md border border-stone-700/50 flex items-center justify-between text-[10px] text-stone-300">
                    <span className="font-semibold text-orange-400 truncate">
                      {title.trim() || 'Pumpkin Sticker'}
                    </span>
                    <span className="text-stone-400 text-[9px] shrink-0">
                      by {user?.name || user?.email || 'Crafter'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3 bg-red-950/50 border border-red-800/60 text-red-300 text-xs rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Title Input */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Craft Title <span className="text-orange-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Glowing Evil Grin"
                  maxLength={100}
                  className="w-full bg-stone-950/90 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-orange-500/70 focus:ring-1 focus:ring-orange-500/50 transition-colors"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Description <span className="text-stone-500 text-[11px]">(optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute top-2.5 left-3 text-stone-600 pointer-events-none">
                    <FileText className="w-4 h-4" />
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description or backstory..."
                    rows={2}
                    maxLength={300}
                    className="w-full bg-stone-950/90 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-orange-500/70 focus:ring-1 focus:ring-orange-500/50 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Tags <span className="text-stone-500 text-[11px]">(comma separated)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-600">
                    <Tag className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="spooky, glowing, scary"
                    className="w-full bg-stone-950/90 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-orange-500/70 focus:ring-1 focus:ring-orange-500/50 transition-colors"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-stone-800/80">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-600/50 text-white font-medium rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-orange-950/50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Publish Sticker</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
