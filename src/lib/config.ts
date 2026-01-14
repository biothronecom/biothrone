
export const siteConfig = {
    appName: "Bio-Throne™",
    appDescription: "Bio-Throne™: A natural solution for fresh, clean toilets. Safe for you, your septic system, and the planet.",
    appUrl: "https://biothrone.com",
    supportPhoneNumber: "1234567890", // IMPORTANT: Replace with the actual WhatsApp number
    paypal: {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
        planId: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID || '',
    },
    analytics: {
        googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
        metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
        pinterestTagId: process.env.NEXT_PUBLIC_PINTEREST_TAG_ID || '',
        redditPixelId: process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID || '',
    },
    facebook: {
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
        pageUrl: 'https://www.facebook.com/facebook', // Placeholder for your actual Facebook Page URL
    },
    social: {
        instagram: 'https://www.instagram.com/your-profile',
        tiktok: 'https://www.tiktok.com/@your-profile',
        pinterest: 'https://www.pinterest.com/your-profile',
        reddit: 'https://www.reddit.com/r/your-subreddit',
    },
    blogUrl: 'https://your-blogger-url.blogspot.com',
}
