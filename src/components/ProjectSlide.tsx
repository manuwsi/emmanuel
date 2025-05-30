// 📁 src/components/ProjectSlide.tsx
'use client'

import { motion } from 'framer-motion'
import './luxetype.css'

interface ProjectProps {
  title: string
  image: string
  date: string
  tags: string
  index: number
}

export default function ProjectSlide({ title, image, date, tags, index }: ProjectProps) {
  return (
    <div
      className="grid place-items-center h-screen w-screen flex-shrink-0 px-[5vw]"
      style={{ scrollSnapAlign: 'center' }}
    >
      <div className="relative max-w-[36rem] w-full aspect-[3/4] group">
        <motion.img
          src={image}
          alt={title}
          initial={{ scale: 1.03, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="w-full h-full object-cover transition-transform duration-[1800ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.01]"
        />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 1.2, ease: 'easeOut' }}
            className="text-[3.5vw] leading-none tracking-tight text-white font-luxetype"
          >
            {title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
            className="mt-4 border border-neutral-300 rounded-full px-6 py-1.5 text-[0.6rem] tracking-widest uppercase text-neutral-200 hover:bg-white hover:text-black transition pointer-events-auto"
          >
            Open Project
          </motion.div>

          <p className="text-[0.55rem] mt-3 opacity-50 font-sans">({date} — {tags})</p>
        </div>
      </div>
    </div>
  )
}
