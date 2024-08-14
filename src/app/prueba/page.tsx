"use client"
import { useEdgeStore } from "@/libs/edgestore";
import Link from "next/link";
import { useState } from "react";

export default function Prueba() {
    const [file, setFile] = useState<File>();
    const [urls, setUrls] = useState<{ url: string, thumbnailUrl: string | null; }>();
    const [progress, setProgress] = useState(0);
    const { edgestore } = useEdgeStore();

    return (
        <div className="flex flex-col items-center m-6 gap-2">
            <input type="file" onChange={(e) => {
                setFile(e.target.files?.[0]);
            }}/>
            <div className="h-[6px] w-44 border rounded overflow-hidden">
                <div 
                    className="h-full bg-white transition-all duration-150"
                    style={{
                        width: `${progress}%`
                    }}
                />
            </div>
            <button className="bg-white text-black rounded px-2 hover:opacity-80"
                onClick={async () => {
                    if (file) {
                        const res = await edgestore.products.upload({
                            file,
                            input: { type: "designs"},
                            onProgressChange: (progress) => {
                                setProgress(progress);
                            }
                        });
                        //logica personal
                        setUrls({
                            url: res.url,
                            thumbnailUrl: res.thumbnailUrl,
                        })
                    }
                }}
            >
                Upload
            </button>
            {urls?.url && <Link href={urls.url} target="_blank">URL</Link>}
            {urls?.thumbnailUrl && <img src={urls.thumbnailUrl}></img>}
        </div>
    )
}