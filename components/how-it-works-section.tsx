import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Sparkles, Share } from "lucide-react"

const steps = [
  {
    icon: <Upload className="h-10 w-10 text-amber-500" />,
    title: "Submit Your Note",
    description: "Take a screenshot of your note or type it directly. Submit it anonymously through our simple form.",
  },
  {
    icon: <Sparkles className="h-10 w-10 text-amber-500" />,
    title: "AI Transformation",
    description:
      "Our AI analyzes your note and transforms it into a unique piece of digital artwork that captures its essence.",
  },
  {
    icon: <Share className="h-10 w-10 text-amber-500" />,
    title: "Share & Discover",
    description:
      "Your transformed note joins our gallery. We may feature it on our social media channels for others to enjoy.",
  },
]

export default function HowItWorksSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Turn your everyday notes into extraordinary art in just a few simple steps. The process is anonymous, easy,
            and completely free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="border-none shadow-md">
              <CardHeader className="pb-2 pt-6 flex flex-col items-center">
                <div className="mb-4 p-3 bg-amber-100 rounded-full">{step.icon}</div>
                <CardTitle className="text-xl text-center">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center px-6 pb-6">
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
