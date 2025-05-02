"use client";

import { LetterDetail } from "@/components/letter/LetterDetail";
import { MainLayout } from "@/components/layout/MainLayout";
import { useParams } from "next/navigation";

export default function LetterDetailPage() {
    // 在客户端组件中，使用useParams获取路由参数
    const routeParams = useParams();
    const letterId = routeParams.id as string;

    return (
        <MainLayout>
            <div className="container mx-auto py-12">
                <LetterDetail letter_id={letterId} />
            </div>
        </MainLayout>
    );
}
