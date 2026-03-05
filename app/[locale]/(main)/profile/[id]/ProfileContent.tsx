import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoCalendar, IoFlame, IoFlash } from "react-icons/io5";
import type { getProfile } from "@/server-actions/profile/get-profile";

type User = NonNullable<Awaited<ReturnType<typeof getProfile>>>;

interface ProfileContentProps {
  user: User;
}

export const ProfileContent = ({ user }: ProfileContentProps) => {
  const fullName = user.name || user.student?.name || "Dancer";
  const userInitials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const student = user.student;
  const totalClasses = student?._count.attendances ?? 0;

  const stats = student
    ? [
        {
          icon: <IoFlash size={24} className="text-yellow-500" />,
          value: student.rayoPoints,
          label: "Points",
          accentColor: "border-t-yellow-500",
          glowColor: "bg-yellow-500/10",
        },
        {
          icon: <IoFlame size={24} className="text-orange-500" />,
          value: totalClasses,
          label: "Classes",
          accentColor: "border-t-orange-500",
          glowColor: "bg-orange-500/10",
        },
        {
          icon: <IoCalendar size={24} className="text-primary" />,
          value: new Date(student.createdAt).toLocaleDateString(undefined, {
            month: "short",
            year: "numeric",
          }),
          label: "Joined",
          accentColor: "border-t-primary",
          glowColor: "bg-primary/10",
        },
      ]
    : [];

  return (
    <div className="flex flex-col items-center gap-10 px-4 pb-16">
      <Avatar className="size-36 ring-4 ring-primary/40 ring-offset-4 ring-offset-background shadow-lg shadow-primary/20">
        {user.image && <AvatarImage src={user.image} alt={fullName} />}
        <AvatarFallback className="text-5xl">{userInitials}</AvatarFallback>
      </Avatar>

      <h1 className="text-4xl font-bold">{fullName}</h1>

      {stats.length > 0 && (
        <div className="flex items-stretch gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      )}
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  accentColor: string;
  glowColor: string;
}

const StatCard = ({ icon, value, label, accentColor, glowColor }: StatCardProps) => (
  <div
    className={`flex w-32 flex-col items-center gap-3 rounded-xl border border-border/50 border-t-2 bg-card px-6 py-5 ${accentColor}`}
  >
    <div className={`flex size-10 items-center justify-center rounded-full ${glowColor}`}>
      {icon}
    </div>
    <span className="text-xl font-bold">{value}</span>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);
