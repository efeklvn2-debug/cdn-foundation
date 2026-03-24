import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { GraduationCap, Heart, BookOpen } from "lucide-react";

const programs = [
  {
    icon: GraduationCap,
    title: "Leadership Training",
    desc: "Structured programmes equipping emerging leaders with governance, communication, and strategic management skills.",
  },
  {
    icon: Heart,
    title: "Girl Child Education",
    desc: "Scholarships and mentorship programmes empowering young women across the Niger Delta with quality education.",
  },
  {
    icon: BookOpen,
    title: "Rural Education Development",
    desc: "Building educational infrastructure and teacher capacity in underserved rural communities.",
  },
];

const ProgramsPreview = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-16 md:py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">What We Do</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Core Programmes</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {programs.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 bg-card rounded-xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
            >
              <p.icon className="w-10 h-10 text-accent mb-4" strokeWidth={1.5} />
              <h3 className="text-xl font-bold text-foreground mb-3 font-sans">{p.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/programs"
            className="inline-flex px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
          >
            View All Programs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProgramsPreview;
