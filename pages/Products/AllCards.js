import ProductGridTemplate from '/components/ProductGridTemplate.js';
import { cardsDatabase } from '/assets/js/data/cards-database.js';

export default function ProductsIdCard() {
    ProductGridTemplate(
        cardsDatabase.idCards,
        '/card-details'
    );
}