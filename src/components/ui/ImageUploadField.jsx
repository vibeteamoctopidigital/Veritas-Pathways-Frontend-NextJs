import React, { useEffect, useMemo, useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';

/**
 * Image picker with a live preview.
 *
 * The preview shows the newly chosen file immediately via an object URL, so the
 * admin sees the image straight away rather than waiting for the upload, then
 * falls back to whatever is already saved on the record.
 *
 * Uploading is left to the caller (via onSelect) so each modal keeps control of
 * the id it stores, but the preview and clearing are handled here.
 */
const ImageUploadField = ({
    label,
    existingUrl,
    // Shown when nothing has been chosen or stored, e.g. the automatic country
    // flag. It is not removable, because there is nothing of the user's to remove.
    fallbackUrl,
    fallbackHint,
    uploading = false,
    error = '',
    required = false,
    onSelect,
    onClear,
}) => {
    const [file, setFile] = useState(null);

    const localPreview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

    // Object URLs must be revoked or the blob stays in memory for the session.
    useEffect(() => {
        if (!localPreview) return undefined;
        return () => URL.revokeObjectURL(localPreview);
    }, [localPreview]);

    const handleChange = (event) => {
        const selected = event.target.files?.[0];
        if (!selected) return;
        setFile(selected);
        onSelect?.(selected);
    };

    const handleClear = () => {
        setFile(null);
        onClear?.();
    };

    // What the user actually owns here: a file they picked, or one already
    // stored. Only these get a Replace/Remove affordance.
    const ownPreview = localPreview || existingUrl;
    const previewUrl = ownPreview || fallbackUrl;
    const showingFallback = !ownPreview && Boolean(fallbackUrl);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div className="flex items-start gap-4">
                {/* Preview */}
                <div className="relative w-36 h-20 shrink-0 rounded-lg border border-gray-200 bg-white p-2 flex items-center justify-center overflow-hidden">
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt={`${label} preview`}
                            className="max-h-full max-w-full object-contain"
                            onError={(event) => {
                                // A stored file that no longer exists on disk.
                                event.currentTarget.style.display = 'none';
                            }}
                        />
                    ) : (
                        <ImageIcon className="w-7 h-7 text-gray-300" />
                    )}

                    {uploading && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                            <span className="text-[11px] font-medium text-gray-600">Uploading…</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                            <Upload className="w-4 h-4" />
                            <span className="text-sm">
                                {uploading ? 'Uploading…' : ownPreview ? 'Replace image' : 'Choose file'}
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                                className="hidden"
                                disabled={uploading}
                            />
                        </label>

                        {ownPreview && !uploading && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="inline-flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Remove
                            </button>
                        )}
                    </div>

                    {file && (
                        <p className="mt-2 text-xs text-gray-500 truncate" title={file.name}>
                            {file.name}
                        </p>
                    )}
                    {showingFallback && fallbackHint && (
                        <p className="mt-2 text-xs text-gray-500">{fallbackHint}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-400">
                        Uploads are added to the Media Library.
                    </p>
                    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default ImageUploadField;
