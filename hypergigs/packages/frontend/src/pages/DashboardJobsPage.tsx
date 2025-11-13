import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DashboardLayout from '@/components/DashboardLayout';
import JobPostingCard from '@/components/JobPostingCard';
import JobPostingDialog from '@/components/JobPostingDialog';
import { jobService } from '@/services/api/job.service';
import { teamService } from '@/services/api/team.service';
import { useAuthStore } from '@/stores/authStore';
import type { JobPosting, JobType } from '@/types/job';
import type { Team } from '@/types/team';
import { JOB_TYPE_LABELS } from '@/types/job';
import { useToast } from '@/hooks/use-toast';

export default function DashboardJobsPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const { toast } = useToast();

  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownedTeams, setOwnedTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('ALL');
  const [jobType, setJobType] = useState<JobType | 'ALL'>('ALL');
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | undefined>(undefined);

  // Load user's owned teams
  useEffect(() => {
    loadOwnedTeams();
  }, []);

  // Load jobs when filters change
  useEffect(() => {
    fetchJobs();
  }, [selectedTeamId, jobType]);

  const loadOwnedTeams = async () => {
    try {
      const teams = await teamService.getMyTeams();
      // Filter to only owned teams (where user is OWNER)
      const owned = teams.filter(
        (t: any) => t.role === 'OWNER' || t.ownerId === currentUser?.id
      );
      setOwnedTeams(owned);
    } catch (error) {
      console.error('Failed to load teams:', error);
    }
  };

  const fetchJobs = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const filters: any = {
        limit: 100,
      };

      // Filter by team if selected
      if (selectedTeamId !== 'ALL') {
        filters.teamId = selectedTeamId;
      }

      // Filter by job type
      if (jobType !== 'ALL') {
        filters.type = jobType;
      }

      const data = await jobService.getActiveJobs(filters);

      // Filter to only show jobs created by current user
      const myJobs = data.jobs.filter((job: JobPosting) => job.createdBy === currentUser.id);
      setJobs(myJobs);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load job postings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleEditJob = (job: JobPosting) => {
    setSelectedJob(job);
    setShowJobDialog(true);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) {
      return;
    }

    try {
      await jobService.deleteJobPosting(jobId);
      toast({
        title: 'Success',
        description: 'Job posting deleted successfully',
      });
      fetchJobs(); // Reload jobs
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete job posting',
        variant: 'destructive',
      });
    }
  };

  const handleCreateJob = () => {
    if (ownedTeams.length === 0) {
      toast({
        title: 'No Teams',
        description: 'You need to create a team before posting a job',
        variant: 'destructive',
      });
      navigate('/dashboard/teams');
      return;
    }
    setSelectedJob(undefined);
    setShowJobDialog(true);
  };

  const handleJobDialogClose = (success?: boolean) => {
    setShowJobDialog(false);
    setSelectedJob(undefined);
    if (success) {
      fetchJobs(); // Reload jobs after create/update
    }
  };

  const canManageJob = (job: JobPosting) => {
    // User can manage if they created the job
    return job.createdBy === currentUser?.id;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Briefcase className="w-8 h-8" />
              Job Postings ({jobs.length})
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage all your job postings across teams
            </p>
          </div>
          <Button onClick={handleCreateJob} className="gap-2">
            <Plus className="w-4 h-4" />
            Post a Job
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center bg-card p-4 rounded-lg border">
          <div className="flex-1">
            <Select
              value={selectedTeamId}
              onValueChange={setSelectedTeamId}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Teams" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Teams</SelectItem>
                {ownedTeams.map((team: any) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Select
              value={jobType}
              onValueChange={(value) => setJobType(value as JobType | 'ALL')}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading jobs...</p>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border">
            <Briefcase className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-semibold">No job postings yet</h3>
            <p className="text-muted-foreground mt-2">
              Create your first job posting to start hiring
            </p>
            <Button onClick={handleCreateJob} className="mt-4 gap-2">
              <Plus className="w-4 h-4" />
              Post a Job
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <JobPostingCard
                key={job.id}
                job={job}
                canManage={canManageJob(job)}
                onView={() => handleViewJob(job.id)}
                onEdit={() => handleEditJob(job)}
                onDelete={() => handleDeleteJob(job.id)}
              />
            ))}
          </div>
        )}

        {/* Job Dialog */}
        {showJobDialog && (
          <JobPostingDialog
            open={showJobDialog}
            onOpenChange={handleJobDialogClose}
            job={selectedJob}
            teamId={selectedTeamId !== 'ALL' ? selectedTeamId : ownedTeams[0]?.id}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
