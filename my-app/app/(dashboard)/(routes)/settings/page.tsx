

import React, { useEffect, useState } from "react";
import HeadingPage from "../../../../components/Heading";
import { Settings } from "lucide-react";
import { useLanguage } from "@/components/contexts/LanguageContext";

import { checkSubscription } from '@/lib/subscription';
import { SubscriptionButton } from "@/components/subscription-button";

// Define the type for the translations object
type Language = 'en' | 'ar' | 'fr';
type Translations = {
  [key in Language]: {
    title: string;
    description: string;
  };
};

const translations: Translations = {
  en: {
    title: "Settings",
    description: "Manage account settings"
  },
  ar: {
    title: "الإعدادات",
    description: "إدارة إعدادات الحساب"
  },
  fr: {
    title: "Paramètres",
    description: "Gérer les paramètres du compte"
  }
};

const SettingPage = async () => {

  const isPro = await checkSubscription();



  return (
    <div>
      <HeadingPage
        title="Settings"
        description="Manage account settings"
        icon={Settings}
        iconColor="text-blue-500"
        bgColor="bg-blue-500/10"
      />
      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm">
          {isPro === null
            ? "Loading..."
            : isPro
            ? "You are currently on a pro plan."
            : "You are currently in a free plan"}
        </div>
        <SubscriptionButton isPro={isPro}/>
      </div>
    
    </div>
  );
};

export default SettingPage;
