import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

// This is the main serverless function handler for Vercel.
export default async (req, res) => {
  // Allow requests from any origin (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle pre-flight OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Ensure the request is a POST request.
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const kuroshiro = new Kuroshiro();
    // Initialize with the Kuromoji analyzer.
    await kuroshiro.init(new KuromojiAnalyzer()); 

    // Get the text from the request body.
    const { text, mode, to } = req.body;

    // Perform the conversion.
    const result = await kuroshiro.convert(text, {
      to: to || 'romaji',
      mode: mode || 'furigana',
      romajiSystem: 'hepburn'
    });
    
    // Send a successful response.
    res.status(200).json({ ok: true, result });

  } catch (error) {
    // Send an error response if something goes wrong.
    res.status(500).json({ ok: false, error: error.message });
  }
};
