/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs/promises";
import { ImageResponse } from "next/og";
import path from "path";

const background_color_100 = "#141417";

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

    return new ImageResponse(
      (
        <div
          style={{
            fontFamily: "Aeonik",
            display: "flex",
            fontSize: 80,
            background: background_color_100,
            color: "#FFFDF5",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            padding: 36,
            gap: 36,
          }}
        >
          <p>{new Date().toISOString()} </p>
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
