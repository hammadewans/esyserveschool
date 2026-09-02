import ProductDetailTemplate from '/components/ProductDetailTemplate.js';
import { diaryDatabase } from '/assets/js/data/diary-database.js';

export default function ProductsDiaryDetails(productId) {
    const id = productId?.replace(/^:/, "") || "";

    const product = diaryDatabase.diaries.find(p => p.id === id);

    ProductDetailTemplate(product);
}