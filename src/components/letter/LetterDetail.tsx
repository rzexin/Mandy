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
    ClockIcon,
    UserCircle,
    Mail,
    Copy,
    Check,
    CalendarDays,
    Hourglass,
    Lock,
    EyeIcon,
    Globe,
    SearchX,
    FileDown,
    Loader2,
    Paperclip,
} from "lucide-react";
import Link from "next/link";
import { useGetOneLetter } from "@/hooks/useGetOneLetter";
import { LetterData } from "@/types/move";
import { formatDate } from "@/lib/timeUtils";
import { useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { calculateTimeRemaining } from "@/lib/timeUtils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useDecryptSealContent } from "@/mutations/decryptSealContent";
import { useDecryptAttachment } from "@/mutations/decryptAttachment";
import { useLanguage } from "@/providers/LanguageProvider";

export function LetterDetail({ letter_id }: { letter_id: string }) {
    const { t } = useLanguage();
    const account = useCurrentAccount();
    const { mutateAsync: decryptSealContent } = useDecryptSealContent();
    const { mutateAsync: decryptAttachment, isPending: isDownloading } =
        useDecryptAttachment();
    const [decryptedContent, setDecryptedContent] = useState<string>("");
    const [isDecrypting, setIsDecrypting] = useState(false);
    const [showEncrypted, setShowEncrypted] = useState(false);
    const [showDecrypted, setShowDecrypted] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const { data: letterData } = useGetOneLetter({ letterId: letter_id }) as {
        data: LetterData | undefined;
    };
    const letter = letterData?.fields;
    const currentAccount = account?.address;

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

    // 检查投递时间是否已到
    const isDeliveryTimeReached =
        letter?.status === 1 ||
        (letter && new Date().getTime() >= Number(letter.delivery_time_ms));

    // 检查当前用户是否有权限查看
    const isPublic = letter?.is_public === true;
    const isRecipient =
        currentAccount &&
        letter?.recipients &&
        letter.recipients.includes(currentAccount);
    const isSender = currentAccount && letter?.sender === currentAccount;
    const hasViewPermission = isPublic || isRecipient || isSender;

    // 检查是否有附件
    const hasAttachment =
        letter?.attach_blob_id && letter.attach_blob_id !== "";

    // 修改解密函数
    const handleDecrypt = async () => {
        if (showDecrypted) {
            setShowDecrypted(false);
            return;
        }

        if (!decryptedContent && letter) {
            setIsDecrypting(true);
            try {
                const decryptContent = await decryptSealContent({
                    letterId: Number(letter_id),
                    base64Content: letter.content,
                });
                setDecryptedContent(decryptContent);
                setShowDecrypted(true);
            } catch (error) {
                console.error("解密失败:", error);
            } finally {
                setIsDecrypting(false);
            }
        } else {
            setShowDecrypted(true);
        }
        setShowEncrypted(false);
    };

    const handleToggleEncrypted = () => {
        setShowEncrypted(!showEncrypted);
        setShowDecrypted(false);
    };

    // 下载附件
    const handleDownloadAttachment = async () => {
        if (!letter || !letter.attach_blob_id) return;

        try {
            await decryptAttachment({
                letterId: Number(letter_id),
                blobId: letter.attach_blob_id,
                fileName: letter.file_name,
            });
        } catch (error) {
            console.error("下载附件失败:", error);
        }
    };

    if (!letter) {
        return (
            <Card className="bg-black/30 border border-purple-500/30 max-w-4xl mx-auto">
                <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
                    <SearchX className="h-16 w-16 text-purple-400 animate-pulse" />
                    <h3 className="text-xl font-semibold text-gradient bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        {t("letterNotFound")}
                    </h3>
                    <p className="text-gray-400 text-center max-w-md">
                        {t("letterNotExist")}
                    </p>
                    <Button
                        asChild
                        className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                    >
                        <Link href="/letters">{t("returnToLetterList")}</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

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

    // 截断地址并格式化显示
    const formatAddress = (address: string) => {
        if (!address) return "";
        if (address.length <= 12) return address;
        return `${address.substring(0, 6)}...${address.substring(
            address.length - 6
        )}`;
    };

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        });
    };

    return (
        <Card className="bg-black/30 border border-purple-500/30 max-w-4xl mx-auto">
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                        <CardTitle className="text-2xl text-white flex items-center gap-2">
                            <Mail className="h-6 w-6 text-purple-400" />
                            {letter.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
                            <span>
                                {t("createdAt")}{" "}
                                {formatDate(
                                    new Date(Number(letter.created_at))
                                )}
                            </span>
                            <span>•</span>
                            <span>
                                {getStatusBadge(
                                    Number(letter.delivery_time_ms)
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        {/* 信件内容 */}
                        <div className="bg-black/20 rounded-lg p-6 border border-purple-500/20">
                            {isSender ||
                            (isDeliveryTimeReached && hasViewPermission) ? (
                                <div className="space-y-4">
                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            variant="outline"
                                            className={`bg-black/50 border-purple-500/50 hover:bg-black/70 ${
                                                showEncrypted
                                                    ? "text-pink-400"
                                                    : "text-purple-400"
                                            }`}
                                            onClick={handleToggleEncrypted}
                                        >
                                            <Lock className="mr-2 h-4 w-4" />
                                            {showEncrypted
                                                ? t("hideEncrypted")
                                                : t("viewEncrypted")}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className={`bg-black/50 border-purple-500/50 hover:bg-black/70 ${
                                                showDecrypted
                                                    ? "text-pink-400"
                                                    : "text-purple-400"
                                            }`}
                                            onClick={handleDecrypt}
                                            disabled={isDecrypting}
                                        >
                                            <EyeIcon className="mr-2 h-4 w-4" />
                                            {isDecrypting
                                                ? t("decrypting")
                                                : showDecrypted
                                                ? t("hideDecrypted")
                                                : t("viewDecrypted")}
                                        </Button>
                                    </div>

                                    {showEncrypted && (
                                        <div className="text-white whitespace-pre-wrap break-words max-w-full overflow-x-auto">
                                            {letter.content
                                                .split("\n")
                                                .map((line, i) => (
                                                    <p
                                                        key={`line-${i}-${line.substring(
                                                            0,
                                                            8
                                                        )}`}
                                                        className="mb-2"
                                                    >
                                                        {line || <br />}
                                                    </p>
                                                ))}
                                        </div>
                                    )}

                                    {showDecrypted && (
                                        <div className="text-white whitespace-pre-wrap break-words max-w-full overflow-x-auto">
                                            {decryptedContent
                                                .split("\n")
                                                .map((line, index) => (
                                                    <p
                                                        key={`line-${index}`}
                                                        className="mb-2"
                                                    >
                                                        {line || <br />}
                                                    </p>
                                                ))}
                                        </div>
                                    )}

                                    {!showEncrypted && !showDecrypted && (
                                        <div className="text-center text-gray-400 py-8">
                                            {t("selectViewMode")}
                                        </div>
                                    )}

                                    {/* 附件下载部分 */}
                                    {hasAttachment && (
                                        <div className="mt-6 pt-4 border-t border-purple-500/20">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-white">
                                                    <Paperclip className="h-4 w-4 text-purple-400" />
                                                    <span>
                                                        {t("attachmentText")}
                                                    </span>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="bg-black/50 text-purple-400 border-purple-500/50 hover:bg-black/70"
                                                    onClick={
                                                        handleDownloadAttachment
                                                    }
                                                    disabled={isDownloading}
                                                >
                                                    {isDownloading ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            {t("downloading")}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FileDown className="mr-2 h-4 w-4" />
                                                            {t(
                                                                "downloadAttachment"
                                                            )}
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : !hasViewPermission ? (
                                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                                    <div className="relative">
                                        <Lock className="h-16 w-16 text-red-400 animate-pulse" />
                                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gradient bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                                        {t("noPermission")}
                                    </h3>
                                    <p className="text-gray-400 text-center max-w-md">
                                        {t("privateLetterNoAccess")}
                                    </p>
                                </div>
                            ) : !isDeliveryTimeReached ? (
                                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                                    <div className="relative">
                                        <Lock className="h-16 w-16 text-purple-400 animate-pulse" />
                                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-500 rounded-full animate-ping" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gradient bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                        {t("notDeliveryTime")}
                                    </h3>
                                    <p className="text-gray-400 text-center max-w-md">
                                        {t("unlockTime").replace(
                                            "{date}",
                                            formatDate(
                                                new Date(
                                                    Number(
                                                        letter.delivery_time_ms
                                                    )
                                                )
                                            )
                                        )}{" "}
                                        {hasViewPermission
                                            ? t("canViewEncrypted")
                                            : t("waitPatiently")}
                                    </p>
                                    {hasViewPermission && (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="mt-2 bg-black/50 text-purple-400 border-purple-500/50 hover:bg-black/70"
                                                >
                                                    <EyeIcon className="mr-2 h-4 w-4" />
                                                    {t("viewEncryptedContent")}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-black/90 border border-purple-500/30 max-w-3xl max-h-[80vh]">
                                                <DialogHeader>
                                                    <DialogTitle className="text-white flex items-center gap-2">
                                                        <Lock className="h-4 w-4 text-purple-400" />
                                                        {t("encryptedContent")}
                                                    </DialogTitle>
                                                </DialogHeader>
                                                <div className="overflow-y-auto max-h-[60vh] pr-2">
                                                    <div className="text-white whitespace-pre-wrap break-words font-mono text-sm">
                                                        {letter.content
                                                            .split("\n")
                                                            .map((line, i) => (
                                                                <p
                                                                    key={`line-${i}-${line.substring(
                                                                        0,
                                                                        8
                                                                    )}`}
                                                                    className="mb-2"
                                                                >
                                                                    {line || (
                                                                        <br />
                                                                    )}
                                                                </p>
                                                            ))}
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* 收件人信息 */}
                        <div className="bg-black/20 rounded-lg p-4 border border-purple-500/20">
                            <h3 className="text-white font-medium flex items-center gap-2 mb-3">
                                <UserCircle className="h-4 w-4 text-purple-400" />
                                {t("recipientsList")}
                            </h3>
                            <div className="text-gray-300 space-y-2">
                                {letter.recipients &&
                                letter.recipients.length > 0 ? (
                                    <div className="space-y-2">
                                        {letter.recipients.map(
                                            (recipient, index) => (
                                                <TooltipProvider
                                                    key={`recipient-${recipient}`}
                                                >
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                className="flex items-center gap-2 p-1.5 rounded hover:bg-black/30 cursor-pointer w-full text-left"
                                                                onClick={() =>
                                                                    copyToClipboard(
                                                                        recipient,
                                                                        index
                                                                    )
                                                                }
                                                                aria-label={`${t(
                                                                    "copyAddress"
                                                                )} ${formatAddress(
                                                                    recipient
                                                                )}`}
                                                                type="button"
                                                            >
                                                                <span className="text-sm font-mono">
                                                                    {formatAddress(
                                                                        recipient
                                                                    )}
                                                                </span>
                                                                {copiedIndex ===
                                                                index ? (
                                                                    <Check className="h-4 w-4 text-green-500" />
                                                                ) : (
                                                                    <Copy className="h-4 w-4 text-gray-500" />
                                                                )}
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>
                                                                {copiedIndex ===
                                                                index
                                                                    ? t(
                                                                          "addressCopied"
                                                                      )
                                                                    : t(
                                                                          "clickToCopyFullAddress"
                                                                      )}
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400">
                                        {t("noRecipients")}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* 投递信息 */}
                        <div className="bg-black/20 rounded-lg p-4 border border-purple-500/20">
                            <div className="flex items-start gap-2">
                                {letter.is_public ? (
                                    <Globe className="h-4 w-4 text-emerald-400 mt-1" />
                                ) : (
                                    <Lock className="h-4 w-4 text-purple-400 mt-1" />
                                )}
                                <div>
                                    <p className="text-white font-medium">
                                        {letter.is_public
                                            ? t("publicLetter")
                                            : t("privateLetter")}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {letter.is_public
                                            ? t("visibleToAll")
                                            : t("visibleToRecipients")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black/20 rounded-lg p-4 border border-purple-500/20">
                            <h3 className="text-white font-medium flex items-center gap-2 mb-3">
                                <ClockIcon className="h-4 w-4 text-pink-400" />
                                {t("deliveryTime")}
                            </h3>
                            <div className="text-gray-300 space-y-3">
                                <div className="flex items-start gap-2">
                                    <CalendarDays className="h-4 w-4 text-purple-400 mt-1" />
                                    <div>
                                        <p>
                                            {formatDate(
                                                new Date(
                                                    Number(
                                                        letter.delivery_time_ms
                                                    )
                                                )
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {t("deliveryDate")}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Hourglass className="h-4 w-4 text-blue-400 mt-1" />
                                    <div>
                                        <p className="text-white font-medium">
                                            {calculateTimeRemaining(
                                                new Date(
                                                    Number(
                                                        letter.delivery_time_ms
                                                    )
                                                )
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {t("deliveryCountdown")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 信件轨迹 */}
                        <div className="bg-black/20 rounded-lg p-4 border border-purple-500/20">
                            <h3 className="text-white font-medium flex items-center gap-2 mb-3">
                                {t("letterTrack")}
                            </h3>
                            <div className="text-gray-300 space-y-4">
                                <div className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                        <div className="w-0.5 h-full bg-gray-700" />
                                    </div>
                                    <div>
                                        <p className="text-white">
                                            {t("letterCreation")}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {formatDate(
                                                new Date(
                                                    Number(letter.created_at)
                                                )
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                                        <div className="w-0.5 h-full bg-gray-700" />
                                        {!isDeliveryTimeReached && (
                                            <div className="w-0.5 h-full bg-gray-700" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-white">
                                            {t("waitingForDelivery")}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {t("willBeDeliveredAt").replace(
                                                "{date}",
                                                formatDate(
                                                    new Date(
                                                        Number(
                                                            letter.delivery_time_ms
                                                        )
                                                    )
                                                )
                                            )}
                                        </p>
                                    </div>
                                </div>
                                {isDeliveryTimeReached && (
                                    <div className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className="w-3 h-3 rounded-full bg-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-white">
                                                {t("deliveryCompleted")}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {t("letterSuccessDelivered")}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex flex-wrap justify-center sm:justify-end gap-4 pt-2">
                <Button
                    asChild
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                >
                    <Link href="/letters">{t("returnToLetterList")}</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
