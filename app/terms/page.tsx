import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-light mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg">
          <p className="mb-4">
            By submitting content to NoteSelfSelf, you agree to the following terms:
          </p>

          <h2 className="text-2xl font-light mt-8 mb-4">Content Guidelines</h2>
          <ul className="list-disc pl-6 mb-8">
            <li>All submissions must be anonymous and not contain identifying information</li>
            <li>Content should be original and not infringe on others' rights</li>
            <li>No hate speech, harassment, or harmful content</li>
            <li>No spam or commercial content</li>
          </ul>

          <h2 className="text-2xl font-light mt-8 mb-4">Rights and Permissions</h2>
          <p className="mb-4">
            By submitting content, you grant NoteSelfSelf the right to:
          </p>
          <ul className="list-disc pl-6 mb-8">
            <li>Display your content in the gallery</li>
            <li>Transform your content into artwork</li>
            <li>Share the artwork on social media platforms</li>
          </ul>

          <h2 className="text-2xl font-light mt-8 mb-4">Privacy</h2>
          <p className="mb-8">
            We do not collect or store any personal information. All submissions are completely anonymous.
          </p>
        </div>

        <div className="mt-8">
          <Button asChild variant="outline" className="rounded-none border-black">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 