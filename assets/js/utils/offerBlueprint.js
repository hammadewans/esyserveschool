// assets/js/utils/offerBlueprint.js

/**
 * Returns full offer info for a **mandatory variant**
 * Throws warning if variant not provided
 *
 * Output:
 * offerActive: true/false
 * price: current price
 * originalPrice: if discount
 * discountPercent: %
 * timeLeft: { days, hours, minutes, seconds }
 */
export function getOfferBlueprint(product, variant) {
    if (!variant) {
        console.warn("Variant is mandatory for this product!");
        return {
            offerActive: false,
            price: 0,
            originalPrice: null,
            discountPercent: 0,
            timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 }
        };
    }

    const now = new Date();
    const offerEnd = product.offerEndsAt ? new Date(product.offerEndsAt) : null;

    // Pricing source comes ONLY from variant
    const pricing = variant.pricing;

    if (!pricing || !pricing.originalPrice) {
        return {
            offerActive: false,
            price: 0,
            originalPrice: null,
            discountPercent: 0,
            timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 }
        };
    }

    // Offer active only if discountPrice exists and offerEnd not passed
    const offerActive = offerEnd instanceof Date && !isNaN(offerEnd)
        ? now < offerEnd && pricing.discountPrice != null
        : false;

    // Price logic
    const price = offerActive ? pricing.discountPrice : pricing.originalPrice;
    const originalPrice = offerActive ? pricing.originalPrice : null;

    // Discount %
    let discountPercent = 0;
    if (offerActive && originalPrice > price) {
        discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
    }

    // Time left calculation
    const timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    if (offerActive && offerEnd) {
        let diff = offerEnd - now;
        if (diff > 0) {
            timeLeft.days = Math.floor(diff / (1000 * 60 * 60 * 24));
            timeLeft.hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
            timeLeft.minutes = Math.floor(diff / (1000 * 60)) % 60;
            timeLeft.seconds = Math.floor(diff / 1000) % 60;
        }
    }

    return {
        offerActive,
        price,
        originalPrice,
        discountPercent,
        timeLeft
    };
}