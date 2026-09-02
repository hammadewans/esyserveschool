import ProductDetailTemplate from '/components/ProductDetailTemplate.js';
import { cardsDatabase } from '/assets/js/data/cards-database.js';

export default function ProductsIdCard(productId) {
    const id = productId?.replace(/^:/, "") || "";
    const product = cardsDatabase.idCards.find(p => p.id === id);

    ProductDetailTemplate(product, {
        hasVariants: true
    });
}