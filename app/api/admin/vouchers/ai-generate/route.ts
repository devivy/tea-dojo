import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { segment, goal } = await request.json();

    const prompt = `You are a marketing expert for a tea shop called Tea Dojo. Generate a promotional voucher campaign based on the following:

Target Segment: ${segment}
Campaign Goal: ${goal}

Please provide a JSON response with the following structure:
{
  "code": "A short, memorable voucher code (6-10 uppercase letters/numbers)",
  "title": "A catchy title for the promotion",
  "description": "A brief description of the offer",
  "type": "Either 'percentage' or 'fixed' (for dollar amount off)",
  "value": A number (e.g., 10 for 10% or $10 off),
  "minOrderValue": Minimum order value required (number),
  "maxDiscount": Maximum discount cap for percentage offers (number or null),
  "usageLimit": Total number of times this voucher can be used (number or null),
  "minOrders": Minimum number of previous orders required (0 for new customers, 3+ for loyal customers),
  "expiresAt": Expiry date in YYYY-MM-DD format (30 days from now),
  "pushCopy": "A compelling push notification message to promote this offer (max 100 characters)"
}

Make the offer attractive but reasonable for a tea shop business. Consider the target segment and goal when determining the discount value and conditions.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a marketing expert specializing in F&B promotions. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const responseText = completion.choices[0].message.content?.trim() || '';
    
    // Extract JSON from markdown code blocks if present
    let jsonText = responseText;
    if (responseText.includes('```json')) {
      jsonText = responseText.split('```json')[1].split('```')[0].trim();
    } else if (responseText.includes('```')) {
      jsonText = responseText.split('```')[1].split('```')[0].trim();
    }

    const result = JSON.parse(jsonText);

    // Set expiry date to 30 days from now if not provided
    if (!result.expiresAt) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      result.expiresAt = expiryDate.toISOString().split('T')[0];
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating AI promo:', error);
    return NextResponse.json(
      { error: 'Failed to generate promo. Please try again.' },
      { status: 500 }
    );
  }
}
