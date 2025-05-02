"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import {
    Clock,
    Mail,
    Send,
    UserCircle,
    Plus,
    Copy,
    Trash2,
    Eye,
    EyeOff,
    Loader2,
    SearchX,
    Paperclip,
    X,
    FileIcon,
    CalendarIcon,
    ClockIcon,
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useCreateLetter } from "@/mutations/create_letter";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { sealEncryptBytes } from "@/lib/sealClient";
import { storeBlob } from "@/lib/walrusClient";
import { useLanguage } from "@/providers/LanguageProvider";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { zhCN } from "date-fns/locale";

interface LetterEditorProps {
    onSave?: (letterData: LetterData) => void;
    initialData?: LetterData;
}

export interface LetterData {
    id?: number;
    title: string;
    content: string;
    recipients: {
        address: string;
    }[];
    deliveryDate: Date;
    isPublic: boolean;
    status?: string;
    createdAt?: Date;
    attachBlobId?: string;
}

interface TimeUnit {
    minutes: number;
    hours: number;
    days: number;
    months: number;
    years: number;
}

const truncateAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export function LetterEditor({ onSave, initialData }: LetterEditorProps) {
    const router = useRouter();
    const { t, language } = useLanguage();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [letterData, setLetterData] = useState<LetterData>(
        initialData || {
            title: "",
            content: "",
            recipients: [],
            deliveryDate: new Date(),
            isPublic: false,
            attachBlobId: "",
        }
    );
    const [timeUnits, setTimeUnits] = useState<TimeUnit>({
        minutes: 0,
        hours: 0,
        days: 0,
        months: 0,
        years: 0,
    });
    const [newAddress, setNewAddress] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const createLetter = useCreateLetter();

    const account = useCurrentAccount();
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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setLetterData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddRecipient = () => {
        if (!newAddress.trim()) return;

        setLetterData((prev) => ({
            ...prev,
            recipients: [...prev.recipients, { address: newAddress.trim() }],
        }));
        setNewAddress("");
    };

    const handleRemoveRecipient = (index: number) => {
        setLetterData((prev) => ({
            ...prev,
            recipients: prev.recipients.filter((_, i) => i !== index),
        }));
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(t("addressCopied"));
        } catch {
            toast.error(t("copyFailed"));
        }
    };

    const updateDeliveryDate = (newTimeUnits: TimeUnit) => {
        const now = new Date();
        const newDate = new Date(now);
        newDate.setMinutes(now.getMinutes() + newTimeUnits.minutes);
        newDate.setHours(now.getHours() + newTimeUnits.hours);
        newDate.setDate(now.getDate() + newTimeUnits.days);
        newDate.setMonth(now.getMonth() + newTimeUnits.months);
        newDate.setFullYear(now.getFullYear() + newTimeUnits.years);
        newDate.setSeconds(0);
        setLetterData((prev) => ({
            ...prev,
            deliveryDate: newDate,
        }));
    };

    const handleDateChange = (date: Date | undefined) => {
        if (!date) return;

        const newDate = new Date(letterData.deliveryDate);
        newDate.setFullYear(date.getFullYear());
        newDate.setMonth(date.getMonth());
        newDate.setDate(date.getDate());
        newDate.setSeconds(0);

        setLetterData((prev) => ({
            ...prev,
            deliveryDate: newDate,
        }));
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const timeString = e.target.value;
        if (!timeString) return;

        const [hours, minutes] = timeString.split(":").map(Number);

        const newDate = new Date(letterData.deliveryDate);
        newDate.setHours(hours || 0);
        newDate.setMinutes(minutes || 0);
        newDate.setSeconds(0);

        setLetterData((prev) => ({
            ...prev,
            deliveryDate: newDate,
        }));
    };

    const adjustTimeUnit = (unit: keyof TimeUnit, amount: number) => {
        const newTimeUnits = {
            ...timeUnits,
            [unit]: Math.max(0, timeUnits[unit] + amount),
        };
        setTimeUnits(newTimeUnits);
        updateDeliveryDate(newTimeUnits);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (letterData.recipients.length === 0) {
            toast.error(t("pleaseAddRecipient"));
            return;
        }

        if (selectedFile && !letterData.attachBlobId) {
            console.log("########### selectedFile", selectedFile);
            console.log(
                "########### letterData.attachBlobId",
                letterData.attachBlobId
            );
            toast.error(t("pleaseUploadOrDelete"));
            return;
        }

        setIsSubmitting(true);
        try {
            const deliveryTimeMs = letterData.deliveryDate.getTime();
            await createLetter.mutateAsync({
                title: letterData.title,
                content: letterData.content,
                recipients: letterData.recipients.map((r) => r.address),
                deliveryTimeMs,
                fileName: selectedFile?.name || "",
                attachBlobId: letterData.attachBlobId || "",
                isPublic: letterData.isPublic,
            });

            onSave?.(letterData);
            toast.success(t("letterCreated"));
            router.push("/letters");
        } catch (error) {
            console.error("创建信件失败:", error);
            toast.error(t("letterCreateFailed"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTogglePublic = (checked: boolean) => {
        setLetterData((prev) => ({
            ...prev,
            isPublic: checked,
        }));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1 * 1024 * 1024) {
                // 1 MB limit
                toast.error(t("fileSizeLimit"));
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            // 读取文件内容为 Uint8Array
            const fileBuffer = await selectedFile.arrayBuffer();
            const fileData = new Uint8Array(fileBuffer);

            // 加密文件内容
            const encryptedData = await sealEncryptBytes(fileData);

            // 上传加密后的数据
            const blobInfo = await storeBlob(encryptedData);
            let blobId = "";
            if (blobInfo.alreadyCertified) {
                blobId = blobInfo.alreadyCertified.blobId;
            } else if (blobInfo.newlyCreated) {
                blobId = blobInfo.newlyCreated.blobObject.blobId;
            } else {
                throw new Error("Response does not contain expected bolbId");
            }

            console.log("########### blobId", blobId);

            setLetterData((prev) => ({
                ...prev,
                attachBlobId: blobId,
            }));
            setIsUploaded(true);
            toast.success(t("fileUploaded"));
        } catch (error) {
            console.error("文件上传失败:", error);
            toast.error(t("fileUploadFailed"));
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setIsUploaded(false);
        setLetterData((prev) => ({
            ...prev,
            attachBlobId: "",
        }));
    };

    // 计算日期字符串显示
    const formattedDate = letterData.deliveryDate.toLocaleDateString(
        language === "zh" ? "zh-CN" : "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        }
    );

    const formattedTime = letterData.deliveryDate.toLocaleTimeString(
        language === "zh" ? "zh-CN" : "en-US",
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }
    );

    // 获取当前时间的字符串格式，用于时间输入组件
    const timeString = format(letterData.deliveryDate, "HH:mm");

    return (
        <Card className="bg-black/30 border border-purple-500/30 max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                    <Mail className="h-6 w-6 text-purple-400" />
                    <span>{t("createLetterButton")}</span>
                </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-white">
                            {t("letterTitle")}
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder={
                                language === "zh"
                                    ? "给未来的自己..."
                                    : "To my future self..."
                            }
                            value={letterData.title}
                            onChange={handleChange}
                            className="bg-black/20 border-purple-500/30 text-white"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content" className="text-white">
                            {t("letterContent")}
                        </Label>
                        <Textarea
                            id="content"
                            name="content"
                            placeholder={t("writeYourLetter")}
                            value={letterData.content}
                            onChange={handleChange}
                            className="min-h-[200px] bg-black/20 border-purple-500/30 text-white"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white flex items-center gap-1">
                            <Paperclip className="h-4 w-4" />
                            {t("attachment")}
                        </Label>
                        <div className="border border-purple-500/30 rounded-md p-4 bg-black/20">
                            {selectedFile ? (
                                <div className="flex items-center justify-between bg-black/20 p-2 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <FileIcon className="h-4 w-4 text-purple-400" />
                                        <span className="text-white">
                                            {selectedFile.name}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            (
                                            {Math.round(
                                                selectedFile.size / 1024
                                            )}{" "}
                                            KB)
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!letterData.attachBlobId && (
                                            <Button
                                                type="button"
                                                onClick={handleFileUpload}
                                                disabled={
                                                    isUploading || isUploaded
                                                }
                                                className="bg-purple-500 hover:bg-purple-600"
                                            >
                                                {isUploading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        {t("uploading")}
                                                    </>
                                                ) : (
                                                    t("uploadAttachment")
                                                )}
                                            </Button>
                                        )}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={handleRemoveFile}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center py-8">
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileSelect}
                                            accept="image/*,application/pdf,.doc,.docx,.txt"
                                        />
                                        <div className="flex flex-col items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
                                            <Paperclip className="h-8 w-8" />
                                            <span>
                                                {language === "zh"
                                                    ? "点击上传附件（最大 1 MB）"
                                                    : "Click to upload attachment (max 1 MB)"}
                                            </span>
                                        </div>
                                    </label>
                                </div>
                            )}
                            <p className="text-sm text-gray-400 mt-4">
                                {language === "zh"
                                    ? "支持的文件格式：图片、PDF、Word文档和文本文件"
                                    : "Supported file formats: Images, PDF, Word documents and text files"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="public-mode"
                            checked={letterData.isPublic}
                            onCheckedChange={handleTogglePublic}
                            className="data-[state=checked]:bg-purple-500"
                        />
                        <Label
                            htmlFor="public-mode"
                            className="text-white flex items-center gap-2"
                        >
                            {letterData.isPublic ? (
                                <Eye className="h-4 w-4 text-purple-400" />
                            ) : (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                            )}
                            {language === "zh"
                                ? letterData.isPublic
                                    ? "到期后公开可见"
                                    : "到期后仅收件人可见"
                                : letterData.isPublic
                                ? "Publicly visible after delivery"
                                : "Only visible to recipients after delivery"}
                        </Label>
                        <div className="ml-2 text-sm text-gray-400">
                            {language === "zh"
                                ? letterData.isPublic
                                    ? "(所有人都可以查看这封信的内容)"
                                    : "(仅收件人可以查看信件内容)"
                                : letterData.isPublic
                                ? "(Everyone can view the content of this letter)"
                                : "(Only recipients can view the letter content)"}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-white flex items-center gap-1">
                                <UserCircle className="h-4 w-4" />
                                {t("recipient")}
                            </Label>
                            <div className="border border-purple-500/30 rounded-md p-4 bg-black/20">
                                <div className="flex gap-2 mb-4">
                                    <Input
                                        value={newAddress}
                                        onChange={(e) =>
                                            setNewAddress(e.target.value)
                                        }
                                        placeholder={
                                            language === "zh"
                                                ? "输入区块链地址"
                                                : "Enter blockchain address"
                                        }
                                        className="bg-black/20 border-purple-500/30 text-white flex-1"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAddRecipient}
                                        className="bg-purple-500 hover:bg-purple-600"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="space-y-2 h-[318px] overflow-y-auto">
                                    {letterData.recipients.map(
                                        (recipient, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 bg-black/20 p-2 rounded-md border border-purple-500/30"
                                            >
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-100"
                                                                onClick={() =>
                                                                    copyToClipboard(
                                                                        recipient.address
                                                                    )
                                                                }
                                                            >
                                                                <Copy className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>
                                                                {language ===
                                                                "zh"
                                                                    ? "复制地址"
                                                                    : "Copy address"}
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <span className="text-gray-200 flex-1">
                                                    {truncateAddress(
                                                        recipient.address
                                                    )}
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                                                    onClick={() =>
                                                        handleRemoveRecipient(
                                                            index
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {t("delivery")}
                            </Label>
                            <div className="border border-purple-500/30 rounded-md p-4 bg-black/20 backdrop-blur-sm">
                                <div className="grid grid-cols-5 gap-3">
                                    {[
                                        { key: "years", label: t("years") },
                                        { key: "months", label: t("months") },
                                        { key: "days", label: t("days") },
                                        { key: "hours", label: t("hours") },
                                        { key: "minutes", label: t("minutes") },
                                    ].map((unit) => (
                                        <div
                                            key={unit.key}
                                            className="flex flex-col items-center"
                                        >
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="rounded-full w-10 h-10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 transition-all"
                                                onClick={() =>
                                                    adjustTimeUnit(
                                                        unit.key as keyof TimeUnit,
                                                        1
                                                    )
                                                }
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                            <div className="my-2 bg-black/40 rounded-lg px-3 py-2 w-full text-center backdrop-blur-sm border border-purple-500/20">
                                                <span className="text-2xl font-medium text-white">
                                                    {
                                                        timeUnits[
                                                            unit.key as keyof TimeUnit
                                                        ]
                                                    }
                                                </span>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="rounded-full w-10 h-10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 transition-all"
                                                onClick={() =>
                                                    adjustTimeUnit(
                                                        unit.key as keyof TimeUnit,
                                                        -1
                                                    )
                                                }
                                            >
                                                <span className="font-bold">
                                                    -
                                                </span>
                                            </Button>
                                            <Label className="text-xs text-gray-400 mt-1">
                                                {unit.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 bg-black/40 rounded-lg border border-purple-500/40 mt-4 backdrop-blur-sm">
                                    <Label className="text-purple-300 text-xs uppercase tracking-wider font-medium">
                                        {t("deliveryTime")}
                                    </Label>
                                    <div className="flex flex-col space-y-3 mt-2">
                                        <div className="flex items-center justify-between">
                                            <Popover
                                                open={isDatePickerOpen}
                                                onOpenChange={
                                                    setIsDatePickerOpen
                                                }
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal bg-black/40 border-purple-500/30 text-white hover:bg-black/60 hover:text-white",
                                                            !letterData.deliveryDate &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4 text-purple-400" />
                                                        {format(
                                                            letterData.deliveryDate,
                                                            "PPP",
                                                            {
                                                                locale:
                                                                    language ===
                                                                    "zh"
                                                                        ? zhCN
                                                                        : undefined,
                                                            }
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-black/90 border-purple-500/30">
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            letterData.deliveryDate
                                                        }
                                                        onSelect={
                                                            handleDateChange
                                                        }
                                                        initialFocus
                                                        disabled={(date) =>
                                                            date < new Date()
                                                        }
                                                        className="bg-black text-white"
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div className="flex items-center space-x-2 relative">
                                            <Input
                                                type="time"
                                                value={timeString}
                                                onChange={handleTimeChange}
                                                className="bg-black/40 border-purple-500/30 text-white pl-10"
                                            />
                                            <div className="absolute pointer-events-none pl-3">
                                                <ClockIcon className="h-4 w-4 text-purple-400" />
                                            </div>
                                        </div>

                                        <div className="text-center font-mono mt-1 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent text-lg font-medium">
                                            {formattedDate} {formattedTime}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pt-6">
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        disabled={
                            Boolean(isSubmitting) ||
                            Boolean(selectedFile && !letterData.attachBlobId)
                        }
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t("loading")}
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                {t("sendLetter")}
                            </>
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
