const getLanguage = (): "zh" | "en" => {
    if (typeof window === "undefined") return "en"; // 默认英文
    return (localStorage.getItem("language") as "zh" | "en") || "en";
};

// 获取语言相关的翻译
const getTranslation = (key: string): string => {
    const language = getLanguage();
    const translations: Record<string, Record<string, string>> = {
        zh: {
            dateNotSet: "未设置日期",
            deliveryDateNotSet: "未设置投递日期",
            delivered: "已送达",
            year: "年",
            month: "月",
            day: "天",
            hour: "时",
            minute: "分",
            second: "秒",
            after: "后",
        },
        en: {
            dateNotSet: "Date not set",
            deliveryDateNotSet: "Delivery date not set",
            delivered: "Delivered",
            year: "year",
            month: "month",
            day: "day",
            hour: "hour",
            minute: "minute",
            second: "second",
            after: "later",
        },
    };

    return translations[language][key] || key;
};

export const formatDate = (date: Date | undefined) => {
    if (!date) return getTranslation("dateNotSet");

    const language = getLanguage();
    return date.toLocaleDateString(language === "zh" ? "zh-CN" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
};

export const formatDate2 = (date: Date | undefined) => {
    if (!date) return getTranslation("dateNotSet");

    // 格式化年、月、日
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // 格式化时、分、秒
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

// 计算剩余时间函数
export const calculateTimeRemaining = (deliveryDate: Date | undefined) => {
    if (!deliveryDate) return getTranslation("deliveryDateNotSet");

    const now = new Date();
    const diff = deliveryDate.getTime() - now.getTime();

    if (diff <= 0) return getTranslation("delivered");

    // 计算天、小时、分钟和秒
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);

    // 计算剩余的时分秒
    const remainingDays = days % 365;
    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;

    const language = getLanguage();

    if (years > 0) {
        if (language === "zh") {
            return `${years}${getTranslation(
                "year"
            )}${remainingDays}${getTranslation(
                "day"
            )}${remainingHours}${getTranslation(
                "hour"
            )}${remainingMinutes}${getTranslation(
                "minute"
            )}${remainingSeconds}${getTranslation("second")}${getTranslation(
                "after"
            )}`;
        } else {
            return `${years} ${getTranslation("year")}${
                years > 1 ? "s" : ""
            } ${remainingDays} ${getTranslation("day")}${
                remainingDays > 1 ? "s" : ""
            } ${remainingHours} ${getTranslation("hour")}${
                remainingHours > 1 ? "s" : ""
            } ${getTranslation("after")}`;
        }
    }
    if (days > 0) {
        if (language === "zh") {
            return `${days}${getTranslation(
                "day"
            )}${remainingHours}${getTranslation(
                "hour"
            )}${remainingMinutes}${getTranslation(
                "minute"
            )}${remainingSeconds}${getTranslation("second")}${getTranslation(
                "after"
            )}`;
        } else {
            return `${days} ${getTranslation("day")}${
                days > 1 ? "s" : ""
            } ${remainingHours} ${getTranslation("hour")}${
                remainingHours > 1 ? "s" : ""
            } ${getTranslation("after")}`;
        }
    }
    if (hours > 0) {
        if (language === "zh") {
            return `${hours}${getTranslation(
                "hour"
            )}${remainingMinutes}${getTranslation(
                "minute"
            )}${remainingSeconds}${getTranslation("second")}${getTranslation(
                "after"
            )}`;
        } else {
            return `${hours} ${getTranslation("hour")}${
                hours > 1 ? "s" : ""
            } ${remainingMinutes} ${getTranslation("minute")}${
                remainingMinutes > 1 ? "s" : ""
            } ${getTranslation("after")}`;
        }
    }
    if (minutes > 0) {
        if (language === "zh") {
            return `${minutes}${getTranslation(
                "minute"
            )}${remainingSeconds}${getTranslation("second")}${getTranslation(
                "after"
            )}`;
        } else {
            return `${minutes} ${getTranslation("minute")}${
                minutes > 1 ? "s" : ""
            } ${getTranslation("after")}`;
        }
    }

    if (language === "zh") {
        return `${seconds}${getTranslation("second")}${getTranslation(
            "after"
        )}`;
    } else {
        return `${seconds} ${getTranslation("second")}${
            seconds > 1 ? "s" : ""
        } ${getTranslation("after")}`;
    }
};
