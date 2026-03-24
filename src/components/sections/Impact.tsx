import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const metrics = [
  { value: 500, suffix: "+", label: "Leaders Trained" },
  { value: 100, suffix: "+", label: "Scholarships" },
  { value: 75, suffix: "+", label: "Communities" },
  { value: 10, suffix: "", label: "Leadership Symposiums" },
];

const Impact = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="py-14 md:py-16 bg-primary">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-accent tabular-nums mb-2">
                {inView ? (
                  <CountUp end={m.value} duration={2} suffix={m.suffix} />
                ) : (
                  <span>0{m.suffix}</span>
                )}
              </div>
              <p className="text-primary-foreground/70 text-sm font-medium">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Impact;
