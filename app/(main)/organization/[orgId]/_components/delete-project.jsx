"use client";

import { deleteProject } from '@/actions/project';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/use-fetch';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

const DeleteProject = ({ projectId }) => {
  const router = useRouter();

  const {
    data: deleted,
    loading: isDeleting,
    error,
    fn: deleteProjectFn,
  } = useFetch(deleteProject);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProjectFn(projectId);
    }
  };

  useEffect(() => {
    if (deleted?.success) {
      toast.success("Project deleted");
      router.refresh();
    }
  }, [deleted, router]);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={isDeleting ? "animate-pulse" : ""}
        onClick={handleDelete} // ✅ Fix: capitalized correctly
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </>
  );
};

export default DeleteProject;
