import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEmailJS } from "@/lib/emailjs";

const donateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  amount: z.string().min(1, "Please enter a donation amount"),
  message: z.string().optional(),
});

type DonateFormData = z.infer<typeof donateSchema>;

const Donate = () => {
  const { sendDonationEmail, isConfigured } = useEmailJS();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const form = useForm<DonateFormData>({
    resolver: zodResolver(donateSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "",
      message: "",
    },
  });

  const onSubmit = async (data: DonateFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const result = await sendDonationEmail({
        name: data.name,
        email: data.email,
        amount: data.amount,
        message: data.message || "",
      });
      if (result.success) {
        setSubmitStatus("success");
        form.reset();
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Donation submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Donate — Pa J.I. Emerhana Foundation</title>
        <meta name="description" content="Support the Pa J.I. Emerhana Foundation's mission to develop visionary leaders in the Niger Delta." />
      </Helmet>

      <section className="pt-32 pb-16 bg-primary">
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4"
          >
            Invest in Leadership
          </motion.h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl">
            Your contribution directly supports scholarships, leadership training, and community development across the Niger Delta.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container max-w-2xl">
          <div className="bg-card rounded-xl shadow-card p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-accent" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground font-sans">Make a Donation</h2>
                <p className="text-muted-foreground text-sm">Every contribution makes a difference.</p>
              </div>
            </div>

            <div className="mb-8 p-4 bg-muted rounded-lg">
              <h3 className="text-lg font-bold text-foreground mb-4 font-sans">Bank Transfer Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Bank:</span> <span className="font-semibold text-foreground">Stanbic IBTC BANK</span></p>
                <p><span className="text-muted-foreground">Account Name:</span> <span className="font-semibold text-foreground">EMERHANA ONORIODE PAUL</span></p>
                <p><span className="text-muted-foreground">Account Number:</span> <span className="font-semibold text-foreground">0032641445</span></p>
                <p><span className="text-muted-foreground">Reference:</span> <span className="font-semibold text-foreground">EMERHANA-{Date.now()}</span></p>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Please use the reference number above when making your transfer and email proof of payment to pemerhana@yahoo.co.uk
              </p>
            </div>

            {!isConfigured && (
              <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                EmailJS is not configured. Form submissions will be logged to console.
              </div>
            )}

            {submitStatus === "success" ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2 font-sans">Donation Successful!</h3>
                <p className="text-muted-foreground mb-4">Thank you for your generous donation. A confirmation email has been sent to your email address.</p>
                <Button onClick={() => setSubmitStatus("idle")} className="bg-accent text-accent-foreground hover:brightness-90">
                  Make Another Donation
                </Button>
              </div>
            ) : submitStatus === "error" ? (
              <div className="text-center py-8">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2 font-sans">Submission Error</h3>
                <p className="text-muted-foreground mb-4">There was an error processing your donation. Please try again or contact us directly.</p>
                <Button onClick={() => setSubmitStatus("idle")} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Donation Amount (₦)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Any additional message..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent text-accent-foreground hover:brightness-90"
                  >
                    {isSubmitting ? "Processing..." : "Submit Donation Details"}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Donate;
