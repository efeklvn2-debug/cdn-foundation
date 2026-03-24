import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";

const articles = [
  {
    title: "Foundation Launch Event",
    date: "March 15, 2026",
    excerpt: "The Pa J.I. Emerhana Foundation was officially launched in a landmark ceremony attended by dignitaries, scholars, and community leaders from across the Niger Delta.",
    image: event1,
    slug: "foundation-launch-event",
  },
  {
    title: "Leadership Symposium Announcement",
    date: "March 10, 2026",
    excerpt: "The Foundation announces its inaugural Leadership Symposium, bringing together policy makers, educators, and development practitioners.",
    image: event2,
    slug: "leadership-symposium",
  },
  {
    title: "Girl Child Scholarship Initiative",
    date: "March 5, 2026",
    excerpt: "A new scholarship programme targeting young women in underserved communities across the Niger Delta has been unveiled.",
    image: event3,
    slug: "girl-child-scholarship",
  },
];

const NewsPreview = () => {
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
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Latest Updates</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">News & Announcements</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {articles.map((a, i) => (
            <motion.article
              key={a.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition-shadow duration-300"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <p className="text-muted-foreground text-xs font-medium mb-2">{a.date}</p>
                <h3 className="text-lg font-bold text-foreground mb-2 font-sans">{a.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{a.excerpt}</p>
                <Link to={`/news`} className="text-accent font-semibold text-sm hover:underline">
                  Read More →
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsPreview;
