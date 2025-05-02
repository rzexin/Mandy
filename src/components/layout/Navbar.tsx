"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { ConnectButton } from "@mysten/dapp-kit";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/providers/LanguageProvider";

export function Navbar() {
    const { t } = useLanguage();

    return (
        <nav className="container mx-auto flex items-center justify-between py-6">
            <div className="flex items-center gap-2">
                <Mail className="h-8 w-8 text-white" />
                <Link
                    href="/"
                    className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
                >
                    慢递 Mandy
                </Link>
            </div>
            <div className="flex items-center gap-6">
                <Link
                    href="/letters"
                    className="text-gray-300 hover:text-white transition-colors"
                >
                    {t("myLetters")}
                </Link>
                <Button
                    asChild
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                    <Link href="/create">{t("writeLetter")}</Link>
                </Button>

                <LanguageSwitcher />

                <div className="flex justify-center items-center ">
                    <ConnectButton />
                </div>
            </div>
        </nav>
    );
}
