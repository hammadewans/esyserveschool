import ProductDetailTemplate from '/components/ProductDetailTemplate.js';
import { notebookDatabase } from '/assets/js/data/notebook-database.js';

export default function ProductsNotebookDetails(productId) {
    const id = productId?.replace(/^:/, "") || "";

    const product = notebookDatabase.notebooks.find(p => p.id === id);

    ProductDetailTemplate(product);
}