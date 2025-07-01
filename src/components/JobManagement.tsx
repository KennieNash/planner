
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useJobs } from '@/contexts/JobContext';
import JobCard from './JobCard';
import JobDetailsModal from './JobDetailsModal';

const JobManagement = () => {
  const { jobs, activeJobs, pendingJobs, completedJobs } = useJobs();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500 hover:bg-red-600';
      case 'high':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'low':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'accepted':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in_progress':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/10">
          <TabsTrigger value="pending" className="text-white data-[state=active]:bg-blue-500">
            Pending ({pendingJobs.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="text-white data-[state=active]:bg-blue-500">
            Active ({activeJobs.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-white data-[state=active]:bg-blue-500">
            Completed ({completedJobs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <div className="grid gap-4">
            {pendingJobs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No pending jobs</p>
              </div>
            ) : (
              pendingJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onViewDetails={setSelectedJob}
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <div className="grid gap-4">
            {activeJobs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No active jobs</p>
              </div>
            ) : (
              activeJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onViewDetails={setSelectedJob}
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid gap-4">
            {completedJobs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No completed jobs</p>
              </div>
            ) : (
              completedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onViewDetails={setSelectedJob}
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {selectedJob && (
        <JobDetailsModal
          jobId={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};

export default JobManagement;
