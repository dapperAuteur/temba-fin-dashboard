"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IVendor } from '@/types/vendors';
import { LoadingState } from '@/types/common';
import { apiClient } from '@/lib/api';

interface VendorFormProps {
  vendor?: Partial<IVendor>;
  onComplete?: (vendor: IVendor) => void;
  mode: 'create' | 'edit';
}

interface VendorFormData {
  name: string;
  websites?: string[];
  contacts?: string[];
}

export default function VendorForm({ vendor, onComplete, mode = 'create' }: VendorFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<VendorFormData>({
    name: vendor?.name || '',
    websites: vendor?.websites || [],
    contacts: vendor?.contacts || []
  });

  const [submitState, setSubmitState] = useState<LoadingState<IVendor>>({
    isLoading: false,
    error: null,
    data: null
  });

  const [message, setMessage] = useState<{text: string; type: 'success' | 'error'} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState({ isLoading: true, error: null, data: null });

    try {
      const endpoint = vendor?._id ? `/api/vendors/${vendor._id}` : '/api/vendors';
      const method = vendor?._id ? 'PATCH' : 'POST';

      const result = await apiClient.fetch<IVendor>(endpoint, {
        method,
        body: JSON.stringify({formData})
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to create vendor');
      }

      if (result.success && result.data) {
        setMessage({text: mode === 'create' ? 'Vendor created successfully!' : 'Vendor updated successfully!', type: 'success'});
        setSubmitState({ isLoading: false, error: null, data: result.data });
        onComplete?.(result.data);
        router.refresh();
      }
      } catch (error) {
        setMessage({text: `Failed to create vendor ${error}`, type: 'error'});
        setSubmitState({ 
          isLoading: false, 
          error: new Error(`An unexpected error occurred ${error}`), 
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
            <label htmlFor="name" className="block account-type">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor='websites' className="block account-type">Websites</label>
            <input
            type="text"
            id="websites"
            name="websites"
            value={formData.websites?.join(',') || ''}
            onChange={(e) => setFormData({ ...formData, websites: e.target.value.split(',') })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor='contacts' className="block account-type">Contacts</label>
            <input
            type="text"
            id="contacts"
            name="contacts"
            value={formData.contacts?.join(',') || ''}
            onChange={(e) => setFormData({ ...formData, websites: e.target.value.split(',') })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
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
              {submitState.isLoading ? 'Saving...' : mode === 'create' ? 'Create Transaction' : 'Update Transaction'}
            </button>
          </div>
        </form>
    </div>
  );
}