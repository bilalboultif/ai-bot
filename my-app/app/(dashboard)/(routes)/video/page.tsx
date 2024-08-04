"use client";

import * as z from "zod";
import HeadingPage from "@/components/Heading";
import { VideoIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Empty from "@/components/empty";
import Loader from "@/components/loader";

import { useLanguage } from "@/components/contexts/LanguageContext";

// Define the type for the translations object
type Language = 'en' | 'ar' | 'fr';
type Translations = {
  [key in Language]: {
    title: string;
    description: string;
    placeholder: string;
    noVideo: string;
    generate: string;
  };
};

const translations: Translations = {
  en: {
    title: "Video",
    description: "Turn your prompt into Video.",
    placeholder: "big wave in the ocean",
    noVideo: "No Video generated",
    generate: "Generate"
  },
  ar: {
    title: "فيديو",
    description: "حول طلبك إلى فيديو.",
    placeholder: "موجة كبيرة في المحيط",
    noVideo: "لم يتم إنشاء فيديو",
    generate: "توليد"
  },
  fr: {
    title: "Vidéo",
    description: "Transformez votre demande en vidéo.",
    placeholder: "grande vague dans l'océan",
    noVideo: "Aucune vidéo générée",
    generate: "Générer"
  }
};

const VideoPage = () => {
  const [video, setVideo] = useState<string | undefined>(undefined);
  const router = useRouter();
  const { language } = useLanguage();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setVideo(undefined);
      console.log('Form Values:', values);

      const response = await axios.post("/api/video", values);
      console.log('API Response:', response.data);

      if (response.data && response.data.video) {
        setVideo(response.data.video);
      } else {
        console.error('Video URL not found in response.');
      }
      form.reset();
    } catch (error) {
      console.error('Error during submission:', error);
    } finally {
      router.refresh();
    }
  };

  useEffect(() => {
    console.log('Current Video State:', video);
  }, [video]);

  return (
    <div>
      <HeadingPage
        title={translations[language].title}
        description={translations[language].description}
        icon={VideoIcon}
        iconColor="text-orange-700"
        bgColor="bg-orange-700/10"
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
          {!video && !isLoading && (
            <div>
              <Empty label={translations[language].noVideo} />
            </div>
          )}
          {video && (
            <video controls className="w-full mt-8 aspect-video rounded-lg border bg-black" onError={(e) => console.error('Video playback error:', e)}>
              <source src={video} />
              Your browser does not support the video element.
            </video>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
