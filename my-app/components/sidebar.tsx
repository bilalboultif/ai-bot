"use client";

import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { CodeIcon, ImageIcon, LayoutDashboard, MessageSquare, Music, Settings, VideoIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { FaGlobe } from "react-icons/fa";
import { useState } from "react";
import { useLanguage } from "@/components/contexts/LanguageContext";  // Import the hook

// Load Montserrat font
const montserrat = Montserrat({
    weight: "600",
    subsets: ["latin"]
});

// Define routes
const routes = [
    { label: "Dashboard", key: "dashboard", icon: LayoutDashboard, href: "/dashboard", color: "text-sky-500" },
    { label: "Conversation", key: "conversation", icon: MessageSquare, href: "/conversation", color: "text-voilet-500" },
    { label: "Image Generation", key: "imageGeneration", icon: ImageIcon, href: "/image", color: "text-pink-700" },
    { label: "Video Generation", key: "videoGeneration", icon: VideoIcon, href: "/video", color: "text-orang-500" },
    { label: "Music Generation", key: "musicGeneration", icon: Music, href: "/music", color: "text-emeraled-500" },
    { label: "Code Generation", key: "codeGeneration", icon: CodeIcon, href: "/code", color: "text-green-700" },
    { label: "Settings", key: "settings", icon: Settings, href: "/settings" }
];

type Language = 'en' | 'ar' | 'fr';

// Define the type for the translations object
type Translations = {
    [key in Language]: {
        askMaria: string;
        dashboard: string;
        conversation: string;
        imageGeneration: string;
        videoGeneration: string;
        musicGeneration: string;
        codeGeneration: string;
        settings: string;
    };
};

const translations: Translations = {
    en: { askMaria: "Ask Maria", dashboard: "Dashboard", conversation: "Conversation", imageGeneration: "Image Generation", videoGeneration: "Video Generation", musicGeneration: "Music Generation", codeGeneration: "Code Generation", settings: "Settings" },
    ar: { askMaria: "اسأل ماريا", dashboard: "لوحة القيادة", conversation: "محادثة", imageGeneration: "توليد الصور", videoGeneration: "توليد الفيديو", musicGeneration: "توليد الموسيقى", codeGeneration: "توليد الأكواد", settings: "الإعدادات" },
    fr: { askMaria: "PQ à Maria", dashboard: "Tableau de bord", conversation: "Conversation", imageGeneration: "Génération d'images", videoGeneration: "Génération vidéo", musicGeneration: "Génération de musique", codeGeneration: "Génération de code", settings: "Paramètres" }
};

const Sidebar = () => {
    const { language, setLanguage } = useLanguage(); // Use the language context
    const [showDropdown, setShowDropdown] = useState(false);
    const pathName = usePathname();

    const changeLanguage = (lang: Language) => {
        setLanguage(lang);
        setShowDropdown(false);
    };

    
    const getTranslatedText = (key: keyof typeof translations['en']) => {
        return translations[language][key] || key;
    };

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        <Image
                            fill
                            alt="Logo"
                            src="/logo.png"
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                    <h1 className={cn("flex text-2xl font-bold", montserrat.className)}>
                        {getTranslatedText("askMaria")}
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            href={route.href}
                            key={route.href}
                            className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition", pathName === route.href ? "text-white bg-white/10" : "text-zinc-400")}
                        >
                            <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                            {getTranslatedText(route.key as keyof typeof translations['en'])}
                        </Link>
                    ))}
                </div>
                <div className="relative mt-4">
                    <FaGlobe 
                        className="cursor-pointer text-2xl"
                        onClick={() => setShowDropdown(!showDropdown)} 
                    />
                    {showDropdown && (
                        <div className="absolute mt-2 w-32 bg-white text-black rounded shadow-lg">
                            <div className="cursor-pointer p-2 hover:bg-gray-200" onClick={() => changeLanguage("en")}>English</div>
                            <div className="cursor-pointer p-2 hover:bg-gray-200" onClick={() => changeLanguage("ar")}>Arabic</div>
                            <div className="cursor-pointer p-2 hover:bg-gray-200" onClick={() => changeLanguage("fr")}>French</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
