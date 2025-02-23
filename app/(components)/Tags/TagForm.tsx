"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ITag } from '@/types/tags';
import { LoadingState } from '@/types/common';
import { apiClient } from '@/lib/api';

interface TagFormProps {
  tag?: Partial<ITag>;
  onComplete?: (tag: ITag) => void;
  mode: 'create' | 'edit';
}

interface TagFormData {
  name: string;
  description?: string;
}

export default function TagForm({ tag, onComplete, mode = 'create' }: TagFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<TagFormData>({
    name: tag?.name || 'Provide Tag Name',
    description: tag?.description || 'Provide Tag Description'
  });
  const [submitState, setSubmitState] = useState<LoadingState<ITag>>({
    isLoading: false,
    error: null,
    data: null
  });
  const [message, setMessage] = useState<{text: string; type: 'success' | 'error'} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState({ isLoading: true, error: null, data: null });

    try {
      const endpoint = tag?._id ? `/api/tags/${tag?._id}` : '/api/tags';
    
      const method = tag?._id ? 'PATCH' : 'POST';
      const result = await apiClient.fetch<ITag>(endpoint, {
              method: method,
              body: JSON.stringify({ formData }),
            });

            if (!result.success) {
              setSubmitState({ 
                isLoading: false, 
                error: new Error(result.error || 'Failed to create tag'), 
                data: null 
              });
              throw new Error(result.error || 'Failed to create tag 0');
            }
            if (result.success && result.data) {
              setMessage({text: mode === 'create' ? 'Tag created successfully!' : 'Tag updated successfully!', type: 'success'});
              setSubmitState({ 
                isLoading: false, 
                error: null, 
                data: result.data 
              });
              onComplete?.(result.data);
              router.refresh();
            }
                  
            } catch (error) {
              console.error('Error creating tag:', error);
              setSubmitState({ 
                isLoading: false, 
                error: new Error('An unexpected error occurred'), 
                data: null 
              });
            }
          };

  return (
    <div>
      {message && (
      <div className={`p-4 rounded-md mb-4 ${
        message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto mt-8">
        <div>
          <label htmlFor="name" className="block account-type">
            Tag Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="description" className="block account-type">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
            rows={4}
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="button-secondary px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitState.isLoading}
            className="button-primary px-4 py-2 rounded"
          >
            {submitState.isLoading ? 'Creating...' :  'Submit Form'}
          </button>
        </div>
      </form>
    </div>
  );
};