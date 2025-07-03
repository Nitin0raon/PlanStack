import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Brain, ChevronRight, LockIcon, NotebookIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="container mx-auto py-20 text-center ">
        <h1 className="text-amber-50 text-6xl sm:text-7xl lg:text-8xl font-extrabold gradient-title pb-6 flex flex-col">Streamline your workflow
          <br/>
          with
          <p>kdjkjkafndfdkf;a</p>
        </h1>
        <p className="text-amber-50 mt-2 mb-10">empower your team with us</p>
        <Link href='/onboarding'><Button size='lg' variant='mybut' className="mr-4">Get Started<ChevronRight/></Button></Link>
        <Link href='#features'><Button size='lg' variant='outline' className="mr-4">Learn More<ChevronRight/></Button></Link>
      </section>
      <section id="features" className="min-h-screen pt-20 text-center" >
        <h3 className="text-amber-50 text-4xl font-bold">Features</h3>
        <div className="flex items-center justify-center pt-10 gap-10">
          <Card className="max-w-100 ">
            <CardHeader>
              <NotebookIcon className="bg-amber-200 rounded-full h-12 w-12 p-2"/>
            </CardHeader>
            <CardContent>
              <h2 className="font-bold"> Journal by Mood</h2>
              <p className="pt-2">Write your thoughts and let us detect your mood to organize your entries. Happy, sad, inspired – we've got a place for every feeling.
</p>
            </CardContent>
          </Card>
          <Card className="max-w-100">
            <CardHeader>
              <Brain className="bg-amber-200 rounded-full h-12 w-12 p-2"/>
            </CardHeader>
            <CardContent>
              <h2 className="font-bold"> Reflect Smarter</h2>
              <p className="pt-2">Gain insights about your moods, patterns, and emotional journey through beautifully visualized data.</p>
            </CardContent>
          </Card>
          <Card className="max-w-100">
            <CardHeader>
              <LockIcon className="bg-amber-200 rounded-full h-12 w-12 p-2"/>
            </CardHeader>
            <CardContent>
              <h2 className="font-bold"> Secure & Private</h2>
              <p className="pt-2">We encrypt your entries, so your private thoughts remain truly private – accessible only by you.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
