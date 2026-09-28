import React, { useState, useEffect } from 'react';
import { baseAPI } from '../../../../config/api';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

// Suggestions only: the field is free text because the NCUK import stores full
// programme names and new ones can appear.
const PROGRAM_TYPES = [
    'International Foundation Year',
    'Masters Preparation',
    'International Art & Design Foundation',
    'International Year One',
    'International Year One Business Management',
    'International Year One Accounting & Finance',
    'International Year One Computer Science',
    'International Year One Electrical & Electronic Engineering',
    'International Year One Events Management',
    'International Year One Law',
    'International Year Two Business Management',
    'International Year Two Events Management',
];
const EAP_GRADES = ['A*', 'A', 'B', 'C', 'D'];
const EAP_FIELDS = ['overall', 'listening', 'reading', 'speaking', 'writing'];

// The schema stores intakeYear with min 2020 / max 2035, so the input must not
// accept a year the database would reject.
const MIN_INTAKE_YEAR = 2020;
const MAX_INTAKE_YEAR = 2035;

const emptyForm = {
    university: '',
    subject: '',
    programType: '',
    intakeYear: '',
    ifyPointsRequired: '',
    ifyGradesRequired: '',
    eap: { overall: '', listening: '', reading: '', speaking: '', writing: '' },
    notes: '',
    isActive: true,
};

const EditModal = ({ isOpen, onClose, course, onSave, mode = 'edit' }) => {
    const [formData, setFormData] = useState(emptyForm);
    const [universities, setUniversities] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                // The list is paginated, so ask for a limit high enough to hold every option.
                const response = await baseAPI.course.getUniversities({ limit: 1000 });
                setUniversities(Array.isArray(response.data?.data) ? response.data.data : []);
            } catch (error) {
                console.error('Error fetching universities:', error);
            }
        };
        if (isOpen) fetchUniversities();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        if (mode === 'edit' && course) {
            setFormData({
                university: course.university?._id || '',
                subject: course.subject || '',
                programType: course.programType || '',
                intakeYear: course.intakeYear || '',
                ifyPointsRequired: course.ifyPointsRequired ?? '',
                ifyGradesRequired: course.ifyGradesRequired || '',
                eap: {
                    overall: course.eap?.overall || '',
                    listening: course.eap?.listening || '',
                    reading: course.eap?.reading || '',
                    speaking: course.eap?.speaking || '',
                    writing: course.eap?.writing || '',
                },
                notes: course.notes || '',
                isActive: course.isActive ?? true,
            });
        } else {
            setFormData(emptyForm);
        }
    }, [isOpen, course, mode]);

    const setField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
    const setEapField = (field, value) =>
        setFormData((prev) => ({ ...prev, eap: { ...prev.eap, [field]: value } }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        // Drop empty EAP grades so a partially filled band does not overwrite
        // stored values with blanks.
        const eap = Object.fromEntries(
            Object.entries(formData.eap).filter(([, grade]) => grade),
        );

        // Most courses were imported from Excel without a programType or
        // intakeYear. Only send those when the admin actually picks one, so an
        // unrelated edit does not invent values for them.
        const payload = {
            university: formData.university,
            subject: formData.subject,
            ...(formData.programType && { programType: formData.programType }),
            ...(formData.intakeYear && { intakeYear: Number(formData.intakeYear) }),
            // Only Foundation Year courses use IFY results, so these are optional.
            ...(formData.ifyPointsRequired !== '' && { ifyPointsRequired: Number(formData.ifyPointsRequired) }),
            ...(formData.ifyGradesRequired && { ifyGradesRequired: formData.ifyGradesRequired }),
            ...(Object.keys(eap).length > 0 && { eap }),
            notes: formData.notes,
            isActive: formData.isActive,
        };

        try {
            if (mode === 'edit') {
                await baseAPI.course.updateCourse(course._id, payload);
                toast.success('Course updated successfully!');
            } else {
                await baseAPI.course.createCourse(payload);
                toast.success('Course created successfully!');
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving course:', error);
            toast.error(mode === 'edit' ? 'Failed to update course' : 'Failed to create course');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    const inputClass =
        'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-lg w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {mode === 'edit' ? 'Edit Course' : 'Add Course'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                University <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.university}
                                onChange={(e) => setField('university', e.target.value)}
                                className={`${inputClass} capitalize`}
                                required
                            >
                                <option value="">Select a university</option>
                                {universities.map((university) => (
                                    <option key={university._id} value={university._id} className="capitalize">
                                        {university.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Subject <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setField('subject', e.target.value)}
                                className={inputClass}
                                placeholder="e.g. Accounting and Finance"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Programme
                            </label>
                            <input
                                type="text"
                                list="course-programmes"
                                value={formData.programType}
                                onChange={(e) => setField('programType', e.target.value)}
                                className={inputClass}
                                placeholder="e.g. International Foundation Year"
                            />
                            <datalist id="course-programmes">
                                {PROGRAM_TYPES.map((type) => (
                                    <option key={type} value={type} />
                                ))}
                            </datalist>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Intake Year
                            </label>
                            <input
                                type="number"
                                value={formData.intakeYear}
                                onChange={(e) => setField('intakeYear', e.target.value)}
                                className={inputClass}
                                placeholder={`${MIN_INTAKE_YEAR}–${MAX_INTAKE_YEAR}`}
                                min={MIN_INTAKE_YEAR}
                                max={MAX_INTAKE_YEAR}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                IFY Points Required
                            </label>
                            <input
                                type="number"
                                value={formData.ifyPointsRequired}
                                onChange={(e) => setField('ifyPointsRequired', e.target.value)}
                                className={inputClass}
                                placeholder="e.g. 120"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                IFY Grades Required
                            </label>
                            <input
                                type="text"
                                value={formData.ifyGradesRequired}
                                onChange={(e) => setField('ifyGradesRequired', e.target.value)}
                                className={inputClass}
                                placeholder="e.g. BBB"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">EAP Grades</label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {EAP_FIELDS.map((field) => (
                                <div key={field}>
                                    <span className="block text-xs text-gray-500 mb-1 capitalize">{field}</span>
                                    <select
                                        value={formData.eap[field]}
                                        onChange={(e) => setEapField(field, e.target.value)}
                                        className={inputClass}
                                    >
                                        <option value="">Not set</option>
                                        {EAP_GRADES.map((grade) => (
                                            <option key={grade} value={grade}>{grade}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setField('notes', e.target.value)}
                            className={inputClass}
                            rows="3"
                            placeholder="Any entry requirements worth calling out"
                        />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setField('isActive', e.target.checked)}
                            className="w-4 h-4 accent-[#22B2A8]"
                        />
                        <span className="text-sm font-medium text-gray-700">Active</span>
                    </label>

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
                            disabled={saving}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Create Course')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditModal;
