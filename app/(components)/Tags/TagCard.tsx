"use client";

import { ITag } from './../../../types/tags';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TagForm from './TagForm';

interface TagCardProps {
  tag?: Partial<ITag>
  mode?: 'create' | 'edit'
}

export const TagCard = ({ tag }: TagCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/tags/${tag?._id}`);
  };


  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking delete button
    try {
      const response = await fetch(`/api/tags/${tag?._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Trigger refresh of accounts list
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  if (isEditing) {
    return <TagForm tag={tag} onComplete={() => setIsEditing(false)} mode={'edit'} />;
  }

  if (!tag || !tag.name) {
    return (
      <div className="bg-background p-6 rounded-lg shadow-default border border-default text-center">
        <p className="text-foreground">Tag information unavailable</p>
      </div>
    )
  }
  return (
    <div className="card-3d cursor-pointer" onClick={handleCardClick}>
      <h3 className="text-xl font-geist-sans mb-2">{tag.name}</h3>
      <p className="text-foreground mb-2">Description: {tag.description || 'Not specified'}</p>
      <div className="flex gap-4 mt-4" onClick={e => e.stopPropagation()}>
        <button 
          onClick={() => setIsEditing(true)}
          className="button-edit"
        >
          Edit
        </button>
        <button 
          onClick={handleDelete}
          className="button-delete"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
