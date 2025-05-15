import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-light mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg">
          <p className="mb-4">
            At NoteSelfSelf, we take your privacy seriously. This policy explains how we handle your data.
          </p>

          <h2 className="text-2xl font-light mt-8 mb-4">Data Collection</h2>
          <p className="mb-4">
            We collect minimal data to provide our service:
          </p>
          <ul className="list-disc pl-6 mb-8">
            <li>Anonymous journal entries</li>
            <li>Generated artwork</li>
            <li>No personal information is collected</li>
            <li>No cookies are used for tracking</li>
          </ul>

          <h2 className="text-2xl font-light mt-8 mb-4">Data Storage</h2>
          <p className="mb-4">
            Your data is stored securely:
          </p>
          <ul className="list-disc pl-6 mb-8">
            <li>All submissions are stored anonymously</li>
            <li>No IP addresses are logged</li>
            <li>No user accounts are required</li>
            <li>Data is stored in a secure database</li>
          </ul>

          <h2 className="text-2xl font-light mt-8 mb-4">Data Usage</h2>
          <p className="mb-8">
            Your anonymous submissions may be:
          </p>
          <ul className="list-disc pl-6 mb-8">
            <li>Displayed in our gallery</li>
            <li>Transformed into artwork</li>
            <li>Shared on social media (without any identifying information)</li>
          </ul>

          <h2 className="text-2xl font-light mt-8 mb-4">Contact</h2>
          <p className="mb-8">
            If you have any questions about our privacy policy, please contact us.
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