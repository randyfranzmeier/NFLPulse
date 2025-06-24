"use client"

type ErrorProps = {
    msg: string;
}

export default function Error({msg}: ErrorProps) {

    return (
        <div className="w-full h-full bg-gray-200 p-3 lg:p-6">
            <p className="text-lg text-red-600">{msg}</p>
        </div>
    );
}