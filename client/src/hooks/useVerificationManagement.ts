
import React, { useState, useCallback } from 'react';
import { VerificationDocument } from '@/types/verification';
import { uploadDocument, removeDocument } from '@/services/documentUploadService';
import { useToast } from '@/hooks/use-toast';

export interface UseVerificationManagementReturn {
  documents: VerificationDocument[];
  verificationStatus: 'pending' | 'partial' | 'verified' | 'rejected';
  isLoading: boolean;
  uploadDocumentHandler: (type: string, file: File, name: string) => Promise<void>;
  removeDocumentHandler: (documentId: string) => Promise<void>;
  refreshVerificationStatus: () => void;
}

export const useVerificationManagement = (): UseVerificationManagementReturn => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock provider documents - in real app this would come from API
  const [documents, setDocuments] = useState<VerificationDocument[]>([
    {
      id: 'doc1',
      type: 'license',
      name: 'Business License 2024',
      file: null,
      url: '/docs/license.pdf',
      status: 'approved',
      uploadDate: '2024-01-10',
    },
    {
      id: 'doc2',
      type: 'insurance',
      name: 'Liability Insurance Certificate',
      file: null,
      url: '/docs/insurance.pdf',
      status: 'pending',
      uploadDate: '2024-01-12',
    }
  ]);

  const calculateVerificationStatus = useCallback((docs: VerificationDocument[]) => {
    const requiredTypes = ['license', 'insurance'];
    const approvedRequired = requiredTypes.filter(type => 
      docs.some(doc => doc.type === type && doc.status === 'approved')
    );
    
    if (approvedRequired.length === requiredTypes.length) {
      return 'verified' as const;
    }
    
    const hasRejected = docs.some(doc => doc.status === 'rejected');
    if (hasRejected) {
      return 'rejected' as const;
    }
    
    const hasPending = docs.some(doc => doc.status === 'pending');
    if (hasPending || approvedRequired.length > 0) {
      return 'partial' as const;
    }
    
    return 'pending' as const;
  }, []);

  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'partial' | 'verified' | 'rejected'>(
    calculateVerificationStatus(documents)
  );

  const uploadDocumentHandler = useCallback(async (type: string, file: File, name: string) => {
    setIsLoading(true);
    try {
      const result = await uploadDocument(file, type, name, 'current-provider-id');
      
      if (result.success && result.documentId) {
        const newDocument: VerificationDocument = {
          id: result.documentId,
          type: type as VerificationDocument['type'],
          name,
          file,
          url: result.url,
          status: 'pending',
          uploadDate: new Date().toISOString().split('T')[0],
        };
        
        setDocuments(prev => [...prev, newDocument]);
        
        toast({
          title: "Document Uploaded",
          description: `${name} has been uploaded successfully and is being reviewed.`,
        });
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload document. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const removeDocumentHandler = useCallback(async (documentId: string) => {
    try {
      await removeDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      
      toast({
        title: "Document Removed",
        description: "Document has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Remove Failed",
        description: "Failed to remove document. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const refreshVerificationStatus = useCallback(() => {
    const newStatus = calculateVerificationStatus(documents);
    setVerificationStatus(newStatus);
  }, [documents, calculateVerificationStatus]);

  // Update verification status when documents change
  React.useEffect(() => {
    refreshVerificationStatus();
  }, [documents, refreshVerificationStatus]);

  return {
    documents,
    verificationStatus,
    isLoading,
    uploadDocumentHandler,
    removeDocumentHandler,
    refreshVerificationStatus
  };
};
