
import { useState, useEffect } from 'react';

interface VerificationDocument {
  id: string;
  type: 'license' | 'insurance' | 'certification' | 'portfolio';
  name: string;
  file: File | null;
  url?: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadDate: string;
  notes?: string;
}

interface VerificationItem {
  id: string;
  providerId: string;
  providerName: string;
  documentType: string;
  documentName: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  documentUrl: string;
  notes?: string;
}

export const useVerificationData = () => {
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'partial' | 'verified' | 'rejected'>('partial');
  const [documents, setDocuments] = useState<VerificationDocument[]>([
    {
      id: '1',
      type: 'license',
      name: 'Business License 2024',
      file: null,
      url: '/documents/license.pdf',
      status: 'approved',
      uploadDate: '2024-01-15',
      notes: 'Valid until 2025'
    },
    {
      id: '2',
      type: 'insurance',
      name: 'Liability Insurance Certificate',
      file: null,
      url: '/documents/insurance.pdf',
      status: 'pending',
      uploadDate: '2024-01-20'
    }
  ]);
  
  const [verificationQueue, setVerificationQueue] = useState<VerificationItem[]>([
    {
      id: '1',
      providerId: 'provider1',
      providerName: 'John\'s Plumbing Services',
      documentType: 'license',
      documentName: 'Business License 2024',
      uploadDate: '2024-01-20',
      status: 'pending',
      documentUrl: '/documents/license.pdf'
    },
    {
      id: '2',
      providerId: 'provider2',
      providerName: 'Electric Solutions Pro',
      documentType: 'insurance',
      documentName: 'Liability Insurance Certificate',
      uploadDate: '2024-01-19',
      status: 'pending',
      documentUrl: '/documents/insurance.pdf'
    }
  ]);

  const uploadDocument = async (type: string, file: File, name: string) => {
    // Simulate file upload
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newDocument: VerificationDocument = {
          id: Date.now().toString(),
          type: type as 'license' | 'insurance' | 'certification' | 'portfolio',
          name,
          file,
          status: 'pending',
          uploadDate: new Date().toISOString().split('T')[0]
        };
        
        setDocuments(prev => [...prev, newDocument]);
        resolve();
      }, 1000);
    });
  };

  const removeDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const approveDocument = (itemId: string, notes?: string) => {
    setVerificationQueue(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, status: 'approved' as const, notes }
          : item
      )
    );
  };

  const rejectDocument = (itemId: string, reason: string) => {
    setVerificationQueue(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, status: 'rejected' as const, notes: reason }
          : item
      )
    );
  };

  const requestMoreInfo = (itemId: string, message: string) => {
    console.log(`Requesting more info for ${itemId}: ${message}`);
    // In a real app, this would send a message to the provider
  };

  // Update verification status based on document statuses
  useEffect(() => {
    const approvedCount = documents.filter(doc => doc.status === 'approved').length;
    const rejectedCount = documents.filter(doc => doc.status === 'rejected').length;
    const pendingCount = documents.filter(doc => doc.status === 'pending').length;
    
    if (rejectedCount > 0) {
      setVerificationStatus('rejected');
    } else if (approvedCount >= 2) { // Assuming 2 required documents
      setVerificationStatus('verified');
    } else if (approvedCount > 0 || pendingCount > 0) {
      setVerificationStatus('partial');
    } else {
      setVerificationStatus('pending');
    }
  }, [documents]);

  return {
    verificationStatus,
    documents,
    verificationQueue,
    uploadDocument,
    removeDocument,
    approveDocument,
    rejectDocument,
    requestMoreInfo
  };
};
