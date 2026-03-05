import { getProfile } from "@/server-actions/profile/get-profile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { ProfileContent } from "./ProfileContent";

interface ProfilePageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { id } = await params;
  const [user, session] = await Promise.all([
    getProfile(id),
    getServerSession(authOptions),
  ]);
  if (!user) notFound();

  const isOwnProfile = session?.user?.id === id;

  return (
    <div className="pt-32">
      <ProfileContent user={user} isOwnProfile={isOwnProfile} />
    </div>
  );
};

export default ProfilePage;
