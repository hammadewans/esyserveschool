import ProductDetailTemplate from '/components/ProductDetailTemplate.js';
import { polybagDatabase } from '/assets/js/data/polybag-database.js';

export default function ProductsPolybag(productId) {
    const id = productId?.replace(/^:/, "") || "";

    const product = polybagDatabase.polybags.find(p => p.id === id);

    ProductDetailTemplate(product);
}