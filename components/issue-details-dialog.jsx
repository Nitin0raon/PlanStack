"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MDEditor from "@uiw/react-md-editor";
import UserAvatar from "./user-avatar";
import useFetch from "@/hooks/use-fetch";
import { useOrganization, useUser } from "@clerk/nextjs";

import { BarLoader } from "react-spinners";
import { ExternalLink } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";


import { deleteIssue, updateIssue } from "@/actions/issues";
import { Badge } from "./ui/badge";


export default function IssueDetailsDialog({
  isOpen,
  onClose,
  issue,
  onDelete = () => {},
  onUpdate = () => {},
  borderCol = "",
}) {
  const [status] = useState(issue.status);
  const [priority] = useState(issue.priority);
  const { user } = useUser();
  const { membership } = useOrganization();
  const router = useRouter();
  const pathname = usePathname();

  const {
    loading: deleteLoading,
    error: deleteError,
    fn: deleteIssueFn,
    data: deleted,
  } = useFetch(deleteIssue);

  const {
    loading: updateLoading,
    error: updateError,
    fn: updateIssueFn,
    data: updated,
  } = useFetch(updateIssue);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      deleteIssueFn(issue.id);
    }
  };

  useEffect(() => {
    if (deleted) {
      onClose();
      onDelete();
    }
    if (updated) {
      onUpdate(updated);
    }
  }, [deleted, updated, deleteLoading, updateLoading]);

  const canChange =
    user.id === issue.reporter.clerkUserId || membership.role === "org:admin";

  const handleGoToProject = () => {
    router.push(`/project/${issue.projectId}?sprint=${issue.sprintId}`);
  };

  const isProjectPage = !pathname.startsWith("/project/");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-3xl">{issue.title}</DialogTitle>
            {isProjectPage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleGoToProject}
                title="Go to Project"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>
        {(updateLoading || deleteLoading) && (
          <BarLoader width={"100%"} color="#36d7b7" />
        )}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Badge variant="highlight">{status}</Badge>
            <Badge variant="highlight">{priority}</Badge>
          </div>
          <div>
            <h4 className="font-semibold">Description</h4>
            <MDEditor.Markdown
              className="rounded px-2 py-1"
              source={issue.description ? issue.description : "--"}
            />
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold">Assignee</h4>
              <UserAvatar user={issue.assignee} />
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold">Reporter</h4>
              <UserAvatar user={issue.reporter} />
            </div>
          </div>
          {canChange && (
            <Button
              onClick={handleDelete}
              disabled={deleteLoading}
              variant="destructive"
            >
              {deleteLoading ? "Deleting..." : "Delete Issue"}
            </Button>
          )}
          {(deleteError || updateError) && (
            <p className="text-red-500">
              {deleteError?.message || updateError?.message}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}