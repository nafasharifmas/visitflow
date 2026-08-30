import { Anchor, Church, Fish, Landmark, Leaf, MapPin, Palmtree, Scissors, Trees, Waves } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const glyphs: Record<string, LucideIcon> = {
  Waves,
  Landmark,
  Church,
  Leaf,
  Fish,
  Trees,
  Palmtree,
  Anchor,
  Scissors,
  Globe: MapPin,
  MapPin,
}

export function CategoryGlyph({ icon, size = 20, className }: { icon?: string | null; size?: number; className?: string }) {
  const Icon = (icon && glyphs[icon]) || MapPin
  return <Icon size={size} className={className} aria-hidden />
}