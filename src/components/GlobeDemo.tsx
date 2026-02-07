import RotatingEarth from "@/components/ui/wireframe-dotted-globe"

export default function GlobeDemo() {
  return (
    <div className="flex justify-center items-center py-20 bg-black">
      <RotatingEarth width={800} height={600} />
    </div>
  )
}
