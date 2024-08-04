"use client";

import * as z from "zod";
import HeadingPage from "../../../../components/Heading";
import { Download, ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import Empty from "@/components/empty";
import Image from "next/image";
import { useLanguage } from "@/components/contexts/LanguageContext";
import './style.css'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardFooter } from "@/components/ui/card";

// Define the type for the translations object
type Language = 'en' | 'ar' | 'fr';
type Translations = {
  [key in Language]: {
    title: string;
    description: string;
    placeholder: string;
    noImage: string;
    generate: string;
    upload: string;
    or: string;
    uploadPrompt: string;
    browse: string;
    noFileSelected: string;
    download: string; // Added key for download
  };
};

const downloadImage = (src, index) => {
  // Create a temporary link element
  const link = document.createElement('a');
  
  // Set the href to the image source
  link.href = src;
  
  // Set the download attribute with a filename
  link.download = `image_${index + 1}.png`;
  
  // Append the link to the body (necessary for Firefox)
  document.body.appendChild(link);
  
  // Trigger a click on the link to start the download
  link.click();
  
  // Remove the link from the body
  document.body.removeChild(link);
};
const translations: Translations = {
  en: {
    title: "Image",
    description: "Our most advanced Image model.",
    placeholder: "A picture of a horse in the desert",
    noImage: "No Image generated",
    generate: "Generate",
    upload: "Upload Image",
    or: "OR",
    uploadPrompt: "You can upload a picture to get the description from our artificial intelligence.",
    browse: "Browse",
    noFileSelected: "No file selected",
    download: "Download" // Added value for download
  },
  ar: {
    title: "صورة",
    description: "أحدث نموذج صورة لدينا.",
    placeholder: "صورة حصان في الصحراء",
    noImage: "لم يتم إنشاء أي صورة",
    generate: "توليد",
    upload: "تحميل الصورة",
    or: "أو",
    uploadPrompt: "يمكنك تحميل صورة للحصول على الوصف من ذكائنا الاصطناعي.",
    browse: "تصفح",
    noFileSelected: "لم يتم اختيار ملف",
    download: "تنزيل" // Added value for download
  },
  fr: {
    title: "Image",
    description: "Notre modèle d'image le plus avancé.",
    placeholder: "Une photo d'un cheval dans le désert",
    noImage: "Aucune image générée",
    generate: "Générer",
    upload: "Télécharger l'image",
    or: "OU",
    uploadPrompt: "Vous pouvez télécharger une image pour obtenir la description de notre intelligence artificielle.",
    browse: "Parcourir",
    noFileSelected: "Aucun fichier sélectionné",
    download: "Télécharger" // Added value for download
  }
};

const ImagePage = () => {
  const [images, setImages] = useState<string[]>([]);
  const [description, setDescription] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const router = useRouter();
  const { language } = useLanguage(); // Use the language context
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512"
    },
  });

  const isLoading = form.formState.isSubmitting;

  type FileInputProps = {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    noFileText: string;
  };

  const CustomFileInput: React.FC<FileInputProps> = ({ onChange, label, noFileText }) => {
    const [fileName, setFileName] = useState<string>(noFileText);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      setFileName(file ? file.name : noFileText);
      onChange(event);
    };

    return (
      <div>
        <label className="file-input-label">
          <input
            type="file"
            onChange={handleChange}
            className="file-input"
          />
          <span>{label}</span>
        </label>
        <p>{fileName}</p>
      </div>
    );
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setImages([]);
      setDescription(null);

      const options = {
        method: 'POST',
        url: 'https://text-to-image13.p.rapidapi.com/',
        headers: {
          'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
          'x-rapidapi-host': 'text-to-image13.p.rapidapi.com',
          'Content-Type': 'application/json',
          'Accept': 'image/png'
        },
        responseType: 'arraybuffer',
        data: {
          prompt: values.prompt,
          resolution: values.resolution // Send the resolution
        }
      };

      const response = await axios.request(options);

      // Convert binary data to a Base64-encoded string
      const base64Image = Buffer.from(response.data, 'binary').toString('base64');
      const imageUrl = `data:image/png;base64,${base64Image}`;

      setImages([imageUrl]);
      form.reset();
    } catch (error: any) {
      console.error('Error generating image:', error);
    } finally {
      router.refresh();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadImage(file);
    }
  };

  const uploadImage = async (file: File) => {
    const url = 'https://ai-api-photo-description.p.rapidapi.com/description-from-file';
    const data = new FormData();
    data.append('image', file);

    const API_KEY = process.env.NEXT_PUBLIC_PHOTO_DSC_API;
    const options = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'ai-api-photo-description.p.rapidapi.com',
      },
      body: data
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setDescription(result.caption);
      if (result.img) {
        setImages([result.img]);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const resolutionMap: { [key: string]: { width: number; height: number } } = {
    '256x256': { width: 256, height: 256 },
    '512x512': { width: 512, height: 512 },
    '1024x1024': { width: 1024, height: 1024 }
  };

  // Extract selected resolution
  const selectedResolution = form.watch('resolution') || '512x512';
  const { width, height } = resolutionMap[selectedResolution] || { width: 512, height: 512 };

  return (
    <div>
      <HeadingPage
        title={translations[language].title}
        description={translations[language].description}
        icon={ImageIcon}
        iconColor="text-blue-500"
        bgColor="bg-blue-500/10"
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-6">
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
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-2">
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {amountOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resolution"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-4">
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {resolutionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading}
              type="submit"
              className="col-span-12 lg:col-span-2"
            >
              {isLoading ? 'Loading...' : translations[language].generate}
            </Button>
          </form>
        </Form>
        <div className="flex flex-col mt-4">
          <h2>{translations[language].or}</h2>
          <p className="text-sm mb-4">
            {translations[language].uploadPrompt}
          </p>
          <CustomFileInput
            onChange={handleFileChange}
            label={translations[language].browse}
            noFileText={translations[language].noFileSelected}
          />
        </div>
        <div className="space-y-4 mt-4">
          {images.length === 0 && description === null ? (
            <Empty label={translations[language].noImage} />
          ) : (
            <>
              {images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {images.map((src, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg"
                      style={{ width: `${width}px`, height: `${height}px` }} // Set dimensions dynamically
                    >
                      <Image

                        src={src}
                        alt="Image"
                        layout="responsive"
                        width={width}
                        height={height}
                        className="rounded-lg object-cover"
                      />
                      
                      <CardFooter className="p-2">
                      <Button
              onClick={() => downloadImage(src, index)}
              variant="secondary"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2"/>
              {translations[language].download}
            </Button>
                      </CardFooter>
                      

                    </div>
                  ))}
                </div>
              )}
              {description && (
                <div className="p-4 w-full rounded-lg bg-muted">
                  <p>{description}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
