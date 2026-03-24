import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Target, Eye, Heart, Shield, Award, Lightbulb } from "lucide-react";

const values = [
  { icon: Shield, name: "Integrity", desc: "Unwavering commitment to transparency, accountability, and ethical conduct." },
  { icon: Award, name: "Excellence", desc: "Pursuit of the highest standards in programme delivery and institutional operations." },
  { icon: Heart, name: "Service", desc: "Selfless dedication to the development and empowerment of communities." },
  { icon: Lightbulb, name: "Innovation", desc: "Embracing creative and evidence-based approaches to solving development challenges." },
  { icon: Target, name: "Inclusivity", desc: "Ensuring equitable participation and benefit for all, regardless of background." },
  { icon: Eye, name: "Sustainability", desc: "Building solutions that endure and create lasting impact for generations." },
];

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const About = () => {
  return (
    <>
      <Helmet>
        <title>About — Pa J.I. Emerhana Foundation</title>
        <meta name="description" content="Learn about the mission, vision, and values of the Pa J.I. Emerhana Foundation for Leadership & Development in the Niger Delta." />
      </Helmet>

      {/* Header */}
      <section className="pt-32 pb-16 bg-primary">
        <div className="container">
          <motion.h1 {...fadeUp} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Institutional Legacy</motion.h1>
          <motion.p {...fadeUp} className="text-primary-foreground/70 text-lg max-w-2xl">
            Understanding the foundation upon which a new generation of Niger Delta leaders is being raised.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div {...fadeUp} className="p-8 bg-card rounded-xl shadow-card">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-accent" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To identify, nurture, and empower visionary leaders who will drive sustainable development, 
                good governance, and institutional excellence across the Niger Delta region. Through strategic 
                investments in education, capacity building, and evidence-based policy advocacy, the Foundation 
                seeks to transform communities and create lasting impact.
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="p-8 bg-card rounded-xl shadow-card">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-accent" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                A Niger Delta region defined by purposeful leadership, institutional integrity, and sustainable 
                prosperity — where every community thrives through the collective efforts of empowered, 
                visionary citizens committed to the common good.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-card">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">What Guides Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Foundational Values</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="p-6 bg-background rounded-xl shadow-card"
              >
                <v.icon className="w-7 h-7 text-accent mb-3" strokeWidth={1.5} />
                <h3 className="text-lg font-bold text-foreground mb-2 font-sans">{v.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
