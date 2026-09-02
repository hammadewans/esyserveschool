import ProductGridTemplate from '/components/ProductGridTemplate.js';
import { polybagDatabase } from '/assets/js/data/polybag-database.js';

export default function ProductsPolybag() {
    ProductGridTemplate(
        polybagDatabase.polybags,
        '/polybag-details'
    );
}