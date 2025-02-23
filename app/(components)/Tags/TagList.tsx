"use client"

import { useTags } from '@/app/hooks/modelHooks';
import { TagCard } from './TagCard';
import Link from 'next/link';

export const TagList = () => {
  const { data: tags, isLoading, error } = useTags();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl font-geist-sans mb-4">Your Tags</h2>
        <div className="bg-background p-8 rounded-lg shadow-default border border-default">
          <p className="text-lg mb-4">Loading tags...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl font-geist-sans mb-4">Your Tags</h2>
        <div className="bg-background p-8 rounded-lg shadow-default border border-default">
          <p className="text-lg mb-4 text-red-500">Failed to load tags</p>
          <p className="text-sm text-gray-600">{error.message}</p>
        </div>
      </div>
    )
  }

  if (!tags?.length) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl font-geist-sans mb-4">Your Tags</h2>
        <div className="bg-background p-8 rounded-lg shadow-default border border-default">
          <p className="text-lg mb-4">No tags found</p>
          <Link href="/tags/new" className="button-primary">
            Create Your First Tag
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-geist-sans mb-6">Your Tags</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {tags.map((tag) => (
          <TagCard key={tag._id?.toString()} tag={tag} />
        ))}
      </div>
    </div>
  )
}
