"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";

type Language = "zh" | "en";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined
);

// 定义翻译类型
interface TranslationDict {
    [key: string]: string;
}

interface Translations {
    zh: TranslationDict;
    en: TranslationDict;
}

// 中英文翻译
const translations: Translations = {
    zh: {
        // 侧边栏
        home: "首页",
        createGoal: "创建目标",
        myGoals: "我的目标",
        witnessGoals: "见证目标",
        allGoals: "所有目标",
        profile: "个人中心",
        language: "Language (EN)",

        // 导航栏
        myLetters: "我的信件",
        writeLetter: "写信寄出",

        // 按钮和通用文本
        submit: "提交",
        cancel: "取消",
        confirm: "确认",
        edit: "编辑",
        delete: "删除",
        save: "保存",
        loading: "加载中...",
        success: "成功",
        error: "错误",
        back: "返回",
        next: "下一步",

        // 首页内容
        appName: "慢递 Mandy",
        heroTitle: "跨越时间的",
        emotionalDelivery: "情感传递",
        appDescription: "是一款基于",
        technologyStack: "的时间胶囊应用，帮助人们向未来传递情感与记忆。",
        appDescription2:
            "将你的思念、期待或秘密交付给未来。在未来的日期来临前，我们会为你守护这份秘密。",
        letterToFuture: "写给未来的信",
        createLetterButton: "创建慢递信件",
        learnMore: "了解更多",

        // 特色介绍
        uniqueExperience: "慢递服务的",
        uniqueExperienceHighlight: "独特体验",

        // 特色卡片
        timeCustomizationTitle: "时间定制",
        timeCustomizationDesc:
            "你决定信件的投递时间，从几个月到几十年，完全由你掌控。",
        emotionalDeliveryTitle: "情感传递",
        emotionalDeliveryDesc:
            "将此刻的情感、希望或秘密，安全地传递给未来的某个人或自己。",
        mentalComfortTitle: "心灵慰藉",
        mentalComfortDesc:
            "生活中不便直接表达的情绪，通过拉长收信时间，缓解你的焦虑感。",

        // 结尾号召
        startYourJourney: "开始你的",
        journeyHighlight: "慢递之旅",
        journeyDescription: "将今天的思绪传递给未来，创造专属于你的时间记忆。",
        createLetterNow: "立即创建慢递信件",

        // 信件页面
        myCreated: "我创建的",
        sentToMe: "发给我的",

        // 信件编辑器页面
        connectWalletFirst: "请先连接钱包",
        pleaseAddRecipient: "请至少添加一个收件人",
        pleaseUploadOrDelete: "请先上传或删除已选择的附件",
        addressCopied: "地址已复制到剪贴板",
        copyFailed: "复制失败",
        letterCreated: "信件创建成功！",
        letterCreateFailed: "创建信件失败，请重试",
        fileSizeLimit: "文件大小不能超过1MB",
        fileUploaded: "文件上传成功",
        fileUploadFailed: "文件上传失败，请重试",
        addRecipient: "添加收件人",
        recipient: "收件人",
        delivery: "信件投递",
        deliveryTime: "投递时间",
        years: "年",
        months: "月",
        days: "日",
        hours: "小时",
        minutes: "分钟",
        letterContent: "信件内容",
        letterTitle: "信件标题",
        writeYourLetter: "写下你的信件内容...",
        publicLetter: "公开信件",
        attachment: "附件",
        fileSelected: "已选择文件",
        uploadAttachment: "上传附件",
        uploading: "上传中...",
        remove: "移除",
        sendLetter: "寄出信件",

        // 信件列表页面
        createdLetters: "我创建的信件",
        receivedLetters: "发给我的信件",
        fetchLettersFailed: "获取信件列表失败",
        noCreatedLetters: "暂无创建的信件",
        noReceivedLetters: "暂无收到的信件",
        createLetterTip: "你还没有创建任何慢递信件，现在开始写一封吧！",
        receivedLetterTip: "你还没有收到任何慢递信件。",
        startWriting: "开始写信",
        waitingDelivery: "等待投递",
        delivered: "已送达",
        createdAt: "创建于",
        deliveryDate: "投递日期",
        viewDetails: "查看详情",

        // 信件详情页面
        selectViewMode: "请选择查看密文或明文",
        hideEncrypted: "隐藏密文",
        viewEncrypted: "查看密文",
        hideDecrypted: "隐藏明文",
        viewDecrypted: "查看明文",
        decrypting: "解密中...",
        encryptedContent: "加密内容",
        viewEncryptedContent: "查看加密内容",
        noPermission: "无权查看此信件",
        privateLetterNoAccess:
            "当前是非公开信件，您不是收件人，无法查看任何内容。",
        notDeliveryTime: "信件尚未到达投递时间",
        unlockTime: "这封信将在 {date} 解锁内容。",
        canViewEncrypted: "您可以查看加密内容。",
        waitPatiently: "请耐心等待。",
        recipientsList: "收件人",
        attachmentText: "附件",
        downloadAttachment: "下载附件",
        downloading: "下载中...",
        letterTrack: "信件轨迹",
        letterCreation: "信件创建",
        waitingForDelivery: "等待投递",
        willBeDeliveredAt: "将于 {date} 投递",
        deliveryCompleted: "投递完成",
        letterSuccessDelivered: "信件已成功送达",
        returnToLetterList: "返回信件列表",
        letterNotFound: "未找到信件",
        letterNotExist: "抱歉，该信件不存在。",
        noRecipients: "无收件人",
        privateLetter: "非公开信件",
        visibleToAll: "所有人可见",
        visibleToRecipients: "仅收件人可见",
        deliveryCountdown: "投递倒计时",
        copyAddress: "复制地址",
        clickToCopyFullAddress: "点击复制完整地址",

        // 时间工具
        dateNotSet: "未设置日期",
        deliveryDateNotSet: "未设置投递日期",
        year: "年",
        month: "月",
        day: "天",
        hour: "时",
        minute: "分",
        second: "秒",
        after: "后",

        // 页脚
        footerDescription: "慢递服务，连接过去与未来，传递跨越时间的情感。",
        copyright: "© 2025 慢递 Mandy. 保留所有权利.",
    },
    en: {
        // 侧边栏
        home: "Home",
        createGoal: "Create Goal",
        myGoals: "My Goals",
        witnessGoals: "Witness Goals",
        allGoals: "All Goals",
        profile: "Profile",
        language: "语言 (中)",

        // 导航栏
        myLetters: "My Letters",
        writeLetter: "Write Letter",

        // 按钮和通用文本
        submit: "Submit",
        cancel: "Cancel",
        confirm: "Confirm",
        edit: "Edit",
        delete: "Delete",
        save: "Save",
        loading: "Loading...",
        success: "Success",
        error: "Error",
        back: "Back",
        next: "Next",

        // 首页内容
        appName: "Mandy",
        heroTitle: "Emotional Delivery",
        emotionalDelivery: "Across Time",
        appDescription: "is a time capsule application based on",
        technologyStack:
            "that helps people deliver emotions and memories to the future.",
        appDescription2:
            "Deliver your thoughts, expectations, or secrets to the future. We will guard this secret for you until the future date arrives.",
        letterToFuture: "Letter to the Future",
        createLetterButton: "Create Letter",
        learnMore: "Learn More",

        // 特色介绍
        uniqueExperience: "Unique Experience of",
        uniqueExperienceHighlight: "Mandy Service",

        // 特色卡片
        timeCustomizationTitle: "Time Customization",
        timeCustomizationDesc:
            "You decide when the letter will be delivered, from months to decades, completely under your control.",
        emotionalDeliveryTitle: "Emotional Delivery",
        emotionalDeliveryDesc:
            "Safely deliver your current emotions, hopes, or secrets to someone or yourself in the future.",
        mentalComfortTitle: "Mental Comfort",
        mentalComfortDesc:
            "Emotions that are inconvenient to express directly in life, by extending the letter delivery time, ease your anxiety.",

        // 结尾号召
        startYourJourney: "Start Your",
        journeyHighlight: "Mandy Journey",
        journeyDescription:
            "Transmit today's thoughts to the future, creating a time memory that belongs to you.",
        createLetterNow: "Create Letter Now",

        // 信件页面
        myCreated: "My Created",
        sentToMe: "Sent to Me",

        // 信件编辑器页面
        connectWalletFirst: "Please Connect Wallet First",
        pleaseAddRecipient: "Please add at least one recipient",
        pleaseUploadOrDelete:
            "Please upload or delete the selected attachment first",
        addressCopied: "Address copied to clipboard",
        copyFailed: "Copy failed",
        letterCreated: "Letter created successfully!",
        letterCreateFailed: "Failed to create letter, please try again",
        fileSizeLimit: "File size cannot exceed 1MB",
        fileUploaded: "File uploaded successfully",
        fileUploadFailed: "File upload failed, please try again",
        addRecipient: "Add Recipient",
        recipient: "Recipient",
        delivery: "Letter Delivery",
        deliveryTime: "Delivery Time",
        years: "Years",
        months: "Months",
        days: "Days",
        hours: "Hours",
        minutes: "Minutes",
        letterContent: "Letter Content",
        letterTitle: "Letter Title",
        writeYourLetter: "Write your letter content...",
        publicLetter: "Public Letter",
        attachment: "Attachment",
        fileSelected: "File Selected",
        uploadAttachment: "Upload Attachment",
        uploading: "Uploading...",
        remove: "Remove",
        sendLetter: "Send Letter",

        // 信件列表页面
        createdLetters: "Letters I Created",
        receivedLetters: "Letters Sent to Me",
        fetchLettersFailed: "Failed to fetch letters",
        noCreatedLetters: "No Created Letters",
        noReceivedLetters: "No Received Letters",
        createLetterTip:
            "You haven't created any letters yet. Start writing one now!",
        receivedLetterTip: "You haven't received any letters yet.",
        startWriting: "Start Writing",
        waitingDelivery: "Waiting for Delivery",
        delivered: "Delivered",
        createdAt: "Created at",
        deliveryDate: "Delivery Date",
        viewDetails: "View Details",

        // 信件详情页面
        selectViewMode: "Please select to view encrypted or decrypted content",
        hideEncrypted: "Hide Encrypted",
        viewEncrypted: "View Encrypted",
        hideDecrypted: "Hide Decrypted",
        viewDecrypted: "View Decrypted",
        decrypting: "Decrypting...",
        encryptedContent: "Encrypted Content",
        viewEncryptedContent: "View Encrypted Content",
        noPermission: "No Permission to View",
        privateLetterNoAccess:
            "This is a private letter. As you are not a recipient, you cannot view any content.",
        notDeliveryTime: "Letter has not reached delivery time",
        unlockTime: "This letter will unlock its content at {date}.",
        canViewEncrypted: "You can view the encrypted content.",
        waitPatiently: "Please wait patiently.",
        recipientsList: "Recipients",
        attachmentText: "Attachment",
        downloadAttachment: "Download Attachment",
        downloading: "Downloading...",
        letterTrack: "Letter Track",
        letterCreation: "Letter Creation",
        waitingForDelivery: "Waiting for Delivery",
        willBeDeliveredAt: "Will be delivered at {date}",
        deliveryCompleted: "Delivery Completed",
        letterSuccessDelivered: "Letter has been successfully delivered",
        returnToLetterList: "Back to Letter List",
        letterNotFound: "Letter Not Found",
        letterNotExist: "Sorry, this letter does not exist.",
        noRecipients: "No Recipients",
        privateLetter: "Private Letter",
        visibleToAll: "Visible to Everyone",
        visibleToRecipients: "Visible to Recipients Only",
        deliveryCountdown: "Delivery Countdown",
        copyAddress: "Copy address",
        clickToCopyFullAddress: "Click to copy full address",

        // 时间工具
        dateNotSet: "Date not set",
        deliveryDateNotSet: "Delivery date not set",
        year: "year",
        month: "month",
        day: "day",
        hour: "hour",
        minute: "minute",
        second: "second",
        after: "later",

        // 页脚
        footerDescription:
            "Mandy service, connecting past and future, delivering emotions across time.",
        copyright: "© 2025 Mandy. All rights reserved.",
    },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    // 首先尝试从本地存储获取语言设置，默认为英文
    const [language, setLanguageState] = useState<Language>("en");

    useEffect(() => {
        // 确保代码只在客户端执行
        if (typeof window !== "undefined") {
            // 获取本地存储的语言设置
            const savedLanguage = localStorage.getItem("language") as Language;
            if (
                savedLanguage &&
                (savedLanguage === "zh" || savedLanguage === "en")
            ) {
                setLanguageState(savedLanguage);
            }
        }
    }, []);

    // 设置语言并保存到本地存储
    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        if (typeof window !== "undefined") {
            localStorage.setItem("language", lang);
        }
    };

    // 翻译函数
    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

// 创建一个自定义钩子，方便在组件中使用
export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
