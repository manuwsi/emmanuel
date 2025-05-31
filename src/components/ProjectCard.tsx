'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProjectProps {
  title: string
  image: string
  date: string
  tags: string
}

export default function ProjectCard({ title, image, date, tags }: ProjectProps) {
  const [, setHovered] = useState(false) // Ne pas utiliser 'hovered'

  return (
    <div
      className="relative overflow-hidden cursor-pointer group aspect-[3/4] w-full rounded-2xl shadow-lg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={image}
        alt={title}
        fill
        className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 ease-in-out"
        sizes="(max-width: 768px) 100vw, 33vw"
      />

      <div className="absolute inset-0 flex items-end p-4 text-white">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 w-full bg-black bg-opacity-60 px-4 py-3 rounded-b-2xl">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm uppercase opacity-70">{date}</p>
          <p className="text-sm">{tags}</p>
        </div>
      </div>
    </div>
  )
}
