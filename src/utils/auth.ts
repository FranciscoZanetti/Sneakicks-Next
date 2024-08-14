import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = 'secret';
const key = new TextEncoder().encode(secretKey);

async function encrypt(payload: any) {
    return await new SignJWT(payload)
     .setProtectedHeader({ alg: 'HS256'})
     .setIssuedAt()
     .setExpirationTime('30 min from now')
     .sign(key);
}

async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    });
    return payload;
}


async function setSessionCookie(user: any) {
    const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
    const session = await encrypt({ user });

    cookies().set('session', session, { expires: expires, httpOnly: true });
}


async function getSession() {
    const session = cookies().get('session')?.value;
    if (!session) return null;
    return await decrypt(session);
}


async function updateSession(user: any) {
    const expires = new Date(Date.now() + 30 * 60 * 1000);
    const session = await encrypt({ user });
    const res = NextResponse.next();
    res.cookies.set({
        name: 'session',
        value: await encrypt(session),
        expires: expires,
        httpOnly: true,
    });
    return res;
}


async function clearSessionCookie() {
    cookies().set('session', '', { expires: new Date(0) });
}


const authUtils = {
    decrypt,
    encrypt,
    getSession,
    setSessionCookie,
    updateSession,
    clearSessionCookie
}


export default authUtils;