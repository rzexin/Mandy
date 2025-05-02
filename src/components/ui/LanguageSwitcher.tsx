"use client";

import { useLanguage } from "@/providers/LanguageProvider";
import { Button } from "./button";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
    const { language, setLanguage, t } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "zh" : "en");
    };

    return (
        <Button
            variant="ghost"
            className="text-gray-300 transition-colors"
            onClick={toggleLanguage}
        >
            <Languages className="mr-1" />
            {t("language")}
        </Button>
    );
}
