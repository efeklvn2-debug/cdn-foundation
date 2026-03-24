import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { GraduationCap, Heart, BookOpen, Users, FileText } from "lucide-react";

const programs = [
  {
    icon: GraduationCap,
    title: "Leadership Training & Development",
    desc: "Comprehensive training programmes designed to equip emerging leaders with governance, strategic thinking, communication, and management skills. Sessions include workshops, retreats, and hands-on project leadership opportunities.",
    impact: "Train 200+ emerging leaders annually across the Niger Delta.",
  },
  {
    icon: Users,
    title: "Mentorship & Coaching",
    desc: "Pairing young professionals and community leaders with experienced mentors from government, private sector, and academia. Structured mentorship paths ensure knowledge transfer and sustained leadership development.",
    impact: "Build a mentorship network spanning 50+ communities.",
  },
  {
    icon: Heart,
    title: "Girl Child Scholarship Programme",
    desc: "Full and partial scholarships supporting young women from underserved Niger Delta communities to access quality secondary and tertiary education. Includes academic mentoring and career guidance.",
    impact: "Award 100+ scholarships in the first three years.",
  },
  {
    icon: BookOpen,
    title: "Rural Education Development",
    desc: "Investing in educational infrastructure, teacher training, and learning materials for schools in rural Niger Delta communities. Focused on improving literacy, numeracy, and STEM education outcomes.",
    impact: "Upgrade 30+ rural schools and train 150+ teachers.",
  },
  {
    icon: FileText,
    title: "Policy Research & Advocacy",
    desc: "Conducting rigorous research on governance, development, and education policy specific to the Niger Delta. Publishing reports and convening policy forums to drive evidence-based decision-making.",
    impact: "Publish 10+ policy papers and host annual policy dialogues.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const ProgramsPage = () => {
  return (
    <>
      <Helmet>
        <title>Programs — Pa J.I. Emerhana Foundation</title>
        <meta name="description" content="Explore the leadership, education, and development programmes of the Pa J.I. Emerhana Foundation." />
      </Helmet>

      <section className="pt-32 pb-16 bg-primary">
        <div className="container">
          <motion.h1 {...fadeUp} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Our Programmes</motion.h1>
          <motion.p {...fadeUp} className="text-primary-foreground/70 text-lg max-w-2xl">
            Strategic interventions designed to build leadership capacity, expand educational access, and drive sustainable development.
          </motion.p>
        </div>
      </section>

      <section className="py-24">
        <div className="container space-y-8">
          {programs.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="p-8 bg-card rounded-xl shadow-card"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="shrink-0">
                  <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center">
                    <p.icon className="w-7 h-7 text-accent" strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3 font-sans">{p.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
                  <div className="inline-flex px-4 py-2 bg-accent/10 rounded-lg">
                    <p className="text-accent text-sm font-semibold">Impact Goal: {p.impact}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ProgramsPage;
