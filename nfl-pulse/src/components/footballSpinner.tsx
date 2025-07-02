"use client";
import Image from 'next/image';
import React from 'react';

export default function FootballSpinner() {
    return (
        <div className="flex justify-center items-center mt-5 motion-safe:animate-spin">
            <Image
                src="/football.png"
                width={100}
                height={100}
                alt="Picture of a football" />
        </div>
    )
}