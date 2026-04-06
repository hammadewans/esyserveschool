import ProductGridTemplate from '/components/ProductGridTemplate.js';
import { diaryDatabase } from '/assets/js/data/diary-database.js';

export default function ProductsDiary() {
    ProductGridTemplate(
        diaryDatabase.diaries,
        '/diary-details'
    );
}