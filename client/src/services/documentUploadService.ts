
export interface DocumentUploadResult {
  success: boolean;
  documentId?: string;
  url?: string;
  error?: string;
}

export const uploadDocument = async (
  file: File,
  documentType: string,
  documentName: string,
  providerId: string
): Promise<DocumentUploadResult> => {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock validation
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    return {
      success: false,
      error: 'File size exceeds 10MB limit'
    };
  }

  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: 'Unsupported file type. Please upload PDF, JPG, PNG, DOC, or DOCX files.'
    };
  }

  // Simulate successful upload
  const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const mockUrl = URL.createObjectURL(file);
  
  console.log(`Document uploaded: ${documentName} (${documentType}) for provider ${providerId}`);
  
  return {
    success: true,
    documentId,
    url: mockUrl
  };
};

export const removeDocument = async (documentId: string): Promise<boolean> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`Document removed: ${documentId}`);
  return true;
};
