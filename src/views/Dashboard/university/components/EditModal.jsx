import React, { useState, useEffect } from 'react';
import { baseAPI } from '../../../../config/api';
import { formatCountryName } from '../../../../utils/formatName';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUploadField from '../../../../components/ui/ImageUploadField';

const EditModal = ({ isOpen, onClose, university, onSave, mode = 'edit' }) => {
    const [formData, setFormData] = useState({ name: '', country: '', imageId: '' });
    const [countries, setCountries] = useState([]);
    // Bumped to remount the picker, which clears its preview.
    const [pickerKey, setPickerKey] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                // The endpoint is paginated, so the array sits at data.data and
                // the limit has to be high enough to hold every option.
                const response = await baseAPI.course.getCountries({ limit: 1000 });
                setCountries(Array.isArray(response.data?.data) ? response.data.data : []);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && university) {
                setFormData({ name: university.name, country: university.country?._id || '', imageId: university.universityLogo?._id || '' });
            } else {
                setFormData({ name: '', country: '', imageId: '' });
            }
            setPickerKey((k) => k + 1);
        }
    }, [isOpen, university, mode]);

    const handleImageSelect = async (file) => {
        setUploading(true);
        try {
            const response = await baseAPI.upload.singleUpload(file);
            const uploadedId = response.data?._id;
            if (!uploadedId) throw new Error(response.message || 'Upload failed');
            setFormData((prev) => ({ ...prev, imageId: uploadedId }));
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Could not upload the logo');
            setPickerKey((k) => k + 1);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = mode === 'edit'
                ? await baseAPI.course.updateUniversity(university._id, {
                    name: formData.name,
                    country: formData.country,
                    // null clears an existing logo; an empty string would fail
                    // the ObjectId cast and surface as "Validation error".
                    universityLogo: formData.imageId || null,
                })
                : await baseAPI.course.createUniversity({
                    name: formData.name,
                    country: formData.country,
                    ...(formData.imageId && { universityLogo: formData.imageId }),
                });

            // A failed request still resolves, so the flag has to be checked or
            // the modal reports success on an error.
            if (response?.success === false) {
                throw new Error(response.message || 'Request failed');
            }

            toast.success(
                response?.message ||
                (mode === 'edit' ? 'University updated successfully!' : 'University created successfully!'),
            );
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving university:', error);
            toast.error(
                error.message ||
                (mode === 'edit' ? 'Failed to update university' : 'Failed to create university'),
            );
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
                        {mode === 'edit' ? 'Edit University' : 'Add University'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter university name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Country <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 capitalize"
                            required
                        >
                            <option value="">Select a country</option>
                            {countries.map((country) => (
                                <option key={country._id} value={country._id} className="capitalize">
                                    {formatCountryName(country.name)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <ImageUploadField
                        key={pickerKey}
                        label="University Logo"
                        existingUrl={mode === 'edit' ? university?.universityLogo?.url : null}
                        uploading={uploading}
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
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Create University')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditModal;