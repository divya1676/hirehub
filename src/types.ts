export type UserRole = 'candidate' | 'recruiter';

export interface UserProfile {
  id: string;
  role: UserRole;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: any;
}

export interface CandidateProfile {
  userId: string;
  bio: string;
  skills: string[];
  experience: number;
  resumeUrl: string;
  portfolioUrl?: string;
  updatedAt: any;
}

export interface RecruiterProfile {
  userId: string;
  company: string;
  website?: string;
  bio?: string;
}

export type ApplicationStatus = 'pending' | 'reviewed' | 'interviewing' | 'accepted' | 'rejected';

export interface Application {
  id: string;
  candidateId: string;
  recruiterId: string;
  status: ApplicationStatus;
  createdAt: any;
  feedback?: string;
}

export type InterviewStatus = 'scheduled' | 'cancelled' | 'completed';

export interface Interview {
  id: string;
  applicationId: string;
  candidateId: string;
  recruiterId: string;
  scheduledAt: any;
  status: InterviewStatus;
  location: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  type: string;
  createdAt: any;
  relatedId?: string;
}
