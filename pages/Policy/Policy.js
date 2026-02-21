export default function Policy() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    // ===== Container =====
    const container = document.createElement('div');
    container.className = 'container my-5';

    // ===== Heading =====
    const heading = document.createElement('h1');
    heading.className = 'fw-bold mb-3 text-center';
    heading.textContent = 'Terms & Policies';
    container.appendChild(heading);

    const subHeading = document.createElement('p');
    subHeading.className = 'text-muted text-center mb-4';
    subHeading.textContent = 'Please read our policies carefully before placing an order.';
    container.appendChild(subHeading);

    // ===== Card Wrapper =====
    const row = document.createElement('div');
    row.className = 'row g-4';
    container.appendChild(row);

    // ===== Policies Data =====
    const policies = [
        {
            title: "1. Shipping / Delivery Charges",
            content: `
            <strong>English:</strong> Orders below 100 ID cards will have an additional delivery charge of ₹200.
            <br><br>
            <strong>हिन्दी:</strong> 100 कार्ड से कम ऑर्डर करने पर ₹200 डिलीवरी चार्ज अलग से लगेगा।
            `
        },
        {
            title: "2. Payment Policy",
            content: `
            <strong>English:</strong> Full payment must be completed at the time of delivery in the school.
            <br><br>
            <strong>हिन्दी:</strong> स्कूल में ऑर्डर डिलीवर होने पर पूरी पेमेंट करनी होगी।
            `
        },
        {
            title: "3. Cancellation Policy",
            content: `
            <strong>English:</strong> Orders cannot be cancelled once confirmed.
            <br><br>
            <strong>हिन्दी:</strong> ऑर्डर कन्फ़र्म होने के बाद कैंसिल नहीं किया जा सकता।
            `
        },
        {
            title: "4. Spelling & Printing Responsibility",
            content: `
            <strong>English:</strong> Any spelling mistakes or incorrect data will be the school's responsibility. 
            To maintain good relations, we can reprint up to 10 ID cards free of charge. 
            The school will be responsible for picking up the reprinted cards from the factory. 
            <br><br>
            <strong>हिन्दी:</strong> स्पेलिंग या डेटा की गलती की ज़िम्मेदारी स्कूल की होगी। 
            अच्छे संबंध बनाए रखने के लिए हम 10 कार्ड तक मुफ्त में दोबारा बना सकते हैं। 
            इन कार्ड्स की पिकअप की ज़िम्मेदारी स्कूल की होगी और स्कूल को कार्ड फैक्ट्री से खुद पिक करना होगा। 
            `
        },
        {
            title: "5. ID Card Delivery Time",
            content: `
            <strong>English:</strong> ID card orders will be delivered approximately within 7 days.
            <br><br>
            <strong>हिन्दी:</strong> कार्ड ऑर्डर लगभग 7 दिन में डिलीवर किया जाएगा।
            `
        },
        {
            title: "7. Acrylic ID Card Delivery Time",
            content: `
            <strong>English:</strong> Acrylic ID card orders will be delivered within 7 to 15 days depending on quantity.
            <br><br>
            <strong>हिन्दी:</strong> ऐक्रेलिक आईडी कार्ड का ऑर्डर मात्रा के हिसाब से 7 से 15 दिन में डिलीवर होगा।
            `
        },
        {
            title: "6. Polybag Minimum Quantity & Delivery",
            content: `
            <strong>English:</strong> Minimum quantity for polybag orders is 500 pieces. 
            Polybag orders will be delivered within approximately 10 days.
            <br><br>
            <strong>हिन्दी:</strong> पॉलीबैग की न्यूनतम मात्रा 500 होगी। 
            पॉलीबैग ऑर्डर लगभग 10 दिन में डिलीवर किया जाएगा।
            `
        },
    ];

    // ===== Create Cards =====
    policies.forEach(policy => {
        const col = document.createElement('div');
        col.className = 'col-md-6';

        const card = document.createElement('div');
        card.className = 'card h-100 shadow-sm border-0';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const title = document.createElement('h5');
        title.className = 'card-title fw-semibold mb-3';
        title.textContent = policy.title;

        const text = document.createElement('p');
        text.className = 'card-text';
        text.innerHTML = policy.content;

        cardBody.appendChild(title);
        cardBody.appendChild(text);
        card.appendChild(cardBody);
        col.appendChild(card);
        row.appendChild(col);
    });

    app.appendChild(container);
}