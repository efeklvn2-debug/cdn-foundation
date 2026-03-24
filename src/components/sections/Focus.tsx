import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Users, Building2, Handshake, BarChart3, Sparkles } from "lucide-react";

const focuses = [
  {
    icon: Users,
    title: "Leadership Development & Capacity Building",
    desc: "Cultivating transformative leaders through structured training, mentorship, and experiential learning programmes.",
  },
  {
    icon: Building2,
    title: "Institutional Excellence",
    desc: "Strengthening governance structures and institutional frameworks for sustainable regional development.",
  },
  {
    icon: Handshake,
    title: "Public-Private Partnerships",
    desc: "Facilitating strategic collaboration between government, private sector, and development partners.",
  },
  {
    icon: BarChart3,
    title: "Evidence-Based Policy",
    desc: "Driving research and data-informed policy recommendations for the Niger Delta region.",
  },
  {
    icon: Sparkles,
    title: "Youth & Emerging Leaders",
    desc: "Identifying, nurturing, and positioning the next generation of Niger Delta leaders.",
  },
];

const Focus = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-16 md:py-20 bg-card">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Our Focus</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Strategic Areas of Impact</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {focuses.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group p-8 bg-background rounded-xl shadow-card border border-transparent hover:border-accent hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300"
            >
              <f.icon className="w-8 h-8 text-accent mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-bold text-foreground mb-2 font-sans">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Focus;
