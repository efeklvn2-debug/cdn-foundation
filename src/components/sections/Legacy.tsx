import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import founderImg from "@/assets/emerhana.jpg";

const Legacy = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="py-16 md:py-20">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="relative">
              <img
                src={founderImg}
                alt="Pa J.I. Emerhana — Founder"
                className="w-full max-w-md mx-auto rounded-xl shadow-card outline outline-1 outline-border -outline-offset-1"
              />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              The Legacy Behind The Vision
            </h2>

            {/* Pull Quote */}
            <div className="relative pl-6 mb-8">
              <motion.div
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute left-0 top-0 w-[2px] h-full bg-accent origin-top"
              />
              <blockquote className="font-serif-accent text-2xl md:text-3xl italic text-secondary leading-snug">
                "True development begins with purposeful leadership and empowered people."
              </blockquote>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">
              The Pa J.I. Emerhana Foundation for Leadership & Development was established to honour the legacy 
              of a man who dedicated his life to community building, visionary leadership, and the holistic 
              development of the Niger Delta region. Through strategic interventions in education, governance, 
              and youth empowerment, the Foundation carries forward a vision that began decades ago.
            </p>

            <Link
              to="/launch-address"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-secondary transition-colors duration-200"
            >
              Read Full Launch Address
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Legacy;
