import Container from "@/components/Container";
import RingButton from "@/components/RingButton";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <main id="main-content" className="bg-[#09090B]">
      <Container>
        <div className="w-full px-4 md:px-8">
          <div className="px-[2%] text-white">
            <div className="mt-8 mb-4 items-center gap-2 text-lg font-semibold">
              <Button variant="primary" size="lg" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <Undo2 /> Back
                </Link>
              </Button>
            </div>
            <div className="mb-8 flex flex-col gap-4">
              <h1 className="font-space-grotesk pt-10 text-4xl font-semibold sm:text-6xl">
                Projects
              </h1>
              <div className="text-lg text-neutral-400 sm:text-xl">
                Currently under active development · Live projects will be added
                as they are completed
              </div>
            </div>
            <hr className="border-0.5 border-[#424244]" />
            <div className="mx-auto flex max-w-xl flex-col items-center justify-center py-12 text-center">
              <p className="mb-6 text-base leading-relaxed text-neutral-300">
                I am currently focusing on core engineering foundations in C++,
                Data Structures &amp; Algorithms, and web development. Active
                code and practice repositories are available on GitHub.
              </p>
              <RingButton
                href="https://github.com/priyanshubuild"
                target="_blank"
                rel="noopener noreferrer"
                text="Visit GitHub @priyanshubuild"
                size="lg"
              />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default page;
