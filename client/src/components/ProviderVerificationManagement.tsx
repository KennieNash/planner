
import React from 'react';
import { Upload, FileText, Shield, Award } from 'lucide-react';
import { useVerificationManagement } from '@/hooks/useVerificationManagement';
import VerificationProgress from './VerificationProgress';
import VerificationStatusCard from './VerificationStatusCard';
import DocumentUploadCard from './DocumentUploadCard';
import VerificationTips from './VerificationTips';

const ProviderVerificationManagement = () => {
  const {
    documents,
    verificationStatus,
    isLoading,
    uploadDocumentHandler,
    removeDocumentHandler
  } = useVerificationManagement();

  const documentTypes = [
    {
      type: 'license',
      title: 'Business License',
      description: 'Upload your business license or registration documents',
      icon: FileText,
      color: 'text-blue-400',
      required: true
    },
    {
      type: 'insurance',
      title: 'Insurance Certificate',
      description: 'Liability insurance certificate or policy documents',
      icon: Shield,
      color: 'text-green-400',
      required: true
    },
    {
      type: 'certification',
      title: 'Professional Certifications',
      description: 'Industry certifications, training certificates, etc.',
      icon: Award,
      color: 'text-purple-400',
      required: false
    },
    {
      type: 'portfolio',
      title: 'Portfolio/Previous Work',
      description: 'Photos of completed projects and work samples',
      icon: Upload,
      color: 'text-orange-400',
      required: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Verification Progress */}
      <VerificationProgress 
        documents={documents}
        verificationStatus={verificationStatus}
      />

      {/* Verification Status Overview */}
      <VerificationStatusCard verificationStatus={verificationStatus} />

      {/* Document Upload Sections */}
      {documentTypes.map((docType) => (
        <DocumentUploadCard
          key={docType.type}
          documentType={docType}
          documents={documents}
          onDocumentUpload={uploadDocumentHandler}
          onDocumentRemove={removeDocumentHandler}
          isUploading={isLoading}
        />
      ))}

      {/* Verification Tips */}
      <VerificationTips />
    </div>
  );
};

export default ProviderVerificationManagement;
