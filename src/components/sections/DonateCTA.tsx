import { Link } from "react-router-dom";

const DonateCTA = () => {
  return (
    <section className="py-16 md:py-20 bg-accent">
      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground mb-4">
          Invest in the Next Generation of Leaders
        </h2>
        <p className="text-accent-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
          Your contribution directly supports scholarships, leadership training, and community development across the Niger Delta.
        </p>
        <Link
          to="/donate"
          className="inline-flex px-10 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-secondary transition-colors duration-200 active:scale-95"
        >
          Donate Now
        </Link>
      </div>
    </section>
  );
};

export default DonateCTA;
