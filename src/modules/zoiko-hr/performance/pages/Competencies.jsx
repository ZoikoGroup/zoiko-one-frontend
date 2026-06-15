import { useState } from "react";
import { Search, Plus, ChevronDown, ChevronRight, Award, BookOpen, Star, TrendingUp, Users } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import StatsCard from "../components/StatsCard";

const competencyData = [
  {
    category: "Technical Skills",
    items: [
      { name: "JavaScript/TypeScript", level: "Advanced", score: 85, trend: "up" },
      { name: "React.js", level: "Advanced", score: 90, trend: "up" },
      { name: "Node.js", level: "Intermediate", score: 65, trend: "up" },
      { name: "Python", level: "Intermediate", score: 60, trend: "stable" },
      { name: "Database Design", level: "Intermediate", score: 70, trend: "up" },
      { name: "AWS Cloud", level: "Beginner", score: 35, trend: "up" },
    ],
  },
  {
    category: "Soft Skills",
    items: [
      { name: "Communication", level: "Advanced", score: 88, trend: "up" },
      { name: "Leadership", level: "Intermediate", score: 72, trend: "up" },
      { name: "Problem Solving", level: "Advanced", score: 85, trend: "stable" },
      { name: "Team Collaboration", level: "Advanced", score: 90, trend: "up" },
      { name: "Time Management", level: "Intermediate", score: 75, trend: "up" },
    ],
  },
  {
    category: "Domain Knowledge",
    items: [
      { name: "HR Processes", level: "Expert", score: 95, trend: "up" },
      { name: "Compliance & Regulations", level: "Advanced", score: 82, trend: "stable" },
      { name: "Data Analysis", level: "Intermediate", score: 68, trend: "up" },
      { name: "Project Management", level: "Intermediate", score: 72, trend: "up" },
    ],
  },
  {
    category: "Tools & Platforms",
    items: [
      { name: "Git/GitHub", level: "Advanced", score: 88, trend: "up" },
      { name: "Docker/Kubernetes", level: "Beginner", score: 30, trend: "up" },
      { name: "CI/CD", level: "Intermediate", score: 55, trend: "stable" },
      { name: "Figma", level: "Beginner", score: 25, trend: "up" },
    ],
  },
];

const teamCompetencies = [
  { name: "Engineering", avgScore: 78, members: 24, topSkill: "React.js" },
  { name: "Design", avgScore: 85, members: 8, topSkill: "Figma" },
  { name: "Product", avgScore: 82, members: 6, topSkill: "Product Strategy" },
  { name: "Data", avgScore: 75, members: 5, topSkill: "SQL" },
  { name: "Marketing", avgScore: 70, members: 10, topSkill: "Content Strategy" },
];

export default function Competencies() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(competencyData.map((_, i) => i));

  const toggleCategory = (idx) => {
    setExpanded((prev) => prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Expert": return "bg-purple-100 text-purple-700";
      case "Advanced": return "bg-blue-100 text-blue-700";
      case "Intermediate": return "bg-yellow-100 text-yellow-700";
      case "Beginner": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Competencies</h1>
          <p className="text-sm text-gray-500 mt-1">Skill matrix and competency tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search skills..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            <Plus className="w-4 h-4" /> Add Competency
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Overall Score" value="72%" icon={Award} change={3} trend="up" />
        <StatsCard title="Competencies" value="19" icon={BookOpen} change={2} trend="up" />
        <StatsCard title="Skill Gap Areas" value="4" icon={TrendingUp} change={-1} trend="down" />
        <StatsCard title="Experts" value="3" icon={Star} change={1} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {competencyData.map((category, idx) => (
            <div key={category.category} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button onClick={() => toggleCategory(idx)} className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2">
                  {expanded.includes(idx) ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                  <h3 className="font-semibold text-gray-900">{category.category}</h3>
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{category.items.length}</span>
                </div>
              </button>
              {expanded.includes(idx) && (
                <div className="divide-y divide-gray-100">
                  {category.items
                    .filter((item) => !search || item.name.toLowerCase().includes(search.toLowerCase()))
                    .map((item) => (
                      <div key={item.name} className="flex items-center justify-between px-5 py-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getLevelColor(item.level)}`}>
                            {item.level}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 w-48">
                          <div className="flex-1 bg-gray-100 rounded-full h-2">
                            <div className={`h-2 rounded-full ${getScoreColor(item.score)}`} style={{ width: `${item.score}%` }} />
                          </div>
                          <span className="text-sm font-medium text-gray-700 w-8">{item.score}%</span>
                          {item.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" /> Team Scores
            </h3>
            <div className="space-y-4">
              {teamCompetencies.map((team) => (
                <div key={team.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{team.name}</span>
                    <span className="text-gray-500">{team.avgScore}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${team.avgScore}%` }} />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-400">{team.members} members</span>
                    <span className="text-xs text-gray-400">Top: {team.topSkill}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" /> Recommended Training
            </h3>
            <div className="space-y-3">
              {[
                { name: "AWS Solutions Architect", gap: "Cloud Platform", priority: "high" },
                { name: "Advanced Kubernetes", gap: "Containerization", priority: "medium" },
                { name: "Data Science Fundamentals", gap: "Data Analysis", priority: "medium" },
                { name: "UI/UX Design Principles", gap: "Design Tools", priority: "low" },
              ].map((training) => (
                <div key={training.name} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50">
                  <BookOpen className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{training.name}</p>
                    <p className="text-xs text-gray-500">Addresses: {training.gap}</p>
                    <StatusBadge status={training.priority} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
