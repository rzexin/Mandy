import { LetterEditor } from "@/components/letter/LetterEditor";
import { MainLayout } from "@/components/layout/MainLayout";

export default function CreateLetterPage() {
    return (
        <MainLayout>
            <div className="container mx-auto py-12">
                <LetterEditor />
            </div>
        </MainLayout>
    );
}
