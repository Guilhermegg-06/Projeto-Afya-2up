export default function AnimatedHeart() {
    return (
        <svg className="animated-heart" viewBox="0 0 600 552" aria-hidden="true">
            <defs>
                <linearGradient id="heartGradient" x1="128" y1="80" x2="472" y2="498">
                    <stop offset="0%" stopColor="#ff7a95" />
                    <stop offset="50%" stopColor="#d63564" />
                    <stop offset="100%" stopColor="#7b2ff7" />
                </linearGradient>
                <filter id="heartGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feColorMatrix
                        in="blur"
                        type="matrix"
                        values="1 0 0 0 0.95 0 1 0 0 0.18 0 0 1 0 0.45 0 0 0 0.75 0"
                    />
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <path
                className="animated-heart__shadow"
                d="M300 497s-17-13-39-31C154 378 88 319 88 214c0-68 52-121 119-121 40 0 78 20 101 53 23-33 61-53 101-53 67 0 119 53 119 121 0 105-66 164-173 252-22 18-55 31-55 31Z"
            />
            <path
                className="animated-heart__shape"
                d="M300 497s-17-13-39-31C154 378 88 319 88 214c0-68 52-121 119-121 40 0 78 20 101 53 23-33 61-53 101-53 67 0 119 53 119 121 0 105-66 164-173 252-22 18-55 31-55 31Z"
            />
            <path
                className="animated-heart__line"
                d="M300 497s-17-13-39-31C154 378 88 319 88 214c0-68 52-121 119-121 40 0 78 20 101 53 23-33 61-53 101-53 67 0 119 53 119 121 0 105-66 164-173 252-22 18-55 31-55 31Z"
            />

            <circle className="heart-particle heart-particle--one" cx="142" cy="156" r="7" />
            <circle className="heart-particle heart-particle--two" cx="472" cy="172" r="6" />
            <circle className="heart-particle heart-particle--three" cx="423" cy="432" r="5" />
            <circle className="heart-particle heart-particle--four" cx="172" cy="393" r="5" />
            <circle className="heart-particle heart-particle--five" cx="302" cy="88" r="4" />
        </svg>
    );
}
