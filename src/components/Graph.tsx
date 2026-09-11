"use client"

import React, { useEffect, useRef, useState } from "react"
import GitHubCalendar from "react-github-calendar"

const Graph = () => {
 
  return (
    <div
      className="bg-[#09090B] w-full flex justify-center items-center py-10 px-[4%]"
    >
      <div className="w-full max-w-full overflow-hidden flex justify-center">
        <GitHubCalendar
          username="priyanshubuild"
          blockRadius={4}
          blockSize={15}
          blockMargin={4}
          fontSize={12}
          theme={{
            dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
          }}
          colorScheme="dark"
        />
      </div>
    </div>
  )
}

export default Graph