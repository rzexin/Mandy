"use client";

import { LetterList } from "@/components/letter/LetterList";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/providers/LanguageProvider";

export default function LettersPage() {
    const { t } = useLanguage();

    return (
        <MainLayout>
            <div className="container mx-auto py-12">
                <Tabs defaultValue="created" className="w-full">
                    <TabsList className="bg-black/30 border border-purple-500/30 mb-6">
                        <TabsTrigger
                            value="created"
                            className="text-gray-200 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                        >
                            {t("myCreated")}
                        </TabsTrigger>
                        <TabsTrigger
                            value="received"
                            className="text-gray-200 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                        >
                            {t("sentToMe")}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="created">
                        <LetterList type="created" />
                    </TabsContent>

                    <TabsContent value="received">
                        <LetterList type="received" />
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
}
