export function HeroFallback() {
  return (
    <div className="hero-scene-fallback" aria-hidden="true">
      <svg className="fallback-dragon" viewBox="0 0 600 360">
        <path d="M60 245C125 195 170 130 250 147s94 91 173 58c38-16 55-52 90-59" />
        <path d="M204 145 139 70 80 55M213 151 144 105 91 102M301 173l49-103 76-35M316 180l66-69 70-20" />
        <path d="m420 204 47-36 55 7 26 23-43 21-55-2Z" />
        <path d="m489 169 18-31M472 173l-5-35M507 213l11 19M494 215l5 22" />
        <path d="M206 151c-10 43 4 74 37 92M240 151c-7 48 8 82 40 106M277 161c0 42 12 70 37 86M315 174c4 31 16 51 35 62" />
        <circle cx="503" cy="183" r="4" />
      </svg>
    </div>
  )
}
