import React, { useState, useEffect } from 'react';
import { baseAPI } from '../../../../config/api';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUploadField from '../../../../components/ui/ImageUploadField';
import { formatCountryName } from '../../../../utils/formatName';
import { countryCodeFor } from '../../../../utils/countryCodes';
import { flagAssetFor } from '../../../../utils/flagAssets';
import { errorsFromResponse, rules } from '../../../../utils/validation';

const EditModal = ({ isOpen, onClose, country, onSave, mode = 'edit' }) => {
    const [formData, setFormData] = useState({ name: '', imageId: '' });
    // Bumped to remount the picker, which clears its preview.
    const [pickerKey, setPickerKey] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({ name: '', flag: '' });

    // Updates live as the name is typed, so the admin sees which flag will be used.
    const autoFlagUrl = flagAssetFor(countryCodeFor(formData.name));

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && country) {
                setFormData({ name: country.name, imageId: country.flag?._id || '' });
            } else {
                setFormData({ name: '', imageId: '' });
            }
            setPickerKey((k) => k + 1);
            setErrors({ name: '', flag: '' });
        }
    }, [isOpen, country, mode]);

    const handleImageSelect = async (file) => {
        setUploading(true);
        try {
            const response = await baseAPI.upload.singleUpload(file);
            const uploadedId = response.data?._id;
            if (!uploadedId) throw new Error(response.message || 'Upload failed');
            setFormData((prev) => ({ ...prev, imageId: uploadedId }));
            setErrors((prev) => ({ ...prev, flag: '' }));
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Could not upload the flag');
            // Clear the preview so it cannot imply a flag that was never stored.
            setPickerKey((k) => k + 1);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Same rule the API applies (see src/utils/validation.js).
        const newErrors = { name: rules.countryName()(formData.name) || '', flag: '' };
        // No longer required: a flag is derived from the country name
        // automatically, and an upload only overrides it.

        if (newErrors.name || newErrors.flag) {
            setErrors(newErrors);
            return;
        }
        
        setSaving(true);
        try {
            let response;
            if (mode === 'edit') {
                response = await baseAPI.course.updateCountry(country._id, {
                    name: formData.name,
                    // null clears a previously uploaded flag; an empty string
                    // would fail the ObjectId cast.
                    flag: formData.imageId || null,
                });
            } else {
                response = await baseAPI.course.createCountry({
                    name: formData.name,
                    // Omitted entirely when there is no upload, so the country
                    // falls back to its automatic flag.
                    ...(formData.imageId && { flag: formData.imageId }),
                });
            }
            if (response.success) {
                toast.success(response.message || (mode === 'edit' ? 'Country updated successfully!' : 'Country created successfully!'));
                onSave();
                onClose();
            } else {
                const serverErrors = errorsFromResponse(response);
                if (serverErrors.name) setErrors({ name: serverErrors.name, flag: '' });
                toast.error(response.message || (mode === 'edit' ? 'Failed to update country' : 'Failed to create country'));
            }
        } catch (error) {
            console.error('Error saving country:', error);
            toast.error(error.message || (mode === 'edit' ? 'Failed to update country' : 'Failed to create country'));
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {mode === 'edit' ? 'Edit Country' : 'Add Country'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value });
                                setErrors({ ...errors, name: '' });
                            }}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Enter country name"
                            maxLength={60}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <ImageUploadField
                        key={pickerKey}
                        label="Country Flag (optional, shown automatically)"
                        existingUrl={mode === 'edit' ? country?.flag?.url : null}
                        fallbackUrl={autoFlagUrl}
                        fallbackHint={
                            autoFlagUrl
                                ? `Using the built-in flag for ${formatCountryName(formData.name)}. Upload one only to override it.`
                                : undefined
                        }
                        uploading={uploading}
                        error={errors.flag}
                        onSelect={handleImageSelect}
                        onClear={() => {
                            setPickerKey((k) => k + 1);
                            setFormData((prev) => ({ ...prev, imageId: '' }));
                        }}
                    />

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={uploading || saving}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#22B2A8] rounded-md hover:bg-[#1a9d8f] transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Create Country')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditModal;
