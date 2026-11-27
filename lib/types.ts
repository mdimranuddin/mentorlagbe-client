export type Tuition = {
  _id: string; title: string; subject: string; classLevel: string; mode: "Online" | "Offline";
  location: string; monthlyFee: number; daysPerWeek: number; description: string; bannerImage?: string;
  tutorName: string; tutorEmail: string; approvalStatus: "pending" | "approved" | "rejected";
  isActive: boolean; createdAt: string; tutorVerified?: boolean;
  tutor?: { name: string; image: string; bio: string; verified: boolean };
};
export type Application = {
  _id: string; tuitionId: string; tuitionTitle: string; subject: string; monthlyFee: number;
  tutorEmail: string; tutorName?: string; studentName: string; studentEmail: string; studentPhone: string;
  preferredSchedule: string; studentNote: string; studentPlan?: string;
  status: "pending" | "accepted" | "rejected"; appliedAt: string;
};
export type AppUser = {
  _id: string; name: string; email: string; image?: string; role: "student" | "tutor" | "admin";
  plan?: string; phone?: string; bio?: string; createdAt?: string;
};
