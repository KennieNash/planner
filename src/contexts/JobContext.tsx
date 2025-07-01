
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNotifications } from './NotificationContext';

export interface Job {
  id: string;
  serviceRequestId: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerEmail: string;
  serviceType: string;
  description: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate?: string;
  scheduledTime?: string;
  estimatedDuration?: number; // in hours
  location: {
    address: string;
    city: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
  pricing: {
    estimatedCost?: number;
    finalCost?: number;
    hourlyRate?: number;
    materialCosts?: number;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  images?: string[];
  materials?: Array<{ name: string; cost: number; quantity: number }>;
}

interface JobContextType {
  jobs: Job[];
  activeJobs: Job[];
  pendingJobs: Job[];
  completedJobs: Job[];
  updateJobStatus: (jobId: string, status: Job['status'], notes?: string) => void;
  updateJobSchedule: (jobId: string, date: string, time: string) => void;
  updateJobPricing: (jobId: string, pricing: Partial<Job['pricing']>) => void;
  addJobNotes: (jobId: string, notes: string) => void;
  acceptJob: (jobId: string) => void;
  completeJob: (jobId: string, finalCost: number, notes?: string) => void;
  cancelJob: (jobId: string, reason: string) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

export const JobProvider = ({ children }: { children: React.ReactNode }) => {
  const { addNotification } = useNotifications();
  
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      serviceRequestId: 'req-1',
      customerId: 'cust-1',
      customerName: 'John Smith',
      customerPhone: '+1 (555) 123-4567',
      customerEmail: 'john.smith@email.com',
      serviceType: 'Emergency Plumbing Repair',
      description: 'Burst pipe in basement causing flooding. Need immediate repair.',
      status: 'pending',
      priority: 'urgent',
      location: {
        address: '123 Main St',
        city: 'Seattle',
        zipCode: '98101'
      },
      pricing: {
        estimatedCost: 350,
        hourlyRate: 85
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      serviceRequestId: 'req-2',
      customerId: 'cust-2',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.j@email.com',
      serviceType: 'Drain Cleaning',
      description: 'Kitchen sink draining very slowly, probably clogged.',
      status: 'accepted',
      priority: 'medium',
      scheduledDate: '2024-01-18',
      scheduledTime: '10:00',
      estimatedDuration: 2,
      location: {
        address: '456 Oak Ave',
        city: 'Seattle',
        zipCode: '98102'
      },
      pricing: {
        estimatedCost: 150,
        hourlyRate: 75
      },
      notes: 'Customer mentioned this has been ongoing for 2 weeks',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      serviceRequestId: 'req-3',
      customerId: 'cust-3',
      customerName: 'Mike Wilson',
      customerPhone: '+1 (555) 987-6543',
      customerEmail: 'mike.wilson@email.com',
      serviceType: 'Bathroom Renovation',
      description: 'Complete bathroom remodel including new tiles, fixtures, and plumbing.',
      status: 'in_progress',
      priority: 'low',
      scheduledDate: '2024-01-15',
      scheduledTime: '08:00',
      estimatedDuration: 40,
      location: {
        address: '789 Pine St',
        city: 'Seattle',
        zipCode: '98103'
      },
      pricing: {
        estimatedCost: 4500,
        hourlyRate: 90,
        materialCosts: 2800
      },
      notes: 'Phase 1: Demolition completed. Phase 2: Plumbing rough-in in progress.',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  const updateJobStatus = useCallback((jobId: string, status: Job['status'], notes?: string) => {
    setJobs(prev => 
      prev.map(job => {
        if (job.id === jobId) {
          const updatedJob = {
            ...job,
            status,
            updatedAt: new Date().toISOString(),
            ...(notes && { notes: job.notes ? `${job.notes}\n${notes}` : notes }),
            ...(status === 'completed' && { completedAt: new Date().toISOString() })
          };

          // Send notification
          addNotification({
            type: 'service',
            title: 'Job Status Updated',
            message: `${job.serviceType} for ${job.customerName} is now ${status}`,
            priority: 'medium'
          });

          return updatedJob;
        }
        return job;
      })
    );
  }, [addNotification]);

  const updateJobSchedule = useCallback((jobId: string, date: string, time: string) => {
    setJobs(prev =>
      prev.map(job =>
        job.id === jobId
          ? {
              ...job,
              scheduledDate: date,
              scheduledTime: time,
              updatedAt: new Date().toISOString()
            }
          : job
      )
    );
  }, []);

  const updateJobPricing = useCallback((jobId: string, pricing: Partial<Job['pricing']>) => {
    setJobs(prev =>
      prev.map(job =>
        job.id === jobId
          ? {
              ...job,
              pricing: { ...job.pricing, ...pricing },
              updatedAt: new Date().toISOString()
            }
          : job
      )
    );
  }, []);

  const addJobNotes = useCallback((jobId: string, notes: string) => {
    setJobs(prev =>
      prev.map(job =>
        job.id === jobId
          ? {
              ...job,
              notes: job.notes ? `${job.notes}\n${notes}` : notes,
              updatedAt: new Date().toISOString()
            }
          : job
      )
    );
  }, []);

  const acceptJob = useCallback((jobId: string) => {
    updateJobStatus(jobId, 'accepted', 'Job accepted by provider');
  }, [updateJobStatus]);

  const completeJob = useCallback((jobId: string, finalCost: number, notes?: string) => {
    setJobs(prev =>
      prev.map(job =>
        job.id === jobId
          ? {
              ...job,
              status: 'completed' as const,
              pricing: { ...job.pricing, finalCost },
              notes: notes ? (job.notes ? `${job.notes}\n${notes}` : notes) : job.notes,
              completedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          : job
      )
    );

    addNotification({
      type: 'service',
      title: 'Job Completed',
      message: `Successfully completed job for $${finalCost}`,
      priority: 'medium'
    });
  }, [addNotification]);

  const cancelJob = useCallback((jobId: string, reason: string) => {
    updateJobStatus(jobId, 'cancelled', `Cancelled: ${reason}`);
  }, [updateJobStatus]);

  const activeJobs = jobs.filter(job => ['accepted', 'in_progress'].includes(job.status));
  const pendingJobs = jobs.filter(job => job.status === 'pending');
  const completedJobs = jobs.filter(job => job.status === 'completed');

  return (
    <JobContext.Provider
      value={{
        jobs,
        activeJobs,
        pendingJobs,
        completedJobs,
        updateJobStatus,
        updateJobSchedule,
        updateJobPricing,
        addJobNotes,
        acceptJob,
        completeJob,
        cancelJob
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
