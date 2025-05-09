import { Card, CardContent } from "@/components/ui/card"

// Sample notes
const featuredNotes = [
  {
    id: 1,
    text: "things to google later: why do I feel tired after 9 hours of sleep, is mercury in retrograde, how to tell if therapist hates me",
    category: "lists",
  },
  {
    id: 2,
    text: "I think I'm just pretending to be an adult and everyone else has it figured out. Need to buy more paper towels.",
    category: "thoughts",
  },
  {
    id: 3,
    text: "Potential band names: Cosmic Debris, The Mild Inconveniences, Forgotten Passwords, Tuesday Afternoon Panic",
    category: "ideas",
  },
  {
    id: 4,
    text: "Text Sarah back. Call mom. Cancel free trial before they charge me. What am I doing with my life?",
    category: "reminders",
  },
  {
    id: 5,
    text: "Draft: Hey, I've been thinking about what you said last week and I don't think I can just pretend it didn't happen. We should talk.",
    category: "unsent",
  },
  {
    id: 6,
    text: "Grocery list: eggs, spinach, that good bread, something to fill the void, milk, cereal",
    category: "lists",
  },
]

export default function FeaturedNotes() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredNotes.map((note) => (
        <Card
          key={note.id}
          className="h-full border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-sm rounded-none cursor-default"
        >
          <CardContent className="p-6 flex flex-col h-full">
            <div className="text-xs tracking-wider uppercase mb-3 text-gray-500">{note.category}</div>
            <p className="text-base font-light leading-relaxed flex-grow">{note.text}</p>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
              <div className="w-12 h-[1px] bg-black transition-all duration-300 group-hover:w-16"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
