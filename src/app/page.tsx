"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Clock, Mail, Send, Heart } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";

export default function Home() {
    const { t } = useLanguage();

    return (
        <MainLayout>
            <section className="container mx-auto py-20 flex flex-col items-center">
                <h1 className="text-5xl md:text-6xl font-bold text-center text-white mb-6">
                    {t("heroTitle")}{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        {t("emotionalDelivery")}
                    </span>
                </h1>

                <div className="flex flex-col space-y-8 mb-10 max-w-4xl w-full mt-10">
                    <div className="flex flex-col md:flex-row items-center bg-gradient-to-r from-purple-900/30 to-transparent p-6 rounded-xl hover:from-purple-800/40 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="md:w-1/2 md:pr-6">
                            <p className="text-xl text-gray-300">
                                <span className="inline-block text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
                                    {t("appName")}
                                </span>
                                <br />
                                {t("appDescription")}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 hover:from-pink-400 hover:to-purple-400 transition-all duration-500 cursor-pointer">
                                    {" "}
                                    Sui{" "}
                                </span>
                                +
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 hover:from-pink-400 hover:to-purple-400 transition-all duration-500 cursor-pointer">
                                    {" "}
                                    Seal{" "}
                                </span>
                                +
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 hover:from-pink-400 hover:to-purple-400 transition-all duration-500 cursor-pointer">
                                    {" "}
                                    Walrus{" "}
                                </span>
                                {t("technologyStack")}
                            </p>
                        </div>
                        <div className="md:w-1/2 mt-4 md:mt-0 flex items-center justify-center">
                            <div className="w-24 h-24 relative group cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-80 group-hover:opacity-100 transform transition-all duration-300 group-hover:scale-110"></div>
                                <div className="absolute inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-80 scale-95 group-hover:scale-90 transition-all duration-500"></div>
                                <Mail className="absolute inset-0 m-auto h-10 w-10 text-white transform transition-transform duration-300 group-hover:scale-125" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row-reverse items-center bg-gradient-to-l from-pink-900/30 to-transparent p-6 rounded-xl hover:from-pink-800/40 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="md:w-1/2 md:pl-6">
                            <p className="text-xl text-gray-300">
                                <span className="inline-block text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-300">
                                    {t("appName")}
                                </span>
                                <br />
                                {t("appDescription2")}
                            </p>
                        </div>
                        <div className="md:w-1/2 mt-4 md:mt-0 flex items-center justify-center">
                            <div className="relative w-24 h-24 group cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse duration-3000 group-hover:animate-none group-hover:scale-110 transition-all duration-300"></div>
                                <div className="absolute inset-0 w-full h-full rounded-full flex items-center justify-center">
                                    <div className="absolute w-full h-full rounded-full border-2 border-pink-300/30 group-hover:border-pink-300/60 transition-all duration-300"></div>
                                    <div className="absolute w-full h-full rounded-full border-2 border-transparent border-t-pink-300/50 border-r-pink-300/50 group-hover:rotate-180 transition-all duration-700"></div>
                                    <Clock className="h-10 w-10 text-white z-10 group-hover:scale-125 transition-all duration-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mt-10">
                    <Button
                        asChild
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg py-6 px-8 rounded-full"
                    >
                        <Link href="/create">{t("createLetterButton")}</Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="text-purple-500 border-purple-500 hover:bg-purple-500/20 hover:text-white text-lg py-6 px-8 rounded-full"
                    >
                        <Link href="#services">{t("learnMore")}</Link>
                    </Button>
                </div>
            </section>

            <section id="services" className="bg-black/40 py-20">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center text-white mb-12">
                        {t("uniqueExperience")}{" "}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                            {t("uniqueExperienceHighlight")}
                        </span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="bg-black/30 border border-purple-500/20 hover:border-purple-500/40 transition-all hover:translate-y-[-5px]">
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <Clock className="h-12 w-12 text-purple-400 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {t("timeCustomizationTitle")}
                                </h3>
                                <p className="text-gray-300">
                                    {t("timeCustomizationDesc")}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-black/30 border border-pink-500/20 hover:border-pink-500/40 transition-all hover:translate-y-[-5px]">
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <Send className="h-12 w-12 text-pink-400 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {t("emotionalDeliveryTitle")}
                                </h3>
                                <p className="text-gray-300">
                                    {t("emotionalDeliveryDesc")}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-black/30 border border-blue-500/20 hover:border-blue-500/40 transition-all hover:translate-y-[-5px]">
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <Heart className="h-12 w-12 text-blue-400 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {t("mentalComfortTitle")}
                                </h3>
                                <p className="text-gray-300">
                                    {t("mentalComfortDesc")}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="container mx-auto py-20 text-center">
                <h2 className="text-3xl font-bold text-white mb-6">
                    {t("startYourJourney")}{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        {t("journeyHighlight")}
                    </span>
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                    {t("journeyDescription")}
                </p>
                <Button
                    asChild
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg py-6 px-8 rounded-full"
                >
                    <Link href="/create">{t("createLetterNow")}</Link>
                </Button>
            </section>
        </MainLayout>
    );
}
