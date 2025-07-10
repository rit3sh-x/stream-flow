"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { UserButton } from '@clerk/nextjs'
import { SignedIn } from "@clerk/nextjs"
import { SignedOut } from "@clerk/nextjs"
import { useCurrentTheme } from '@/hooks/use-current-theme';
import { useScroll } from "@/hooks/use-scroll"
import {
  Check,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Users,
  BarChart,
  Layers,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { dark } from "@clerk/themes"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter();
  const currentTheme = useCurrentTheme();
  const scrolled = useScroll();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const faq = [
    {
      question: "How do I start streaming my videos?",
      answer:
        "Simply sign up for a free account, and start streaming instantly. Our platform supports a wide range of video formats and provides easy sharing options.",
    },
    {
      question: "Is there a limit to the number or size of videos I can upload?",
      answer:
        "Upload limits depend on your subscription plan. Our Starter plan offers generous storage, while Premium plan provide increased or unlimited storage for your growing needs.",
    },
    {
      question: "How secure are my videos and data?",
      answer:
        "We use industry-standard encryption for all videos and user data, both in transit and at rest. Only you and those you authorize can access your content.",
    },
    {
      question: "What kind of support is available if I have issues?",
      answer:
        "All users have access to our help center and email support. Professional and Enterprise customers receive priority support, including live chat and dedicated account managers.",
    },
  ]

  const flow = [
    {
      step: "01",
      title: "Create Account",
      description: "Sign up in seconds with just your email. No credit card required to get started.",
    },
    {
      step: "02",
      title: "Configure Workspace",
      description: "Customize your workspace to match your team's unique workflow and requirements.",
    },
    {
      step: "03",
      title: "Boost Productivity",
      description: "Start using our powerful features to streamline processes and achieve your goals.",
    },
  ]

  const features = [
    {
      title: "Smart Transcription",
      description: "Convert speech to text instantly for searchable, accessible video content.",
      icon: <Zap className="size-5" />,
    },
    {
      title: "Advanced Analytics",
      description: "Track engagement and viewer insights with real-time analytics dashboards.",
      icon: <BarChart className="size-5" />,
    },
    {
      title: "Team Collaboration",
      description: "Share, comment, and collaborate on videos with your entire team in one place.",
      icon: <Users className="size-5" />,
    },
    {
      title: "Enterprise Security",
      description: "Protect your videos and data with robust encryption and compliance standards.",
      icon: <Shield className="size-5" />,
    },
    {
      title: "Seamless Integration",
      description: "Connect Flow with your favorite apps and workflows using our flexible API.",
      icon: <Layers className="size-5" />,
    },
    {
      title: "24/7 Support",
      description: "Access expert help any time with our always-available support team.",
      icon: <Star className="size-5" />,
    },
  ]

  return (
    <div className="flex flex-col w-full items-center custom-scroll overflow-y-auto h-screen">
      <header
        className={`sticky mx-auto container top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${scrolled ? "bg-background/80 shadow-sm" : "bg-transparent"}`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3 font-bold">
            <Image
              src={"/logo.svg"}
              alt="flow"
              height={32}
              width={32}
            />
            <span className="text-2xl">Flow</span>
          </div>
          <>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    cardBox: "border! shadow-none! rounded-lg!"
                  },
                  baseTheme: currentTheme === "dark" ? dark : undefined,
                }}
              />
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in">
                <Button className="text-base flex gap-x-2">
                  <User />
                  Login
                </Button>
              </Link>
            </SignedOut>
          </>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="container px-4 md:px-6 relative">
            <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_15%,#000_40%,transparent_140%)]"></div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Elevate Video Sharing with Flow
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Instantly share and stream videos in real time with powerful AI features. Collaborate, analyze, and enhance your content seamlessly—no delays, just smarter video sharing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => router.push("/workspace")} className="rounded-full h-12 px-8 text-base">
                  Home
                  <ArrowRight className="ml-1 size-4" />
                </Button>
                <Button size="lg" onClick={() => router.push("/pricing")} variant="outline" className="rounded-full h-12 px-8 text-base">
                  Pricing
                </Button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Check className="size-4 text-primary" />
                  <span>Easy to use</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="size-4 text-primary" />
                  <span>Free trial</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="size-4 text-primary" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto max-w-5xl"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/40 bg-gradient-to-b from-background to-muted/20">
                <Image
                  src="/feature.jpg"
                  width={1280}
                  height={720}
                  alt="Flow Workspace"
                  className="w-full h-auto"
                  priority
                />
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
              <div className="absolute -top-6 -left-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70"></div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything You Need to Succeed</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Our comprehensive platform provides all the tools you need to streamline your workflow, boost
                productivity, and achieve your goals.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {features.map((feature, i) => (
                <motion.div key={i} variants={item}>
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="size-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="w-full py-20 md:py-32 bg-muted/30 relative rounded-lg overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                How It Works
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple Process, Powerful Results</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Get started in minutes and see the difference our platform can make for your business.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0"></div>

              {flow.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative z-10 flex flex-col items-center text-center space-y-4"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-bold shadow-lg">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                FAQ
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Find answers to common questions about our platform.
              </p>
            </motion.div>

            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {faq.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <AccordionItem value={`item-${i}`} className="border-b border-border/40 py-2">
                      <AccordionTrigger className="text-left font-medium hover:no-underline">
                        {f.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}