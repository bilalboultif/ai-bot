// "use client";

// import * as z from "zod";
// import HeadingPage from "@/components/Heading";
// import {  Music } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { formSchema } from "./constants";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import axios from "axios";
// import Empty from "@/components/empty";
// import Loader from "@/components/loader";

// import { useLanguage } from "@/components/contexts/LanguageContext";

// // Define the type for the translations object
// type Language = 'en' | 'ar' | 'fr';
// type Translations = {
//   [key in Language]: {
//     title: string;
//     description: string;
//     placeholder: string;
//     noMusic: string;
//     generate: string;
//   };
// };

// const translations: Translations = {
//   en: {
//     title: "Music",
//     description: "Turn your prompt into music.",
//     placeholder: "quran listen",
//     noMusic: "No quran started",
//     generate: "Generate"
//   },
//   ar: {
//     title: "محادثة",
//     description: "أحدث نموذج محادثة لدينا.",
//     placeholder: "كيف يمكنني مساعدتك؟",
//     noMusic: "لم تبدأ أي محادثة",
//     generate: "توليد"
//   },
//   fr: {
//     title: "Music",
//     description: "Notre modèle de Music le plus avancé.",
//     placeholder: "Comment puis-je vous aider?",
//     noMusic: "Aucune Music commencée",
//     generate: "Générer"
//   }
// };

// function normalizeAndEncode(text) {
//   try {
//       // Convert the text to a JSON string if it's not already a string
//       let result = JSON.stringify(text);
//       if (/^[\{\[]/.test(result)) {
//           text = result;
//       }
//   } catch (e) {
//       // Handle any errors during JSON conversion
//   }

//   // Encode the text for safe use in URLs
//   return encodeURIComponent(String(text))
//       .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
// }

// const MusicPage = () => {
//   const [music, setMusic] = useState<string>();
//   const router = useRouter();
//   const { language } = useLanguage(); // Use the language context
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       prompt: "",
//     },
//   });

//   const isLoading = form.formState.isSubmitting;

//   const processResponse = (responseText: string) => {
//     const lines = responseText.split('\n');
//     const formattedText = lines.map(line => {
//       let formattedLine = line.replace(/ \* /g, '<br>');
//       formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
//       const boldedLine = formattedLine.replace(/\*\*(\w+.*?)(?=\*\*)/g, '<b>$1</b>');
//       if (boldedLine.trim().startsWith('* ')) {
//         return `<div style="padding: 5px; border-radius: 4px;">
//                   ${boldedLine.substring(2).trim()}
//                 </div>`;
//       }
//       if (boldedLine.includes('<b>')) {
//         return `<div style="padding: 5px; border-radius: 4px;">
//                   ${boldedLine}
//                 </div>`;
//       }
//       return `<div>${boldedLine}</div>`;
//     }).join('<br>');
  
//     return formattedText;
//   };
  
  
//   const [searchText, setSearchText] = useState('');
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSearch = async () => {
//     setLoading(true);
//     setError(null);
//     setResults([]);

//     try {
//         const totalAyahs = 6236; // Example total number of ayahs; adjust as needed
//         const normalizedSearchText = normalizeAndEncode(searchText.trim());

//         const foundVerses = [];

//         for (let ayah = 1; ayah <= totalAyahs; ayah++) {
//             try {
//                 const response = await axios.get(`https://api.alquran.cloud/v1/ayah/${ayah}`);
//                 const verse = response.data.data;
//                 const normalizedVerseText = normalizeAndEncode(verse.text.trim());

//                 // Check if the normalized search text is included in the normalized verse text
//                 if (normalizedVerseText.includes(normalizedSearchText)) {
//                     foundVerses.push({
//                         ayahNumber: ayah,
//                         text: verse.text,
//                         surahName: verse.surah.name,
//                         englishName: verse.surah.englishName,
//                         page: verse.page,
//                     });
//                 }
//             } catch (err) {
//                 console.error(`Failed to fetch ayah ${ayah}:`, err);
//             }
//         }

//         setResults(foundVerses);
//     } catch (err) {
//         setError('Error fetching data');
//     } finally {
//         setLoading(false);
//     }
// };


//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//      setMusic(undefined)
      
//       const response = await axios.post("/api/music", values);
  
//       const processedResponse = processResponse(response.data.text);
  
//      setMusic(response.data.audio)
//       form.reset();
//     } catch (error: any) {
//       console.log(error);
//     } finally {
//       router.refresh();
//     }
//   };

//   return (
//     <div>
//       <HeadingPage
//         title={translations[language].title}
//         description={translations[language].description}
//         icon={Music}
//         iconColor="text-emerald-500"
//         bgColor="bg-emerald-500/10"
//       />
//       <div className="px-4 lg:px-8">
//         <div>
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(onSubmit)}
//               className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
//             >
//               <FormField
//                 name="prompt"
//                 render={({ field }) => (
//                   <FormItem className="col-span-12 lg:col-span-10">
//                     <FormControl className="m-0 p-0">
//                       <Input
//                         className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
//                         disabled={isLoading}
//                         placeholder={translations[language].placeholder}
//                         {...field}
//                       />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//               <Button
//                 className="col-span-12 lg:col-span-2 w-full"
//                 disabled={isLoading}
//               >
//                 {translations[language].generate}
//               </Button>
//             </form>
//           </Form>
//         </div>
//         <div className="space-y-4 mt-4">
//           {isLoading && (
//             <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
//               <Loader />
//             </div>
//           )}
//           {!music && !isLoading && (
//             <div>
//               <Empty label={translations[language].noMusic} />
//             </div>
//           )}
//          <div>
//       <h1>Search Quranic Verses by Text</h1>
//       <input
//         type="text"
//         value={searchText}
//         onChange={(e) => setSearchText(e.target.value)}
//         placeholder="Enter text to search"
//       />
//       <button onClick={handleSearch} disabled={loading}>
//         {loading ? 'Searching...' : 'Search'}
//       </button>

//       {error && <p>{error}</p>}
//       {results.length > 0 && (
//         <div>
//           <h2>Search Results</h2>
//           <ul>
//             {results.map((verse, index) => (
//               <li key={index}>
//                 <p><strong>Ayah Number:</strong> {verse.ayahNumber}</p>
//                 <p><strong>Text:</strong> {verse.text}</p>
//                 <p><strong>Surah Name:</strong> {verse.surahName}</p>
//                 <p><strong>English Name:</strong> {verse.englishName}</p>
//                 <p><strong>Page:</strong> {verse.page}</p>
//                 <hr />
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MusicPage;

"use client";

import * as z from "zod";
import HeadingPage from "@/components/Heading";
import { Music } from "lucide-react";
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
    noMusic: string;
    generate: string;
  };
};

const translations: Translations = {
  en: {
    title: "Music",
    description: "Turn your prompt into music.",
    placeholder: "quran listen",
    noMusic: "No music generated",
    generate: "Generate"
  },
  ar: {
    title: "موسيقى",
    description: "حول طلبك إلى موسيقى.",
    placeholder: "استمع إلى القرآن",
    noMusic: "لم يتم إنشاء موسيقى",
    generate: "توليد"
  },
  fr: {
    title: "Musique",
    description: "Transformez votre demande en musique.",
    placeholder: "écouter le coran",
    noMusic: "Aucune musique générée",
    generate: "Générer"
  }
};

const MusicPage = () => {
  const [music, setMusic] = useState<string | undefined>(undefined);
  const router = useRouter();
  const { language } = useLanguage();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setMusic(undefined);
      console.log('Form Values:', values);

      const response = await axios.post("/api/music", values);
      console.log('API Response:', response.data);

      if (response.data && response.data.audio) {
        setMusic(response.data.audio);
      } else {
        console.error('Audio URL not found in response.');
      }
      form.reset();
    } catch (error) {
      console.error('Error during submission:', error);
    } finally {
      router.refresh();
    }
  };

  useEffect(() => {
    console.log('Current Music State:', music);
  }, [music]);

  return (
    <div>
      <HeadingPage
        title={translations[language].title}
        description={translations[language].description}
        icon={Music}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
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
          {!music && !isLoading && (
            <div>
              <Empty label={translations[language].noMusic} />
            </div>
          )}
          {music && (
            <audio controls className="w-full mt-8" onError={(e) => console.error('Audio playback error:', e)}>
              <source src={music} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
