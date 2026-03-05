import { ImageResponse } from "next/og"
import { readFile } from "fs/promises"
import { join } from "path"
import { prisma } from "@/lib/db"
import { compactFormatter, getInitials } from "@/lib/format"

export const runtime = "nodejs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const loadLogo = async () => {
  try {
    const data = await readFile(join(process.cwd(), "public/images/logo.png"))
    return `data:image/png;base64,${data.toString("base64")}`
  } catch {
    return null
  }
}

const OGImage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const [user, logoSrc] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      select: {
        name: true,
        image: true,
        student: {
          select: {
            name: true,
            rayoPoints: true,
            createdAt: true,
            _count: { select: { attendances: true } },
          },
        },
      },
    }),
    loadLogo(),
  ])

  if (!user) {
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f0a1a",
          color: "white",
          fontSize: 48,
        }}
      >
        User not found
      </div>,
      { ...size }
    )
  }

  const fullName = user.name || user.student?.name || "Dancer"
  const initials = getInitials(fullName)
  const student = user.student
  const totalClasses = student?._count.attendances ?? 0
  const memberSince = student
    ? new Date(student.createdAt).toLocaleDateString("en", {
        month: "short",
        year: "numeric",
      })
    : null

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, #0f0a1a 0%, #1a1030 40%, #120e22 100%)",
        color: "white",
        position: "relative",
      }}
    >
      {/* Subtle gradient orb behind avatar */}
      <div
        style={{
          position: "absolute",
          top: 100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(91,79,219,0.15) 0%, transparent 70%)",
          display: "flex",
        }}
      />

      {/* Logo top-left */}
      <div
        style={{
          position: "absolute",
          top: 32,
          left: 40,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {logoSrc && <img src={logoSrc} width={36} height={36} />}
        <span style={{ fontSize: 18, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>
          Salsa Rayo
        </span>
      </div>

      {/* Avatar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 148,
          height: 148,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #5b4fdb, #e84393)",
          padding: 4,
        }}
      >
        {user.image ? (
          <img
            src={user.image}
            width={140}
            height={140}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: "#1a1030",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              fontWeight: 700,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Name + rayo points */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginTop: 28,
        }}
      >
        <span style={{ fontSize: 44, fontWeight: 700 }}>{fullName}</span>
        {student && student.rayoPoints > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#facc15",
              fontSize: 28,
              fontWeight: 600,
            }}
          >
            <span>⚡</span>
            <span>{compactFormatter.format(student.rayoPoints)}</span>
          </div>
        )}
      </div>

      {/* Stats row */}
      {student && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            marginTop: 24,
            fontSize: 22,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#fb923c" }}>🔥</span>
            <span style={{ color: "white", fontWeight: 600 }}>{totalClasses}</span>
            <span>{totalClasses === 1 ? "class" : "classes"}</span>
          </div>
          {memberSince && (
            <>
              <div
                style={{
                  width: 1,
                  height: 22,
                  background: "rgba(255,255,255,0.15)",
                  display: "flex",
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>📅</span>
                <span>Since {memberSince}</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #5b4fdb, #e84393, #5b4fdb)",
          display: "flex",
        }}
      />
    </div>,
    { ...size }
  )
}

export default OGImage
