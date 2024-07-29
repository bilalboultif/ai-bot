"use client";

import * as z from "zod";
import HeadingPage from "@/components/Heading";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import Empty from "@/components/empty";
import Loader from "@/components/loader";
import UserAvatar from "@/components/user-avatar";
import BotAvatar from "@/components/bot-avatar";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/contexts/LanguageContext";

// Define the type for the translations object
type Language = 'en' | 'ar' | 'fr';
type Translations = {
  [key in Language]: {
    title: string;
    description: string;
    placeholder: string;
    noConversation: string;
    generate: string;
  };
};

const translations: Translations = {
  en: {
    title: "Conversation",
    description: "Our most advanced conversation model.",
    placeholder: "How can I help you?",
    noConversation: "No conversation started",
    generate: "Generate"
  },
  ar: {
    title: "محادثة",
    description: "أحدث نموذج محادثة لدينا.",
    placeholder: "كيف يمكنني مساعدتك؟",
    noConversation: "لم تبدأ أي محادثة",
    generate: "توليد"
  },
  fr: {
    title: "Conversation",
    description: "Notre modèle de conversation le plus avancé.",
    placeholder: "Comment puis-je vous aider?",
    noConversation: "Aucune conversation commencée",
    generate: "Générer"
  }
};

const ConversationPage = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const router = useRouter();
  const { language } = useLanguage(); // Use the language context
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const processResponse = (responseText: string) => {
    const lines = responseText.split('\n');
    const formattedText = lines.map(line => {
      let formattedLine = line.replace(/ \* /g, '<br>');
      formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
      const boldedLine = formattedLine.replace(/\*\*(\w+.*?)(?=\*\*)/g, '<b>$1</b>');
      if (boldedLine.trim().startsWith('* ')) {
        return `<div style="padding: 5px; border-radius: 4px;">
                  ${boldedLine.substring(2).trim()}
                </div>`;
      }
      if (boldedLine.includes('<b>')) {
        return `<div style="padding: 5px; border-radius: 4px;">
                  ${boldedLine}
                </div>`;
      }
      return `<div>${boldedLine}</div>`;
    }).join('<br>');
  
    return formattedText;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage = {
        role: "user",
        content: values.prompt,
      };
  
      const newMessages = [...messages, userMessage];
      
      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });
  
      const processedResponse = processResponse(response.data.text);
  
      setMessages((current) => [
        ...current,
        userMessage,
        { role: "bot", content: processedResponse }
      ]);
      form.reset();
    } catch (error: any) {
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <HeadingPage
        title={translations[language].title}
        description={translations[language].description}
        icon={MessageSquare}
        iconColor="text-blue-500"
        bgColor="bg-blue-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder={translations[language].placeholder}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                {translations[language].generate}
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <div>
              <Empty label={translations[language].noConversation} />
            </div>
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user" ? "bg-white border border-black/10" : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <p className="text-sm" dangerouslySetInnerHTML={{ __html: message.content }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
