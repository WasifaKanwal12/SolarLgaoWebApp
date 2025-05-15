export async function POST(request) {
  const { location, electricity_kwh_per_month, usage_prompt } = await request.json();

  try {
    // Call the FastAPI endpoint
    const fastApiResponse = await fetch('http://127.0.0.1:8000/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location,
        electricity_kwh_per_month: electricity_kwh_per_month ? parseInt(electricity_kwh_per_month) : null,
        usage_prompt: usage_prompt || null
      }),
    });

    if (!fastApiResponse.ok) {
      const errorData = await fastApiResponse.json();
      throw new Error(errorData.detail || 'Failed to get solar recommendation');
    }

    const data = await fastApiResponse.json();
    
    // Return the data as is (the frontend will transform it)
    return Response.json(data);

  } catch (error) {
    console.error('Recommendation error:', error);
    return Response.json(
      { error: error.message || 'Failed to generate recommendation' },
      { status: 500 }
    );
  }
}