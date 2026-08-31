import { TopNav } from "@/components/layout/top-nav"
import { WardrobeClient } from "@/components/wardrobe/wardrobe-client"

export const metadata = {
  title: "Wardrobe | TAG",
}

export default function WardrobePage() {
  return (
    <>
      <TopNav title="Wardrobe" />
      <WardrobeClient />
    </>
  )
}
