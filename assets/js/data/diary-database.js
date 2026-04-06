// assets/js/data/diaries-database.js

export const diaryDatabase = {
    diaries: [
        {
            id: "diary-120pages",
            name: "School Diary 120 Pages",
            description: "High-quality school diary designed for students with daily writing space, school rules, and important information sections. Durable and perfect for everyday school use.",
            image: "assets/images/diary.webp",
            offerEndsAt: "2026-09-01T00:00:00",
            specifications: {
                Size: "8.25 x 5.5 Inch",
                Pages: "120 Pages",
                Paper: "60 GSM",
                Binding: "Dual Pin Binding",
                Cover: "Soft Printed Cover",
                Print_Type: "Screen Print (Single Color)",
                Usage: "Daily School Use",
                Sections: "Student Info, Rules, Holidays, Notes"
            },
            variants: [
                {
                    id: "v1",
                    title: "120 Pages Diary",
                    subtitle: "Student Info, Rules, Holidays, Notes",
                    pricing: { originalPrice: 35, discountPrice: 28 },
                    inStock: true
                }
            ]
        }
    ]
};