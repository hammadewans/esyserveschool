// assets/js/utils/pricing.js

export function getActivePrice(product, variant) {

    const now = new Date();
    const offerEnd = new Date(product.offerEndsAt);

    const isOfferActive = now < offerEnd;

    if (isOfferActive) {
        return {
            price: variant.pricing.discountPrice,
            originalPrice: variant.pricing.originalPrice,
            isDiscount: true
        };
    }

    return {
        price: variant.pricing.originalPrice,
        originalPrice: null,
        isDiscount: false
    };
}
