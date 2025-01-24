/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs/promises";
import { ImageResponse } from "next/og";
import path from "path";

const background_color_100 = "#141417";
const background_color_200 = "#16161A";
const background_color_300 = "#222226";
const border_color = "#222226";
const gray = "#6C6C7A";
const border_radius = "12px";
const padding = "18px";
const gap = "18px";
const image_size = 250;

const getWinRateIcon = (color: string) => (
  <svg
    style={{ width: 60, height: 60, color }}
    width="26"
    height="25"
    viewBox="0 0 26 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="13"
      cy="12.4333"
      r="11.2662"
      transform="rotate(-90 13 12.4333)"
      stroke="currentColor"
      strokeWidth="1.73326"
    />
    <path
      d="M17.646 13.8776C17.8551 14.0652 17.809 14.4047 17.5574 14.5297L5.75045 20.3959C5.38023 20.5798 5.01 20.1468 5.24921 19.8097L9.08658 14.4011C9.56192 13.7311 9.45916 12.8112 8.84771 12.2626L7.42823 10.9891C7.2191 10.8014 7.26522 10.462 7.51684 10.337L19.3237 4.4708C19.694 4.28686 20.0642 4.71985 19.825 5.057L15.9876 10.4656C15.5123 11.1355 15.615 12.0555 16.2265 12.6041L17.646 13.8776Z"
      fill="currentColor"
    />
  </svg>
);

const getWinRateColor = (winRate: number | null) => {
  if (winRate === null) {
    return "text-background-50";
  }

  winRate = Number(winRate);

  if (winRate >= 50) {
    return "#75B88F";
  } else if (winRate >= 25) {
    return "#DEBE54";
  } else {
    return "#FC6060";
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const telegramChannelId = searchParams.get("tg-channel");

    if (!telegramChannelId) {
      throw new Error("Channel not found");
    }

    const telegramChannel = {
      title: "Zap",
      total_subscribers: 100000,
      win_rate_bps: 100000,
      telegram_calls: [
        {
          token: {
            name: "Bitcoin",
            symbol: "BTC",
          },
          highest_price_bps: 100000,
          token_address: "4bMWqTPrYg1RkCHez275N8RE99nSiCHus8STRyxHSGKS",
        },
      ],
    };

    if (!telegramChannel) {
      throw new Error("Channel not found");
    }

    // Load the font file
    const customFont = await fs.readFile(
      path.join(process.cwd(), "app", "fonts", "Aeonik-Medium.ttf")
    );
    const channelImage = `https://zap-telegram-photos.s3.us-east-1.amazonaws.com/${telegramChannelId}.jpg`;
    const winRatePercentage = Math.trunc(
      Number(telegramChannel.win_rate_bps) / 100
    );
    const winRateColor = getWinRateColor(winRatePercentage);
    const winRateSvg = getWinRateIcon(winRateColor);

    return new ImageResponse(
      (
        <div
          style={{
            fontFamily: "Aeonik",
            display: "flex",
            fontSize: 36,
            background: background_color_100,
            color: "#FFFDF5",
            width: "100%",
            height: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: 36,
            gap: 36,
          }}
        >
          <div
            style={{
              width: "360px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              gap,
              padding,
              borderRadius: border_radius,
              backgroundColor: background_color_200,
              borderColor: border_color,
              borderWidth: 1,
            }}
          >
            <img
              src={channelImage}
              alt={telegramChannel.title ?? ""}
              width={image_size}
              height={image_size}
              style={{
                borderRadius: "9999px",
                objectFit: "cover",
                borderColor: winRateColor,
                borderWidth: 3,
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
            <div
              style={{
                fontSize: 30,
                flexDirection: "column",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                marginTop: 15,
                gap: 6,
              }}
            >
              <span>{telegramChannel.title}</span>
              <span style={{ fontSize: 20 }}>
                <span style={{ color: gray }}>Subscribers:&nbsp;</span>{" "}
                {telegramChannel.total_subscribers?.toLocaleString()}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 12,
                marginTop: "auto",
              }}
            >
              <span style={{ fontSize: 16, color: winRateColor }}>
                WIN RATE (30D)
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 60,
                  width: "100%",
                  backgroundColor: `${winRateColor}33`, // Adjust background (e.g., add transparency)
                  color: winRateColor,
                  padding: 10,
                  gap,
                  borderRadius: border_radius,
                }}
              >
                {winRateSvg} {Math.floor(winRatePercentage)}%
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
              flexGrow: 1,
              gap,
              justifyItems: "center",
            }}
          >
            <span style={{ fontSize: 40 }}>TOP 3 CALLS</span>
            <div
              style={{
                display: "flex",
                width: "100%",
                flexGrow: 1,
                flexDirection: "column",
                gap,
                padding,
                backgroundColor: background_color_200,
                borderColor: border_color,
                borderRadius: border_radius,
                borderWidth: 1,
              }}
            >
              {telegramChannel.telegram_calls.map((call) => {
                const imageSize = 100;
                const tokenImage = `https://image.bullx.io/1399811149/${call.token_address}`;
                const pnl = Math.floor(
                  Number(call.highest_price_bps) / 100
                ).toLocaleString();
                return (
                  <div
                    key={call.token.symbol}
                    style={{
                      display: "flex",
                      gap,
                      justifyContent: "flex-start",
                      backgroundColor: background_color_300,
                      borderRadius: border_radius,
                      padding,
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={tokenImage}
                      alt={telegramChannel.title ?? ""}
                      width={imageSize}
                      height={imageSize}
                      style={{
                        borderRadius: "9999px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        fontSize: 25,
                      }}
                    >
                      <span>{call.token.name}</span>
                      <span style={{ color: "#51515C" }}>
                        {call.token.symbol}
                      </span>
                    </div>
                    <span
                      style={{
                        color: "#5DBA8C",
                        display: "flex",
                        fontSize: 40,
                        marginLeft: "auto",
                      }}
                    >
                      +{pnl} %
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            data: customFont,
            name: "Aeonik",
            weight: 400,
          },
        ],
      }
    );
  } catch (e) {
    console.log(e);
    return new ImageResponse(
      <img src="https://zap.xyz/opengraph-image.png">{(e as any).message}</img>,
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
