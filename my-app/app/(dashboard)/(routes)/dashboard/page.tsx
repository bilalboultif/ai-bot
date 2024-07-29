"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Code, ImageIcon, MessageSquare, Music, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/contexts/LanguageContext";

// Define the type for the translations object
type Language = 'en' | 'ar' | 'fr';
type Translations = {
  [key in Language]: {
    explorerTitle: string;
    explorerDescription: string;
    conversation: string;
    musicGeneration: string;
    videoGeneration: string;
    imageGeneration: string;
    codeGeneration: string;
  };
};

const translations: Translations = {
  en: {
    explorerTitle: "Explore the power of Maria AI",
    explorerDescription: "Chat with the smartest AI with all AI tools",
    conversation: "Conversation",
    musicGeneration: "Music Generation",
    videoGeneration: "Video Generation",
    imageGeneration: "Image Generation",
    codeGeneration: "Code Generation"
  },
  ar: {
    explorerTitle: "استكشف قوة ماريا الذكاء الاصطناعي",
    explorerDescription: "الدردشة مع أذكى الذكاء الاصطناعي مع جميع أدوات الذكاء الاصطناعي",
    conversation: "محادثة",
    musicGeneration: "توليد الموسيقى",
    videoGeneration: "توليد الفيديو",
    imageGeneration: "توليد الصور",
    codeGeneration: "توليد الأكواد"
  },
  fr: {
    explorerTitle: "Découvrez la puissance de Maria AI",
    explorerDescription: "Discutez avec l'IA la plus intelligente avec tous les outils d'IA",
    conversation: "Conversation",
    musicGeneration: "Génération de musique",
    videoGeneration: "Génération de vidéo",
    imageGeneration: "Génération d'images",
    codeGeneration: "Génération de code"
  }
};

export default function DashboardPage() {
    const router = useRouter();
    const { language } = useLanguage(); // Use the language context

    const tools = [
        {
            label: translations[language].conversation,
            icon: MessageSquare,
            color: "text-voilet-500",
            bgColor: "bg-voilet-500/10",
            href: "/conversation"
        },
        {
            label: translations[language].musicGeneration,
            icon: Music,
            color: "text-voilet-500",
            bgColor: "bg-voilet-500/10",
            href: "/music"
        },
        {
            label: translations[language].videoGeneration,
            icon: Video,
            color: "text-voilet-500",
            bgColor: "bg-voilet-500/10",
            href: "/video"
        },
        {
            label: translations[language].imageGeneration,
            icon: ImageIcon,
            color: "text-voilet-500",
            bgColor: "bg-voilet-500/10",
            href: "/image"
        },
        {
            label: translations[language].codeGeneration,
            icon: Code,
            color: "text-voilet-500",
            bgColor: "bg-voilet-500/10",
            href: "/code"
        }
    ];

    return (
        <div>
            <div className="mb-8 space-y-4">
                <h2 className="text-2xl md:text-4xl font-bold text-center">
                    {translations[language].explorerTitle}
                </h2>
                <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
                    {translations[language].explorerDescription}
                </p>
            </div>
            <div className="px-4 md:px-20 lg:px-32 space-y-4">
                {tools.map((tool) => (
                    <Card 
                        onClick={() => router.push(tool.href)}
                        key={tool.href}
                        className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
                    >
                        <div className="flex items-center gap-x-4">
                            <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                                <tool.icon className={cn("w-8 h-8", tool.color)} />
                            </div>
                            <div className="font-semibold">
                                {tool.label}
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5" />
                    </Card>
                ))}
            </div>
        </div>
    );
}
