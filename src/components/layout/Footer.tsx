"use client";

import { Mail } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";

export function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-black/60 py-12">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-8">
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center gap-2 mb-4">
                            <Mail className="h-6 w-6 text-white" />
                            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                                {t("appName")}
                            </span>
                        </div>
                        <p className="text-gray-400 max-w-xs whitespace-nowrap">
                            {t("footerDescription")}
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm mb-4 md:mb-0">
                        {t("copyright")}
                    </p>
                </div>
            </div>
        </footer>
    );
}
