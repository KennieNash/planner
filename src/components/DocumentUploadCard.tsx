import React, { useState } from 'react';
import { Upload, FileText, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { VerificationDocument } from '@/types/verification';

interface DocumentUploadCardProps {
  documentType: {
    type: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
    required: boolean;
  };
  documents: VerificationDocument[];
  onDocumentUpload: (type: string, file: File, name: string) => Promise<void>;
  onDocumentRemove: (documentId: string) => Promise<void>;
  isUploading: boolean;
}

const DocumentUploadCard = ({
  documentType,
  documents,
  onDocumentUpload,
  onDocumentRemove,
  isUploading
}: DocumentUploadCardProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');

  const IconComponent = documentType.icon;
  const typeDocuments = documents.filter(doc => doc.type === documentType.type);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-400">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="border-green-500 text-green-400">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="border-red-500 text-red-400">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="border-gray-500 text-gray-400">Unknown</Badge>;
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    if (!documentName) {
      setDocumentName(file.name);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentName) return;
    
    try {
      await onDocumentUpload(documentType.type, selectedFile, documentName);
      setSelectedFile(null);
      setDocumentName('');
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <IconComponent className={`w-5 h-5 mr-2 ${documentType.color}`} />
          {documentType.title}
          {documentType.required && <span className="text-red-400 ml-1">*</span>}
        </CardTitle>
        <p className="text-gray-300 text-sm">{documentType.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Documents */}
        {typeDocuments.length > 0 && (
          <div className="space-y-2">
            <Label className="text-gray-300">Uploaded Documents</Label>
            {typeDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-white text-sm">{doc.name}</p>
                    <p className="text-gray-400 text-xs">Uploaded {doc.uploadDate}</p>
                    {doc.notes && (
                      <p className="text-yellow-400 text-xs mt-1">Note: {doc.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(doc.status)}
                  {doc.url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDocumentRemove(doc.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload New Document */}
        <div className="space-y-3">
          <Label className="text-gray-300">Upload New Document</Label>
          <div className="space-y-2">
            <Input
              placeholder="Document name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <div className="flex gap-2">
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className="bg-white/10 border-white/20 text-white file:text-white file:bg-blue-500 file:border-0 file:rounded-md file:px-3 file:py-1"
              />
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
            <p className="text-xs text-gray-400">
              Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUploadCard;
