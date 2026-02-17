export default function ProductsNotebook() {
    const app = document.getElementById('app');
    app.innerHTML = ''; // Clear previous content

    // ===== Card-like container (small & narrow) =====
    const card = document.createElement('div');
    card.style.background = '#fff';
    card.style.padding = '20px 15px';
    card.style.borderRadius = '12px';
    card.style.boxShadow = '0 6px 15px rgba(0,0,0,0.08)';
    card.style.textAlign = 'center';
    card.style.maxWidth = '400px'; // narrow card
    card.style.width = '100%';
    card.style.border = '2px dashed #ff9800';
    card.style.margin = '50px auto 0 auto'; // top margin + horizontally centered

    // ===== Emoji / Icon =====
    const icon = document.createElement('div');
    icon.style.fontSize = '40px';
    icon.style.marginBottom = '15px';
    icon.textContent = '🚧';

    // ===== Heading =====
    const heading = document.createElement('h2');
    heading.style.fontSize = '24px';
    heading.style.fontWeight = '700';
    heading.style.marginBottom = '10px';
    heading.style.color = '#333';
    heading.textContent = 'Construction in Progress';

    // ===== Description =====
    const description = document.createElement('p');
    description.style.fontSize = '14px';
    description.style.lineHeight = '1.5';
    description.style.color = '#555';
    description.innerHTML = `
        We are working hard to bring you something amazing! <br>
        This section is currently under construction. <br>
        Please check back soon for new updates and features.
    `;

    // ===== Append elements =====
    card.appendChild(icon);
    card.appendChild(heading);
    card.appendChild(description);
    app.appendChild(card);
}
