export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: "Active" | "Closed" | "Draft";
  applicantsCount: number;
  datePosted: string;
  description: string;
  requirements: string[];
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobId: string;
  jobTitle: string;
  stage: "Applied" | "Phone Screen" | "Technical" | "Executive" | "Offer" | "Hired" | "Rejected";
  dateApplied: string;
  resumeName: string;
  rating: number;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  interviewer: string;
  date: string;
  time: string;
  format: "Video Call" | "Phone Call" | "In-Person";
  status: "Scheduled" | "Completed" | "Cancelled";
}

export interface Offer {
  id: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  salary: string;
  startDate: string;
  status: "Draft" | "Sent" | "Accepted" | "Declined";
}

export interface TalentProfile {
  id: string;
  name: string;
  email: string;
  currentRole: string;
  skills: string[];
  experienceYears: number;
  source: string;
}

export interface Referral {
  id: string;
  candidateName: string;
  email: string;
  jobTitle: string;
  referrerName: string;
  status: "In Review" | "Interviewing" | "Hired" | "Rejected";
  rewardAmount: string;
  rewardStatus: "Pending" | "Paid" | "None";
}

export const initialJobs: Job[] = [
  {
    id: "job-1",
    title: "Lead React Developer",
    department: "Engineering",
    location: "London, UK (Hybrid)",
    type: "Full-Time",
    status: "Active",
    applicantsCount: 48,
    datePosted: "2026-06-01",
    description: "We are seeking a Lead React Developer to architect and deliver premium frontend solutions for our Next.js platforms.",
    requirements: ["5+ years React experience", "Deep knowledge of Next.js", "Strong styling with Tailwind CSS"]
  },
  {
    id: "job-2",
    title: "Senior Product Manager",
    department: "Product",
    location: "New York, USA (Remote)",
    type: "Full-Time",
    status: "Active",
    applicantsCount: 32,
    datePosted: "2026-06-03",
    description: "Looking for an experienced PM to direct the vision of our compliance and billing pipelines.",
    requirements: ["4+ years Product Management", "Experience in SaaS/FinTech", "Data-driven mindset"]
  },
  {
    id: "job-3",
    title: "UX/UI Designer",
    department: "Design",
    location: "London, UK (Onsite)",
    type: "Full-Time",
    status: "Draft",
    applicantsCount: 0,
    datePosted: "2026-06-07",
    description: "Design stunning UI/UX layouts, wireframes, and design systems for enterprise web applications.",
    requirements: ["Portfolio of web applications", "Expert in Figma", "Experience in motion design and animations"]
  },
  {
    id: "job-4",
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Contract",
    status: "Active",
    applicantsCount: 15,
    datePosted: "2026-05-28",
    description: "Manage AWS cloud infrastructure, Docker, Kubernetes, and CI/CD automation pipelines.",
    requirements: ["Deep AWS experience", "Kubernetes orchestration", "Infrastructure as Code (Terraform)"]
  }
];

export const initialCandidates: Candidate[] = [
  {
    id: "cand-1",
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    phone: "+44 7700 900077",
    jobId: "job-1",
    jobTitle: "Lead React Developer",
    stage: "Technical",
    dateApplied: "2026-06-05",
    resumeName: "Sarah_Jenkins_CV.pdf",
    rating: 5
  },
  {
    id: "cand-2",
    name: "Alex Rivera",
    email: "alex.rivera@example.com",
    phone: "+1 555-0199",
    jobId: "job-2",
    jobTitle: "Senior Product Manager",
    stage: "Offer",
    dateApplied: "2026-06-03",
    resumeName: "Alex_Rivera_Resume.pdf",
    rating: 4
  },
  {
    id: "cand-3",
    name: "Michael Chang",
    email: "m.chang@example.com",
    phone: "+44 7700 900088",
    jobId: "job-1",
    jobTitle: "Lead React Developer",
    stage: "Phone Screen",
    dateApplied: "2026-06-01",
    resumeName: "Michael_Chang_Bio.pdf",
    rating: 3
  },
  {
    id: "cand-4",
    name: "David Miller",
    email: "david.miller@example.com",
    phone: "+1 555-0143",
    jobId: "job-1",
    jobTitle: "Lead React Developer",
    stage: "Applied",
    dateApplied: "2026-06-07",
    resumeName: "David_Miller_Developer.pdf",
    rating: 4
  },
  {
    id: "cand-5",
    name: "Emma Watson",
    email: "emma.watson@example.com",
    phone: "+1 555-0185",
    jobId: "job-2",
    jobTitle: "Senior Product Manager",
    stage: "Rejected",
    dateApplied: "2026-05-25",
    resumeName: "Emma_Watson_Product.pdf",
    rating: 2
  }
];

export const initialInterviews: Interview[] = [
  {
    id: "int-1",
    candidateId: "cand-1",
    candidateName: "Sarah Jenkins",
    jobTitle: "Lead React Developer",
    interviewer: "Robert (Lead Architect)",
    date: "2026-06-09",
    time: "14:00 - 15:00",
    format: "Video Call",
    status: "Scheduled"
  },
  {
    id: "int-2",
    candidateId: "cand-3",
    candidateName: "Michael Chang",
    jobTitle: "Lead React Developer",
    interviewer: "Amanda (HR Generalist)",
    date: "2026-06-10",
    time: "10:00 - 10:30",
    format: "Phone Call",
    status: "Scheduled"
  }
];

export const initialOffers: Offer[] = [
  {
    id: "off-1",
    candidateId: "cand-2",
    candidateName: "Alex Rivera",
    jobTitle: "Senior Product Manager",
    salary: "$135,000 / year",
    startDate: "2026-07-01",
    status: "Sent"
  }
];

export const initialTalentPool: TalentProfile[] = [
  {
    id: "talent-1",
    name: "Rebecca Finch",
    email: "r.finch@example.com",
    currentRole: "Senior Engineer",
    skills: ["React", "NodeJS", "AWS", "TypeScript"],
    experienceYears: 8,
    source: "LinkedIn"
  },
  {
    id: "talent-2",
    name: "Jonathan Cross",
    email: "j.cross@example.com",
    currentRole: "Product Manager",
    skills: ["APIs", "Agile", "SQL", "Billing Systems"],
    experienceYears: 6,
    source: "Referral"
  },
  {
    id: "talent-3",
    name: "Elena Rostova",
    email: "elena.r@example.com",
    currentRole: "UI/UX Designer",
    skills: ["Figma", "Design Systems", "Web Design", "CSS"],
    experienceYears: 5,
    source: "Careers Page"
  }
];

export const initialReferrals: Referral[] = [
  {
    id: "ref-1",
    candidateName: "Jane Doe",
    email: "jane.doe@example.com",
    jobTitle: "UX/UI Designer",
    referrerName: "Alice Johnson",
    status: "Hired",
    rewardAmount: "$1,500",
    rewardStatus: "Paid"
  },
  {
    id: "ref-2",
    candidateName: "Marcus Vance",
    email: "marcus.v@example.com",
    jobTitle: "DevOps Engineer",
    referrerName: "Bob Williams",
    status: "Interviewing",
    rewardAmount: "$500",
    rewardStatus: "Pending"
  }
];
