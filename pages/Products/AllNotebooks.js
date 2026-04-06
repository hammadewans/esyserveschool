import ProductGridTemplate from '/components/ProductGridTemplate.js';
import { notebookDatabase } from '/assets/js/data/notebook-database.js';

export default function ProductsNotebook() {
    ProductGridTemplate(
        notebookDatabase.notebooks,
        '/notebook-details'
    );
}