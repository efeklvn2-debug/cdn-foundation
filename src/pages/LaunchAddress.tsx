import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Clock } from "lucide-react";
import founderImg from "@/assets/emerhana.jpg";

const LaunchAddress = () => {
  return (
    <>
      <Helmet>
        <title>Official Launch Address — Pa J.I. Emerhana Foundation</title>
        <meta name="description" content="Read the official launch address of the Pa J.I. Emerhana Foundation for Leadership & Development." />
      </Helmet>

      <section className="pt-32 pb-16 bg-primary">
        <div className="container">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-accent transition-colors mb-6 text-sm">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2"
          >
            Official Launch Address
          </motion.h1>
          <p className="text-accent-light font-semibold text-sm uppercase tracking-widest mb-4">
            Pa J.I. Emerhana Foundation for Leadership & Development
          </p>
          <div className="flex items-center gap-4 text-primary-foreground/60 text-sm">
            <span className="flex items-center gap-1"><Clock size={14} /> 12 min read</span>
          </div>
        </div>
      </section>

      {/* Reading Room */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Founder Image */}
            <div className="mb-12 text-center">
              <img
                src={founderImg}
                alt="Pa J.I. Emerhana"
                className="w-40 h-40 object-cover rounded-full mx-auto shadow-card outline outline-1 outline-border -outline-offset-1 mb-4"
              />
              <p className="font-serif-accent text-lg italic text-muted-foreground">Pa Joseph Igwakporo Emerhana</p>
            </div>

            {/* Speech Content */}
            <article className="prose-institutional">
              <p className="text-lg leading-[1.8] text-foreground mb-8 first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-primary">
                Distinguished guests, esteemed leaders, community elders, members of the press, and all well-meaning friends 
                of the Niger Delta — it is with profound humility and a deep sense of purpose that I welcome you to the 
                official launch of the Pa J.I. Emerhana Foundation for Leadership & Development.
              </p>

              <p className="text-lg leading-[1.8] text-foreground mb-8">
                This Foundation is not merely an institution; it is a living testament to a vision that has sustained our 
                family and our community for generations. It is a vision rooted in the conviction that true development 
                begins with purposeful leadership and empowered people. It is a vision that believes the Niger Delta 
                deserves not just resources, but the institutional capacity to transform those resources into sustainable prosperity.
              </p>

              {/* Pull Quote */}
              <div className="relative pl-6 my-12">
                <div className="absolute left-0 top-0 w-[2px] h-full bg-accent" />
                <blockquote className="font-serif-accent text-2xl md:text-3xl italic text-secondary leading-snug">
                  "The future of the Niger Delta will be written not by those who merely possess its resources, 
                  but by those who possess the vision and integrity to steward them wisely."
                </blockquote>
              </div>

              <p className="text-lg leading-[1.8] text-foreground mb-8">
                Pa Joseph Igwakporo Emerhana — our patriarch, our inspiration — understood this truth deeply. Throughout 
                his life, he demonstrated that leadership is not about title or position, but about service, sacrifice, 
                and an unrelenting commitment to the common good. He built bridges where others saw divides. He invested 
                in education when others invested only in extraction. He saw in every young person not a burden, but a 
                possibility waiting to be nurtured.
              </p>

              <p className="text-lg leading-[1.8] text-foreground mb-8">
                Today, we formalise that legacy. The Pa J.I. Emerhana Foundation for Leadership & Development exists 
                to identify, train, and empower the next generation of visionary leaders across the Niger Delta. 
                We will invest in education — from rural primary schools to tertiary scholarships. We will build 
                leadership capacity through structured programmes, mentorship, and real-world exposure. We will 
                champion evidence-based policy and institutional excellence.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">Our Strategic Commitments</h2>

              <p className="text-lg leading-[1.8] text-foreground mb-8">
                <strong>First</strong>, we commit to Leadership Development and Capacity Building. We shall create structured 
                training programmes, leadership academies, and mentorship pathways that prepare young men and women for 
                impactful roles in governance, business, and community development.
              </p>

              <p className="text-lg leading-[1.8] text-foreground mb-8">
                <strong>Second</strong>, we commit to Educational Access and Equity. Through our Girl Child Education 
                Initiative and Rural Education Development Programme, we will ensure that no child in the Niger Delta 
                is denied the opportunity to learn, to grow, and to lead.
              </p>

              <p className="text-lg leading-[1.8] text-foreground mb-8">
                <strong>Third</strong>, we commit to Evidence-Based Policy and Research. We will establish a research 
                unit dedicated to producing data-driven insights on governance, education, and development in the 
                Niger Delta — insights that will inform government policy and development strategy.
              </p>

              <p className="text-lg leading-[1.8] text-foreground mb-8">
                <strong>Fourth</strong>, we commit to building Public-Private Partnerships that amplify our impact. 
                We cannot do this work alone. We invite governments, corporations, international agencies, and 
                individuals of goodwill to join us in this mission.
              </p>

              {/* Pull Quote */}
              <div className="relative pl-6 my-12">
                <div className="absolute left-0 top-0 w-[2px] h-full bg-accent" />
                <blockquote className="font-serif-accent text-2xl md:text-3xl italic text-secondary leading-snug">
                  "We do not build this Foundation for ourselves. We build it for the children who will lead 
                  tomorrow, and for the communities that will prosper because of their leadership."
                </blockquote>
              </div>

              <p className="text-lg leading-[1.8] text-foreground mb-8">
                Let this day mark the beginning of a new chapter in the story of our region. Let the Pa J.I. Emerhana 
                Foundation stand as proof that the Niger Delta is not defined by its challenges, but by the quality of 
                its leaders and the depth of its vision.
              </p>

              <p className="text-lg leading-[1.8] text-foreground mb-8">
                Thank you. May our work honour the legacy of Pa J.I. Emerhana, and may it serve the generations 
                yet unborn.
              </p>

              <p className="text-lg leading-[1.8] text-foreground italic">
                — Delivered at the Official Launch of the Pa J.I. Emerhana Foundation for Leadership & Development, 2026.
              </p>
            </article>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 mt-12 pt-8 border-t border-border">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:brightness-90 transition-all">
                <Download size={18} /> Download PDF
              </button>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <ArrowLeft size={18} /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LaunchAddress;
