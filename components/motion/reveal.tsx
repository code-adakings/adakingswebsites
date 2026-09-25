"use client";

import { motion, type Variants } from "framer-motion";
import type { ComponentProps } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function Reveal({
  delay = 0,
  ...props
}: ComponentProps<typeof motion.div> & { delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      {...props}
    />
  );
}
