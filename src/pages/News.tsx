import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";

const articles = [
  {
    title: "Foundation Launch Event Marks New Era for Niger Delta Leadership",
    date: "March 15, 2026",
    excerpt: "The Pa J.I. Emerhana Foundation was officially launched in a landmark ceremony attended by dignitaries, scholars, and community leaders from across the Niger Delta. The event underscored the Foundation's commitment to raising visionary leaders.",
    image: event1,
  },
  {
    title: "Inaugural Leadership Symposium Announced",
    date: "March 10, 2026",
    excerpt: "The Foundation announces its first Leadership Symposium, a convening of policy makers, educators, development practitioners, and emerging leaders to deliberate on the future of governance in the Niger Delta.",
    image: event2,
  },
  {
    title: "Girl Child Scholarship Initiative Unveiled",
    date: "March 5, 2026",
    excerpt: "A new scholarship programme targeting young women in underserved communities across the Niger Delta has been unveiled, with the first cohort of 50 scholars set to begin their academic journeys.",
    image: event3,
  },
];

const News = () => {
  return (
    <>
      <Helmet>
        <title>News — Pa J.I. Emerhana Foundation</title>
        <meta name="description" content="Latest news and announcements from the Pa J.I. Emerhana Foundation." />
      </Helmet>

      <section className="pt-32 pb-16 bg-primary">
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4"
          >
            News & Announcements
          </motion.h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl">
            Stay informed about Foundation activities, programmes, and development impact.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((a, i) => (
              <motion.article
                key={a.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-card rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition-shadow duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground text-xs font-medium mb-2">{a.date}</p>
                  <h2 className="text-lg font-bold text-foreground mb-3 font-sans">{a.title}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">{a.excerpt}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default News;
