import { useProModal } from "@/hooks/use-pro-modal"
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog"
import { DialogContent } from "./dialog"
import { Badge } from "./badge"
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Code, ImageIcon, MessageSquare, Music, Video, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/contexts/LanguageContext";
import { Button } from "./button";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

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

export const ProModal = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const onSubcribe = async () => {
        try {
            setLoading(true)
            const response = axios.get("/api/stripe")

            window.location.href = (await response).data.url
        } catch (error) {
            toast.error("STRIP_CLIENT_ERROR")
        } finally {
            setLoading(false)
        }
    }
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
    const proModal = useProModal()
    return (
        <Dialog open={proModal.isOpen} onOpenChange={(proModal.onClose)}>
           <DialogContent>
             <DialogHeader>
                <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pd-2">
                    <div className="flex item-center gap-x-2 font-blod p-1">
                        Upgrade to Maria
                    <Badge variant="premium" className="uppercase text-sm py-1">
                        pro
                    </Badge> 
                    </div>
                   
                </DialogTitle>
                <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
                    {tools.map((tool) => (
                        <Card
                            key={tool.label}
                            className="p-3 border-black/5 flex items-center justify-between"
                        >
                            <div className="flex text-center gap-x-4">
                                <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                                    <tool.icon className={cn("w-6 h-6", tool.bgColor)} />
                                </div>
                                <div>
                                    {tool.label}
                                </div>
                            </div>
                            <Check className="text-primary w-5 h-5"/>
                        </Card>
                    ))}
                </DialogDescription>
             </DialogHeader>
             <DialogFooter >
                <Button 
                disabled={loading}
                onClick={onSubcribe} className="w-full" variant="premium" size="lg">
                    Upgrade
                    <Zap className="w-4 h-4 ml-2 fill-white"/>
                </Button>
             </DialogFooter>
           </DialogContent>
        </Dialog>
    )
}