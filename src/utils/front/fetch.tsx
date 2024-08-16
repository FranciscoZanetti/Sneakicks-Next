require('dotenv').config();

// const fetchData = async (url: string, expiryMinutes: number, dataEntity: string): Promise<void> => {
//     const now = new Date();
//     const expiryTime = now.getTime(); + expiryMinutes * 60 * 1000;

//     const response = await fetch(process.env.NEXT_PUBLIC_APP_BASE_URL + url);
//     const data = await response.json();

//     localStorage.setItem(dataEntity, JSON.stringify(data));
//     localStorage.setItem("expiryTime"+dataEntity, expiryTime.toString());
// };

// const getData = async (url: string, expiryMinutes: number, dataEntity: string): Promise<any> => {
//     const now = new Date();
//     const expiryTime = localStorage.getItem("expiryTime"+dataEntity);

//     if (expiryTime && now.getTime() < parseInt(expiryTime, 10)) {
//         return JSON.parse(localStorage.getItem(dataEntity) || "{}");
//     } else {
//         await fetchData(url, expiryMinutes, dataEntity);
//         return JSON.parse(localStorage.getItem(dataEntity) || "{}");
//     }
// };

// export default getData;

interface FetchOptions {
    seconds?: number;
    contentType?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: any;
}

// const baseUrl = `https://${process.env.VERCEL_URL}`;
const baseUrl = "https://sneakicks-next.vercel.app";

const fetchData = async (url: string, options: FetchOptions = {}) => {

    console.log("\nFETCHING\n");
    

    console.log(JSON.stringify(options));
    
    const isFormData = options?.body instanceof FormData;

    const headers: HeadersInit = {
        // 'Content-Type': options?.contentType ?? 'application/json',
        'api-key': `${process.env.NEXT_PUBLIC_API_KEY}`
    }

    if (!isFormData) {
        headers['Content-Type'] = options?.contentType ?? 'application/json';
    }

    const method = options?.method ?? 'GET';

    const methodChecker = (options?.method == 'GET' || options?.method == 'DELETE');

    let settings = {
        method: method,
        headers: headers,
        ...(isFormData ? { body: options.body } : !methodChecker && { body: options.body ? JSON.stringify(options.body) : undefined }),
        ...(options?.seconds && { next: { revalidate: options.seconds } })
    };

    console.log(process.env.NEXT_PUBLIC_API_KEY);
    
    console.log(baseUrl);

    try {
        const response = await fetch(baseUrl+"/api" + url, settings);
        console.log(response);
        const text = await response.json();
        console.log("\nRESPONSE.JSON():  ", text);
        return text;
    } catch (error) {
        console.log(error);
    }
}

export default fetchData;