export type Person = {
  id: string;
  name: string;
  role?: string;
  initials: string;
  /** soft tinted background for the fallback circle */
  tint: string;
  /** text color for the initials */
  ink: string;
  /** optional real photo — when omitted the fallback initials show */
  src?: string;
  /** presence dot, e.g. live collaborators */
  presence?: "live" | "idle" | "off";
};

export const TEAM: Person[] = [
  { id: "maya", name: "Maya Chen", role: "Product designer", initials: "MC", tint: "#fce7f3", ink: "#9d174d", src: "https://i.pravatar.cc/96?img=47" },
  { id: "leo", name: "Leo Okafor", role: "Frontend engineer", initials: "LO", tint: "#dbeafe", ink: "#1d4ed8", src: "https://i.pravatar.cc/96?img=12" },
  { id: "priya", name: "Priya Nair", role: "User researcher", initials: "PN", tint: "#ffedd5", ink: "#9a3412" },
  { id: "sam", name: "Sam Rivera", role: "Backend engineer", initials: "SR", tint: "#dcfce7", ink: "#166534", src: "https://i.pravatar.cc/96?img=33" },
  { id: "ana", name: "Ana Souza", role: "Motion designer", initials: "AS", tint: "#ede9fe", ink: "#5b21b6" },
  { id: "tom", name: "Tom Becker", role: "Engineering manager", initials: "TB", tint: "#fef9c3", ink: "#854d0e", src: "https://i.pravatar.cc/96?img=59" },
  { id: "jin", name: "Jin Park", role: "Data scientist", initials: "JP", tint: "#ccfbf1", ink: "#115e59" },
  { id: "zoe", name: "Zoe Adams", role: "Content strategist", initials: "ZA", tint: "#ffe4e6", ink: "#9f1239" },
  // broken photo on purpose — demonstrates the fallback path
  { id: "ray", name: "Ray Kumar", role: "Intern", initials: "RK", tint: "#e0e7ff", ink: "#3730a3", src: "https://invalid.example/broken.jpg" },
];

export function initialsFor(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
