// assets/js/data/polybags-database.js

export const polybagDatabase = {
    polybags: [
        {
            id: "polybag-14x18",
            name: "Custom Printed Non Woven Bag 14x18 Inch",
            description: "High-quality non woven fabric bag with custom school name, address and text printing. Ideal for books, uniforms and admission kits.",
            image: "assets/images/polybag14x18.png",
            offerEndsAt: "2026-09-01T00:00:00",
            specifications: {
                Size: "14x18 Inch",
                Material: "Non Woven Fabric",
                Weight: "Approx 40gm",
                Printing: "School Name, Address & Custom Text Print",
                Handle: "Stitched Fabric Handle",
                Eco_Friendly: "Reusable & Recyclable",
                Print_Mode: "Single Color Screen Print"
            },
            variants: [
                { id: "v1", title: "14x18 Non Woven Bag", subtitle: "Standard Print", pricing: { originalPrice: 14, discountPrice: 9.5 }, inStock: true }
            ]
        },
        {
            id: "polybag-16x20",
            name: "Custom Printed Non Woven Bag 16x20 Inch",
            description: "Premium quality large size non woven fabric bag with custom school name, address and text printing. Durable and reusable for bulk distribution.",
            image: "assets/images/polybag16x20.png",
            offerEndsAt: "2026-09-01T00:00:00",
            specifications: {
                Size: "16x20 Inch",
                Material: "Non Woven Fabric",
                Weight: "Approx 50gm",
                Printing: "School Name, Address & Custom Text Print",
                Handle: "Stitched Fabric Handle",
                Eco_Friendly: "Reusable & Recyclable",
                Print_Mode: "Single Color Screen Print"
            },
            variants: [
                { id: "v1", title: "16x20 Non Woven Bag", subtitle: "Standard Print", pricing: { originalPrice: 15, discountPrice: 10.5 }, inStock: true }
            ]
        }
    ]
};