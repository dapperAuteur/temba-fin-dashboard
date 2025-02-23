import TagForm from '@/app/(components)/Tags/TagForm';

export default function CreateTagPage() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Create New Tag</h1>
      <TagForm mode="create" />
    </div>
  );
}
