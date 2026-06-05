import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// どのサイトからのアクセスも許可するCORS設定
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // ブラウザからの事前確認リクエスト（OPTIONS）への対応
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // タスクバーヒーローのSteam AppID
    const appId = '3678970'; 
    const steamApiUrl = `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appId}`;

    // Steam APIからデータを取得
    const steamResponse = await fetch(steamApiUrl);
    const data = await steamResponse.json();

    // 取得した人数データをフロントエンド（HTML）に返す
    return new Response(
      JSON.stringify({ players: data.response.player_count }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})