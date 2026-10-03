import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const statsRef = useRef([]);
  const numberRefs = useRef([]);
  const carRef = useRef(null);
  const trailRef = useRef(null);

  // Final values for the four statistics
  const statValues = [58, 23, 27, 40];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // ==========================================
      // 1. INITIAL PAGE LOAD ANIMATION
      // ==========================================

      const intro = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      // Headline
      intro.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 40,
          letterSpacing: "0.6em",
        },
        {
          opacity: 1,
          y: 0,
          letterSpacing: "0.35em",
          duration: 1.2,
        }
      );

      // Statistic cards
      intro.fromTo(
        statsRef.current,
        {
          opacity: 0,
          y: 30,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
        },
        "-=0.5"
      );

      // ==========================================
      // 2. SCROLL-DRIVEN ANIMATION
      // ==========================================

      gsap.fromTo(
        carRef.current,
        {
          x: 0,
          rotation: 0,
          scale: 0.9,
        },
        {
          x: () => window.innerWidth * 0.72,
          rotation: 8,
          scale: 1,
          ease: "none",

          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,

            onUpdate: (self) => {
              const progress = self.progress;

              // --------------------------------
              // Motion trail
              // --------------------------------

              gsap.set(trailRef.current, {
                scaleX: Math.max(progress, 0.05),
              });

              // --------------------------------
              // Animated numbers
              // --------------------------------

              numberRefs.current.forEach((numberElement, index) => {
                if (!numberElement) return;

                const finalValue = statValues[index];

                const currentValue = Math.round(
                  finalValue * progress
                );

                numberElement.textContent = `${currentValue}%`;
              });

              // --------------------------------
              // Statistics card movement
              // --------------------------------

              statsRef.current.forEach((card, index) => {
                if (!card) return;

                const direction = index % 2 === 0 ? -1 : 1;

                gsap.set(card, {
                  y: direction * progress * 25,
                });
              });
            },
          },
        }
      );

      // ==========================================
      // 3. MOVING ROAD
      // ==========================================

      gsap.to(".road-line", {
        x: -300,
        ease: "none",

        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      // ==========================================
      // 4. MOTION TRAIL INITIAL ANIMATION
      // ==========================================

      gsap.fromTo(
        trailRef.current,
        {
          opacity: 0,
          scaleX: 0,
        },
        {
          opacity: 1,
          scaleX: 0.1,
          duration: 1,
          delay: 0.8,
          ease: "power2.out",
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ==========================================
  // SAVE STATISTIC CARD REFERENCES
  // ==========================================

  const addStatRef = (element) => {
    if (element && !statsRef.current.includes(element)) {
      statsRef.current.push(element);
    }
  };

  // ==========================================
  // SAVE NUMBER REFERENCES
  // ==========================================

  const addNumberRef = (element) => {
    if (element && !numberRefs.current.includes(element)) {
      numberRefs.current.push(element);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[250vh] bg-neutral-300"
    >
      {/* ==========================================
          STICKY HERO VIEWPORT
      ========================================== */}

      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">

        {/* ==========================================
            HEADLINE
        ========================================== */}

        <div className="absolute left-1/2 top-12 z-30 -translate-x-1/2">
          <h1
            ref={titleRef}
            className="whitespace-nowrap text-center text-3xl font-bold tracking-[0.35em] text-neutral-900 sm:text-4xl md:text-6xl lg:text-7xl"
          >
            WELCOME ITZ FIZZ
          </h1>
        </div>

        {/* ==========================================
            ROAD
        ========================================== */}

        <div className="absolute left-0 top-1/2 h-64 w-full -translate-y-1/2 bg-neutral-900">

          {/* Top edge */}

          <div className="absolute inset-x-0 top-0 h-1 bg-white/10" />

          {/* Bottom edge */}

          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10" />

          {/* ==========================================
              ROAD DASHED LINE
          ========================================== */}

          <div className="road-line absolute left-0 top-1/2 h-1 w-[200%] -translate-y-1/2 border-t-4 border-dashed border-white/30" />

          {/* ==========================================
              MOTION TRAIL
          ========================================== */}

          <div
            ref={trailRef}
            className="absolute left-0 top-1/2 z-10 h-3 w-full origin-left -translate-y-1/2 scale-x-0 rounded-full bg-gradient-to-r from-transparent via-lime-300/30 to-lime-300/80 blur-sm"
          />

          {/* ==========================================
              CAR
          ========================================== */}

          <img
            ref={carRef}
            src={`${import.meta.env.BASE_URL}car.png`}
            alt="Sports car"
            className="absolute left-6 top-1/2 z-20 h-28 w-auto -translate-y-1/2 object-contain sm:h-32 md:h-40"
          />
        </div>

        {/* ==========================================
            STATISTIC 1
        ========================================== */}

        <div
          ref={addStatRef}
          className="absolute left-5 top-[20%] z-20 rounded-2xl bg-lime-300 p-5 text-black shadow-xl sm:left-8 sm:p-6"
        >
          <p
            ref={addNumberRef}
            className="text-4xl font-bold sm:text-5xl"
          >
            0%
          </p>

          <p className="mt-2 max-w-[160px] text-sm">
            Increase in user engagement
          </p>
        </div>

        {/* ==========================================
            STATISTIC 2
        ========================================== */}

        <div
          ref={addStatRef}
          className="absolute right-5 top-[20%] z-20 rounded-2xl bg-sky-300 p-5 text-black shadow-xl sm:right-8 sm:p-6"
        >
          <p
            ref={addNumberRef}
            className="text-4xl font-bold sm:text-5xl"
          >
            0%
          </p>

          <p className="mt-2 max-w-[160px] text-sm">
            Decrease in customer calls
          </p>
        </div>

        {/* ==========================================
            STATISTIC 3
        ========================================== */}

        <div
          ref={addStatRef}
          className="absolute bottom-[18%] left-5 z-20 rounded-2xl bg-neutral-800 p-5 text-white shadow-xl sm:left-8 sm:p-6"
        >
          <p
            ref={addNumberRef}
            className="text-4xl font-bold sm:text-5xl"
          >
            0%
          </p>

          <p className="mt-2 max-w-[160px] text-sm">
            Increase in digital adoption
          </p>
        </div>

        {/* ==========================================
            STATISTIC 4
        ========================================== */}

        <div
          ref={addStatRef}
          className="absolute bottom-[18%] right-5 z-20 rounded-2xl bg-orange-400 p-5 text-black shadow-xl sm:right-8 sm:p-6"
        >
          <p
            ref={addNumberRef}
            className="text-4xl font-bold sm:text-5xl"
          >
            0%
          </p>

          <p className="mt-2 max-w-[160px] text-sm">
            Reduction in response time
          </p>
        </div>

        {/* ==========================================
            SCROLL INDICATOR
        ========================================== */}

        <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-center text-black">
          <p className="text-xs font-medium uppercase tracking-[0.3em]">
            Scroll to explore
          </p>

          <div className="mx-auto mt-3 h-10 w-px bg-black/40" />
        </div>

      </div>
    </section>
  );
}