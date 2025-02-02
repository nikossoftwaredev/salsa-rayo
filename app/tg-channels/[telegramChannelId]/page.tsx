import { Metadata } from "next";
type Props = {
  params: Promise<{ telegramChannelId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const telegramChannelId = (await params).telegramChannelId;

  const tgChannel = {
    username: "zap",
    title: "Zap",
  };

  const title = `Zap - TG Channel - ${tgChannel?.username}`;
  const description = `View ${tgChannel?.title} on Zap ⚡`;
  const ts = new Date();
  const ogImageUrl = `https://salsa-rayo.vercel.app/api/og?tg-channel=${encodeURIComponent(
    telegramChannelId
  )}&ts=${ts}`;

  const ogImage = {
    url: ogImageUrl,
    secureUrl: ogImageUrl,
    width: 1200,
    height: 630,
    alt: `Dynamic ${title} Image`,
  };

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@zap",
      images: [ogImage],
    },
  };
}

export default async function Home() {
  return (
    <div className="flex w-full items-center justify-center px-6 py-9">
      HELLO
    </div>
  );
}
