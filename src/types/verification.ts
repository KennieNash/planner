
export interface VerificationDocument {
  id: string;
  type: 'license' | 'insurance' | 'certification' | 'portfolio';
  name: string;
  file: File | null;
  url?: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadDate: string;
  notes?: string;
}
