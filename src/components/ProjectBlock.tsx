'use client'

import { motion } from 'framer-motion'
import Image from 'next/image' // ✅ On utilise Next.js Image !

interface ProjectProps {
  title: string
  image: string
  date: string
  tags: string
  index: number
}

export default function ProjectBlock({ title, image, date, tags, index }: ProjectProps) {
  const align = index % 2 === 0 ? 'left' : 'right'

  return (
    <div className={`flex flex-col md:flex-row ${align === 'right' ? 'md:flex-row-reverse' : ''} items-center gap-8 mb-32`}>
      <motion.div
        className="relative w-full md:w-1/2 aspect-[3/4] overflow-hidden rounded-2xl shadow-lg"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover scale-105 hover:scale-100 transition-transform duration-1000 ease-in-out rounded-2xl" // ✅ petit plus : rounded aussi
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={index === 0} // Optionnel : priorité sur la première image
        />
      </motion.div>

      <motion.div
        className="w-full md:w-1/2 px-4 md:px-12"
        initial={{ opacity: 0, x: align === 'right' ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-6xl font-ivy font-light leading-tight mb-4 tracking-tight">{title}</h2>
        <p className="uppercase text-sm opacity-60 mb-1">{date}</p>
        <p className="text-base opacity-80 mb-4">{tags}</p>
        <a href="#" className="inline-flex items-center gap-2 text-white text-sm uppercase tracking-widest hover:opacity-70 transition">
          Open Project →
        </a>
      </motion.div>
    </div>
  )
}
