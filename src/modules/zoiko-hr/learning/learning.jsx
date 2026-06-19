import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HRPage from "../../../components/HRPage";

import LearningDashboard from "./dashboard.jsx";
import LearningCourses from "./courses.jsx";
import LearningPaths from "./learning-paths.jsx";
import LearningEnrollments from "./enrollments.jsx";
import LearningCertifications from "./certifications.jsx";
import LearningSkillMatrix from "./skill-matrix.jsx";
import LearningAssessments from "./assessments.jsx";
import LearningTrainingPrograms from "./training-programs.jsx";
import LearningCalendar from "./calendar.jsx";
import LearningProgress from "./progress.jsx";
import LearningReports from "./reports.jsx";

const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "courses", label: "Courses" },
  { key: "paths", label: "Learning Paths" },
  { key: "enrollments", label: "Enrollments" },
  { key: "certifications", label: "Certifications" },
  { key: "skills", label: "Skill Matrix" },
  { key: "assessments", label: "Assessments" },
  { key: "training-programs", label: "Training Programs" },
  { key: "calendar", label: "Calendar" },
  { key: "progress", label: "Progress" },
  { key: "reports", label: "Reports" },
];

export default function Learning() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    // location.pathname is typically "/zoiko-hr/learning/courses" -> parts: ["zoiko-hr", "learning", "courses"]
    return parts[2] || "dashboard";
  }, [location.pathname]);

  const handleTabChange = (key) => {
    if (key === "dashboard") {
      navigate("/zoiko-hr/learning");
    } else {
      navigate(`/zoiko-hr/learning/${key}`);
    }
  };

  return (
    <HRPage title="Learning & Development" subtitle="Course catalog, paths, enrollments, certifications, assessments, skills, and programs.">


      <div className="mt-4">
        {activeTab === "dashboard" && <LearningDashboard isTab={true} />}
        {activeTab === "courses" && <LearningCourses isTab={true} />}
        {activeTab === "paths" && <LearningPaths isTab={true} />}
        {activeTab === "enrollments" && <LearningEnrollments isTab={true} />}
        {activeTab === "certifications" && <LearningCertifications isTab={true} />}
        {activeTab === "skills" && <LearningSkillMatrix isTab={true} />}
        {activeTab === "assessments" && <LearningAssessments isTab={true} />}
        {activeTab === "training-programs" && <LearningTrainingPrograms isTab={true} />}
        {activeTab === "calendar" && <LearningCalendar isTab={true} />}
        {activeTab === "progress" && <LearningProgress isTab={true} />}
        {activeTab === "reports" && <LearningReports isTab={true} />}
      </div>
    </HRPage>
  );
}
