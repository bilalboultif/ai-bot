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
import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

type Language = 'en' | 'ar' | 'fr';



const translations = {
  en: {
    title: "Conversation",
    description: "Engage in a meaningful conversation.",
    placeholder: "Type your message here...",
    noCodeGeneration: "No conversation started",
    generate: "Start Conversation"
  },
  ar: {
    title: "محادثة",
    description: "الانخراط في محادثة ذات مغزى.",
    placeholder: "اكتب رسالتك هنا...",
    noCodeGeneration: "لم تبدأ أي محادثة",
    generate: "ابدأ المحادثة"
  },
  fr: {
    title: "Conversation",
    description: "Engagez-vous dans une conversation significative.",
    placeholder: "Tapez votre message ici...",
    noCodeGeneration: "Aucune conversation commencée",
    generate: "Démarrer la conversation"
  }
};

const CodePage = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const router = useRouter();
  const { language } = useLanguage();

  // Ensure 'language' is of type 'Language'
  if (!['en', 'ar', 'fr'].includes(language)) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

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
  
      setMessages((current) => [
        ...current,
        userMessage,
        { role: "bot", content: response.data.text }
      ]);
      form.reset();
    } catch (error: any) {
      if (error.response && error.response.data) {
        const userMessage = {
          role: "user",
          content: values.prompt,
        };
        const errorMessage = error.response.data || 'An error occurred.';
        
        setMessages((current) => [
          ...current,
          userMessage,
          { role: "bot", content: errorMessage }
        ]);
        form.reset();
      } else {
        console.log('Unexpected Error:', error.message);
        alert('An unexpected error occurred.');
      }
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
              <Empty label={translations[language].noCodeGeneration} />
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
                <ReactMarkdown
                  components={{
                    pre: ({ node, ...props }) => (
                      <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg relative">
                        <pre {...props} />
                      </div>
                    ),
                    code: ({ node, ...props }) => {
                      const codeString = (props.children as string).toString();
                      return (
                        <div className="relative">
                          <CopyButton text={codeString} />
                          <code className="bg-black/10 rounded-lg p-1" {...props} />
                        </div>
                      );
                    },
                  }}
                  className="text-sm overflow-hidden leading-7"
                >
                  {message.content || ""}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePage;
