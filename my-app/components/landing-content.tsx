'use client'

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"


const testimonials = [
    {
        name: "Bilal",
        avatar: "A",
        title: "Software Engineer",
        description: "This application has completely transformed the way I work. It's incredibly efficient and user-friendly!"
    },
    {
        name: "Baha",
        avatar: "A",
        title: "Web Developer",
        description: "I absolutely love this app! It’s intuitive and has significantly boosted my productivity."
    },
    {
        name: "Farouk",
        avatar: "A",
        title: "Accounting",
        description: "The app is exceptionally easy to use and has become an invaluable tool in my daily tasks. Highly recommended!"
    },
    {
        name: "Moussa",
        avatar: "A",
        title: "IT Support Engineer",
        description: "This app is phenomenal! It’s intuitive, reliable, and has exceeded all my expectations."
    },
    {
        name: "Tahar",
        avatar: "A",
        title: "IT Manager",
        description: "Fantastic job with this application. It’s robust, efficient, and delivers exactly what I need."
    }
];
export const LandingContent = () => {
    return (
        <div className="px-10 pb-20">
            <h2 className="text-centwe text-4xl text-white font-extrabold mb-10">
            Client Experiences
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {testimonials.map((item) => (
                    <Card
                    key={item.description} className="bg-[#192339] border-none text-white"
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-x-2">
                                <div>
                                    <p className="text-lg">{item.name}</p>
                                    <p className="text-zinc-400 text-sm">{item.title}</p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 px-0">
                            {item.description}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}