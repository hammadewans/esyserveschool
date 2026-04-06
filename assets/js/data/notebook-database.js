// assets/js/data/notebooks-database.js

export const notebookDatabase = {
    notebooks: [
        {
            id: "notebook-120pages",
            name: "School Notebook 120 Pages (9.5 x 6.5 Inch)",
            description: "Compact size notebook specially designed for school students with smooth writing paper and durable binding. Ideal for classwork and homework use.",
            image: "assets/images/notebook.png",
            offerEndsAt: "2026-09-01T00:00:00",
            specifications: {
                Size: "9.5 x 6.5 Inch",
                Pages: "120 Pages",
                Paper: "60 GSM",
                Binding: "Dual Pin Binding",
                Cover: "Soft Printed Cover",
                Print_Type: "Screen Print (Single Color)",
                Usage: "Daily School Use",
                Edges: "Smooth Cut",
                Ruling: "Single Line / Double Line / Plain"
            },
            variants: [
                {
                    id: "v1",
                    title: "120 Pages Notebook",
                    subtitle: "Single Line / Double Line / Plain",
                    pricing: { originalPrice: 26, discountPrice: 22 },
                    inStock: true
                }
            ]
        }
    ]
};