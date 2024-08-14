require('dotenv').config();

export function apiKeyMiddleware(req) {
    const apiKey = req.headers.get('api-key');
    // console.log(apiKey);

    if (!apiKey || apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
        return Promise.resolve(false);
    }else{
        return Promise.resolve(true);
    }
};
