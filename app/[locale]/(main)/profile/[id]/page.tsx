import type { Metadata } from "next"
import { getProfile } from "@/server-actions/profile/get-profile"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { notFound } from "next/navigation"
import { ProfileContent } from "./ProfileContent"

interface ProfilePageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

export const generateMetadata = async ({ params }: ProfilePageProps): Promise<Metadata> => {
  const { id } = await params
  const user = await getProfile(id)

  if (!user) return { title: "Profile not found" }

  const name = user.name || user.student?.name || "Dancer"
  const classes = user.student?._count.attendances ?? 0
  const description = `Check out ${name}'s dance profile on Salsa Rayo! ${classes} classes attended. Join me and try to beat my stats!`

  return {
    title: `${name} | Salsa Rayo`,
    description,
    openGraph: {
      title: `${name} | Salsa Rayo`,
      description,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | Salsa Rayo`,
      description,
    },
  }
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { id } = await params
  const [user, session] = await Promise.all([
    getProfile(id),
    getServerSession(authOptions),
  ])
  if (!user) notFound()

  const isOwnProfile = session?.user?.id === id

  return (
    <div className="pt-32">
      <ProfileContent user={user} isOwnProfile={isOwnProfile} />
    </div>
  )
}

export default ProfilePage
