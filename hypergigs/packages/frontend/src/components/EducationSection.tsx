import { useState } from 'react';
import { Plus, X, Edit2, Check, GraduationCap, Calendar } from 'lucide-react';
import type { Education, CreateEducationRequest } from '@/types/education';
import { DEGREE_OPTIONS, AI_FIELD_OF_STUDY } from '@/types/education';

interface EducationSectionProps {
  education: Education[];
  isOwnProfile: boolean;
  onAdd: (data: CreateEducationRequest) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate?: (id: string, data: CreateEducationRequest) => Promise<void>;
}

export default function EducationSection({
  education,
  isOwnProfile,
  onAdd,
  onDelete,
  onUpdate,
}: EducationSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateEducationRequest>({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    present: false,
    gpa: undefined,
    description: '',
  });

  const resetForm = () => {
    setFormData({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      present: false,
      gpa: undefined,
      description: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!formData.institution || !formData.degree || !formData.fieldOfStudy) {
      return;
    }

    try {
      if (editingId && onUpdate) {
        await onUpdate(editingId, formData);
      } else {
        await onAdd(formData);
      }
      resetForm();
    } catch (error) {
      console.error('Failed to save education:', error);
    }
  };

  const handleEdit = (edu: Education) => {
    setEditingId(edu.id);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : '',
      endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : '',
      present: edu.present,
      gpa: edu.gpa,
      description: edu.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      await onDelete(id);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="mb-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Education</h2>
        {isOwnProfile && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="mb-8 p-6 bg-white rounded-2xl border border-border">
          <h3 className="text-lg font-bold mb-4">
            {editingId ? 'Edit Education' : 'Add Education'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Institution/University *
              </label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) =>
                  setFormData({ ...formData, institution: e.target.value })
                }
                placeholder="e.g., Stanford University, MIT, Coursera"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Degree *
                </label>
                <select
                  value={formData.degree}
                  onChange={(e) =>
                    setFormData({ ...formData, degree: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select degree</option>
                  {DEGREE_OPTIONS.map((degree) => (
                    <option key={degree} value={degree}>
                      {degree}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Field of Study *
                </label>
                <select
                  value={formData.fieldOfStudy}
                  onChange={(e) =>
                    setFormData({ ...formData, fieldOfStudy: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select field</option>
                  {AI_FIELD_OF_STUDY.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  disabled={formData.present}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">GPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  value={formData.gpa || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gpa: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  placeholder="4.0"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.present}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    present: e.target.checked,
                    endDate: e.target.checked ? '' : formData.endDate,
                  })
                }
                className="rounded border-border"
              />
              <span className="text-sm">Currently studying here</span>
            </label>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Relevant coursework, achievements, thesis, etc."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSubmit}
                disabled={
                  !formData.institution ||
                  !formData.degree ||
                  !formData.fieldOfStudy
                }
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                {editingId ? 'Update' : 'Add'} Education
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Education List */}
      <div className="space-y-6">
        {education.length > 0 ? (
          education.map((edu) => (
            <div
              key={edu.id}
              className="group relative pl-8 border-l-2 border-border hover:border-primary transition-colors"
            >
              <div className="absolute left-[-9px] top-2 w-4 h-4 bg-primary rounded-full border-4 border-background" />
              <div className="pb-8">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold">{edu.degree}</h3>
                      {edu.verified && (
                        <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-lg text-muted-foreground flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      {edu.institution}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {edu.fieldOfStudy}
                      {edu.gpa && ` • GPA: ${edu.gpa}`}
                    </p>
                  </div>
                  {isOwnProfile && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(edu)}
                        className="p-2 opacity-0 group-hover:opacity-100 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit education"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(edu.id)}
                        className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete education"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(edu.startDate)}
                    {' - '}
                    {edu.present ? 'Present' : formatDate(edu.endDate)}
                  </span>
                </div>
                {edu.description && (
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {edu.description}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">No education added yet</p>
        )}
      </div>
    </div>
  );
}
