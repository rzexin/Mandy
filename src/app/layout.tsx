import SuiDappProvider from "@/providers/SuiDappProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/providers/LanguageProvider";

import "@mysten/dapp-kit/dist/index.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Mandy - Letters to the Future",
    description:
        "Mandy service helps people deliver emotions to the future. Send letters, receive messages, create time capsules, and build connections across time.",
};

// export const metadata: Metadata = {
//     title: "慢递 Mandy - 写给未来的信",
//     description:
//         "慢递服务，帮助人们向未来传递情感。发信、收信、时间胶囊，创造跨越时间的连接。",
// };

function RootApp({ children }: { children: React.ReactNode }) {
    return (
        <SuiDappProvider>
            <LanguageProvider>
                {children}
                <Toaster />
            </LanguageProvider>
        </SuiDappProvider>
    );
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <RootApp>{children}</RootApp>
            </body>
        </html>
    );
}
