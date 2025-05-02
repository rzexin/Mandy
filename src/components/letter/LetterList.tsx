"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Clock,
    Mail,
    Eye,
    CalendarDays,
    Hourglass,
    SearchX,
} from "lucide-react";
import Link from "next/link";
import { useGetLettersICreated } from "@/hooks/useGetLettersICreated";
import { useGetLettersIReceived } from "@/hooks/useGetLettersIReceived";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { formatDate } from "@/lib/timeUtils";
import { calculateTimeRemaining } from "@/lib/timeUtils";
import { useLanguage } from "@/providers/LanguageProvider";

interface LetterListProps {
    type?: "created" | "received";
}

export function LetterList({ type = "created" }: LetterListProps) {
    const { t } = useLanguage();
    const account = useCurrentAccount();

    const { data: lettersICreated, error: errorICreated } =
        useGetLettersICreated();

    const { data: lettersIReceived, error: errorIReceived } =
        useGetLettersIReceived();

    if (!lettersICreated || !lettersIReceived) {
        return (
            <div className="text-gray-400 text-center p-4">{t("loading")}</div>
        );
    }

    if (errorICreated || errorIReceived) {
        return (
            <div className="text-red-500 text-center p-4">
                {t("fetchLettersFailed")}
            </div>
        );
    }

    if (!account) {
        return (
            <Card className="bg-black/30 border border-purple-500/30 max-w-4xl mx-auto">
                <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
                    <SearchX className="h-16 w-16 text-purple-400 animate-pulse" />
                    <h3 className="text-xl font-semibold text-gradient bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        {t("connectWalletFirst")}
                    </h3>
                </CardContent>
            </Card>
        );
    }

    console.log(
        "# created letters: ",
        JSON.stringify(lettersICreated, null, 2)
    );
    console.log(
        "# received letters: ",
        JSON.stringify(lettersIReceived, null, 2)
    );

    // 根据类型选择显示的信件列表
    const letters = type === "created" ? lettersICreated : lettersIReceived;

    // 获取状态标签
    const getStatusBadge = (deliveryTimeMs: number) => {
        const now = Date.now();
        const deliveryTime = Number(deliveryTimeMs);

        if (deliveryTime > now) {
            return (
                <Badge className="bg-blue-500">{t("waitingDelivery")}</Badge>
            );
        } else {
            return <Badge className="bg-green-500">{t("delivered")}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">
                    {type === "created"
                        ? t("createdLetters")
                        : t("receivedLetters")}
                </h2>
            </div>

            {letters.length === 0 ? (
                <Card className="bg-black/30 border border-purple-500/30">
                    <CardContent className="flex flex-col items-center justify-center p-8">
                        <Mail className="h-16 w-16 text-purple-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">
                            {type === "created"
                                ? t("noCreatedLetters")
                                : t("noReceivedLetters")}
                        </h3>
                        <p className="text-gray-400 text-center mb-4">
                            {type === "created"
                                ? t("createLetterTip")
                                : t("receivedLetterTip")}
                        </p>
                        {type === "created" && (
                            <Button
                                asChild
                                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            >
                                <Link href="/create">{t("startWriting")}</Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {letters.map((letter) => (
                        <Card
                            key={letter?.letter_id}
                            className="bg-black/30 border border-purple-500/30 hover:border-purple-500/50 transition-all hover:translate-y-[-2px]"
                        >
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl text-white">
                                        {letter?.title}
                                    </CardTitle>
                                    {getStatusBadge(
                                        Number(letter?.delivery_time_ms ?? 0)
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="pb-6">
                                <div className="space-y-3 text-sm text-gray-400">
                                    <div className="flex items-center">
                                        <CalendarDays className="h-4 w-4 mr-2 text-purple-400" />
                                        <span>
                                            {t("createdAt")}{" "}
                                            {letter?.created_at &&
                                                formatDate(
                                                    new Date(
                                                        Number(
                                                            letter.created_at
                                                        )
                                                    )
                                                )}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-2 text-pink-400" />
                                        <span>
                                            {t("deliveryDate")}:{" "}
                                            {formatDate(
                                                new Date(
                                                    Number(
                                                        letter?.delivery_time_ms ??
                                                            0
                                                    )
                                                )
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Hourglass className="h-4 w-4 mr-2 text-blue-400" />
                                        <span>
                                            {calculateTimeRemaining(
                                                new Date(
                                                    Number(
                                                        letter?.delivery_time_ms ??
                                                            0
                                                    )
                                                )
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    asChild
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                                >
                                    <Link
                                        href={`/letters/${letter?.letter_id}`}
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        {t("viewDetails")}
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
