import { ImageResponse } from "next/og";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const OGImage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const user = await prisma.user.findUnique({
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
  });

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
    );
  }

  const fullName = user.name || user.student?.name || "Dancer";
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const student = user.student;
  const totalClasses = student?._count.attendances ?? 0;
  const memberSince = student
    ? new Date(student.createdAt).toLocaleDateString("en", {
        month: "short",
        year: "numeric",
      })
    : null;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f0a1a 0%, #1a1030 50%, #0f0a1a 100%)",
        color: "white",
        gap: 32,
      }}
    >
      {/* Avatar */}
      {user.image ? (
        <img
          src={user.image}
          width={160}
          height={160}
          style={{
            borderRadius: "50%",
            border: "4px solid rgba(91, 79, 219, 0.4)",
          }}
        />
      ) : (
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            border: "4px solid rgba(91, 79, 219, 0.4)",
            background: "#1a1030",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 56,
            fontWeight: 700,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          {initials}
        </div>
      )}

      {/* Name */}
      <div style={{ fontSize: 48, fontWeight: 700 }}>{fullName}</div>

      {/* Stats */}
      {student && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
            fontSize: 24,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#eab308" }}>⚡</span>
            <span style={{ color: "white", fontWeight: 600 }}>
              {student.rayoPoints}
            </span>
            <span>points</span>
          </div>
          <div
            style={{
              width: 1,
              height: 24,
              background: "rgba(255,255,255,0.2)",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#f97316" }}>🔥</span>
            <span style={{ color: "white", fontWeight: 600 }}>
              {totalClasses}
            </span>
            <span>classes</span>
          </div>
          <div
            style={{
              width: 1,
              height: 24,
              background: "rgba(255,255,255,0.2)",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>📅</span>
            <span>Joined {memberSince}</span>
          </div>
        </div>
      )}

      {/* Branding */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          fontSize: 20,
          color: "rgba(255,255,255,0.3)",
        }}
      >
        Salsa Rayo Dance School
      </div>
    </div>,
    { ...size }
  );
};

export default OGImage;
