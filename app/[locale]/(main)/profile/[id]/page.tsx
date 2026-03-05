import { getProfile } from "@/server-actions/profile/get-profile";
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
  const user = await getProfile(id);
  if (!user) notFound();

  return (
    <div className="pt-32">
      <ProfileContent user={user} />
    </div>
  );
};

export default ProfilePage;
