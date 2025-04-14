// Complete the getChatAnywhereResponse function
export async function getChatAnywhereResponse(userMessage: string): Promise<string> {
  // Using the ChatAnywhere endpoint and API key as specified
  const apiKey = process.env.CHAT_ANYWHERE_API_KEY || ""
  const baseUrl = "https://api.chatanywhere.tech/v1"

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an AI coding habit tracker assistant that helps developers improve their coding habits and skills. Provide helpful, concise advice about coding practices, learning strategies, project management, and technical skill development. Keep responses friendly, motivational, and focused on helping developers build consistent coding habits.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error("Error getting AI response:", error)
    return "Sorry, I couldn't process your request at the moment. Please try again later."
  }
}

// Generate a daily coding challenge
export async function generateDailyChallenge(
  technologies: string[],
  difficulty: "easy" | "medium" | "hard" = "medium",
): Promise<any> {
  const tech = technologies.join(", ")
  const prompt = `Generate a coding challenge for a developer who knows ${tech}. The challenge should be ${difficulty} difficulty. Format the response as a JSON object with title, description, difficulty, type, and link properties.`

  try {
    const response = await getChatAnywhereResponse(prompt)
    // Parse the JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    // Fallback if JSON parsing fails
    return {
      title: "Algorithm Challenge",
      description: "Implement a function that finds the missing number in an array of consecutive integers.",
      difficulty,
      type: "Algorithm",
      link: "https://leetcode.com/problems/missing-number/",
    }
  } catch (error) {
    console.error("Error generating challenge:", error)
    return {
      title: "Algorithm Challenge",
      description: "Implement a function that finds the missing number in an array of consecutive integers.",
      difficulty,
      type: "Algorithm",
      link: "https://leetcode.com/problems/missing-number/",
    }
  }
}

// Generate personalized insights based on user data
export async function generateInsights(userData: any): Promise<any[]> {
  const { technologies, goal, learning_style, time_commitment, tracking_metrics } = userData

  const prompt = `Based on a developer with the following profile:
- Technologies: ${technologies.join(", ")}
- Goal: ${goal}
- Learning style: ${learning_style}
- Time commitment: ${time_commitment}
- Tracking metrics: ${tracking_metrics.join(", ")}

Generate 3 personalized insights and recommendations to help them improve their coding habits and achieve their goals. Format each insight as a JSON object with title, description, and recommendation properties.`

  try {
    const response = await getChatAnywhereResponse(prompt)
    // Try to parse the JSON array from the response
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    // Fallback insights if parsing fails
    return [
      {
        title: "Progress Analysis",
        description:
          "Based on your recent activity, you've been consistent with JavaScript practice but could benefit from more focus on data structures and algorithms.",
        recommendation:
          "Try dedicating 20 minutes daily to solve array and string manipulation problems to strengthen your algorithmic thinking.",
      },
      {
        title: "Skill Gap Analysis",
        description:
          "You've made great progress with React fundamentals, but your state management skills could use improvement.",
        recommendation:
          "Consider building a small project using React Context API or Redux to practice state management patterns.",
      },
      {
        title: "Learning Path Adjustment",
        description:
          "Your goal of becoming a full-stack developer is progressing well, but your backend skills need attention.",
        recommendation:
          "Start exploring Node.js and Express to build simple APIs. This will complement your frontend skills and help you become a more well-rounded developer.",
      },
    ]
  } catch (error) {
    console.error("Error generating insights:", error)
    // Return fallback insights
    return [
      {
        title: "Progress Analysis",
        description:
          "Based on your recent activity, you've been consistent with JavaScript practice but could benefit from more focus on data structures and algorithms.",
        recommendation:
          "Try dedicating 20 minutes daily to solve array and string manipulation problems to strengthen your algorithmic thinking.",
      },
      {
        title: "Skill Gap Analysis",
        description:
          "You've made great progress with React fundamentals, but your state management skills could use improvement.",
        recommendation:
          "Consider building a small project using React Context API or Redux to practice state management patterns.",
      },
      {
        title: "Learning Path Adjustment",
        description:
          "Your goal of becoming a full-stack developer is progressing well, but your backend skills need attention.",
        recommendation:
          "Start exploring Node.js and Express to build simple APIs. This will complement your frontend skills and help you become a more well-rounded developer.",
      },
    ]
  }
}

// Generate learning resources based on user interests
export async function generateLearningResources(technologies: string[]): Promise<any[]> {
  const tech = technologies.join(", ")
  const prompt = `Recommend 5 learning resources for a developer interested in ${tech}. Format each resource as a JSON object with title, description, type (article, video, tutorial, or course), source, url, and tags properties.`

  try {
    const response = await getChatAnywhereResponse(prompt)
    // Try to parse the JSON array from the response
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    // Fallback resources if parsing fails
    return [
      {
        id: 1,
        title: "Understanding React Hooks",
        description: "A comprehensive guide to React Hooks and how to use them effectively in your applications.",
        type: "article",
        source: "React Documentation",
        url: "https://reactjs.org/docs/hooks-intro.html",
        tags: ["React", "Hooks", "Frontend"],
      },
      {
        id: 2,
        title: "Advanced TypeScript Patterns",
        description: "Learn advanced TypeScript patterns to improve your code quality and developer experience.",
        type: "video",
        source: "TypeScript Conference",
        url: "https://www.youtube.com/watch?v=example",
        tags: ["TypeScript", "Advanced", "Patterns"],
      },
      {
        id: 3,
        title: "Building a Full-Stack App with Next.js",
        description: "Step-by-step tutorial on building a full-stack application with Next.js, Prisma, and PostgreSQL.",
        type: "tutorial",
        source: "Vercel Blog",
        url: "https://vercel.com/blog/example",
        tags: ["Next.js", "Full-Stack", "Prisma"],
      },
      {
        id: 4,
        title: "Mastering CSS Grid Layout",
        description: "Everything you need to know about CSS Grid Layout to create complex web layouts with ease.",
        type: "article",
        source: "CSS-Tricks",
        url: "https://css-tricks.com/example",
        tags: ["CSS", "Grid", "Layout"],
      },
      {
        id: 5,
        title: "Data Structures and Algorithms in JavaScript",
        description: "Learn the most important data structures and algorithms implemented in JavaScript.",
        type: "course",
        source: "Frontend Masters",
        url: "https://frontendmasters.com/example",
        tags: ["JavaScript", "DSA", "Algorithms"],
      },
    ]
  } catch (error) {
    console.error("Error generating learning resources:", error)
    // Return fallback resources
    return [
      {
        id: 1,
        title: "Understanding React Hooks",
        description: "A comprehensive guide to React Hooks and how to use them effectively in your applications.",
        type: "article",
        source: "React Documentation",
        url: "https://reactjs.org/docs/hooks-intro.html",
        tags: ["React", "Hooks", "Frontend"],
      },
      {
        id: 2,
        title: "Advanced TypeScript Patterns",
        description: "Learn advanced TypeScript patterns to improve your code quality and developer experience.",
        type: "video",
        source: "TypeScript Conference",
        url: "https://www.youtube.com/watch?v=example",
        tags: ["TypeScript", "Advanced", "Patterns"],
      },
      {
        id: 3,
        title: "Building a Full-Stack App with Next.js",
        description: "Step-by-step tutorial on building a full-stack application with Next.js, Prisma, and PostgreSQL.",
        type: "tutorial",
        source: "Vercel Blog",
        url: "https://vercel.com/blog/example",
        tags: ["Next.js", "Full-Stack", "Prisma"],
      },
      {
        id: 4,
        title: "Mastering CSS Grid Layout",
        description: "Everything you need to know about CSS Grid Layout to create complex web layouts with ease.",
        type: "article",
        source: "CSS-Tricks",
        url: "https://css-tricks.com/example",
        tags: ["CSS", "Grid", "Layout"],
      },
      {
        id: 5,
        title: "Data Structures and Algorithms in JavaScript",
        description: "Learn the most important data structures and algorithms implemented in JavaScript.",
        type: "course",
        source: "Frontend Masters",
        url: "https://frontendmasters.com/example",
        tags: ["JavaScript", "DSA", "Algorithms"],
      },
    ]
  }
}
