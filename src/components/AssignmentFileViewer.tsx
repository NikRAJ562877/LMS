import React from 'react';
import { AssignmentFile } from '../types';
import { FileText, Download, Image, File } from 'lucide-react';

interface AssignmentFileViewerProps {
  files: AssignmentFile[];
  title?: string;
}

export const AssignmentFileViewer = ({ files, title = 'Attached Files' }: AssignmentFileViewerProps) => {
  if (!files || files.length === 0) return null;

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="size-8 text-red-500" />;
      case 'image':
        return <Image className="size-8 text-blue-500" />;
      case 'document':
        return <File className="size-8 text-blue-600" />;
      default:
        return <File className="size-8 text-gray-500" />;
    }
  };

  const handleDownload = (file: AssignmentFile) => {
    // In a real app, this would trigger actual download
    alert(`Downloading ${file.name}...`);
  };

  return (
    <div>
      <div className="text-sm mb-2">{title}</div>
      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              {getFileIcon(file.type)}
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{file.name}</div>
                <div className="text-xs text-gray-500">
                  {file.type.toUpperCase()} • {file.size}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDownload(file)}
              className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors text-sm"
            >
              <Download className="size-4" />
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
