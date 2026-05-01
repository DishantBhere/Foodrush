import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const menuRes = await fetch("http://localhost:3000/api/food-items");
    const menuData = await menuRes.json();

    const menuText = menuData
      .map((item: any) =>
        `- ${item.name}: ₹${item.price} | Category: ${item.category} | ${item.description || ""}`
      )
      .join("\n");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a helpful canteen assistant for Food Rush restaurant.
IMPORTANT: Only answer based on the menu below. Do not use outside knowledge.
If something is not in the menu, say "Sorry, we don't have that in our menu."
Keep responses short and friendly.

OUR MENU:
${menuText}`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 300,
      }),
    });

    const data = await response.json();
    console.log("GROQ RESPONSE:", JSON.stringify(data));

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return NextResponse.json({ reply: "Sorry, I could not get a response." });
    }

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("GROQ ERROR:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}