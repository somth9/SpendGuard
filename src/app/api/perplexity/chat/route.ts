import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { messages, spendGuardData } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.PERPLEXITY_API_KEY;
    
    if (!apiKey) {
      console.error('Perplexity API key not configured');
      return NextResponse.json(
        { error: 'Perplexity API key not configured' },
        { status: 500 }
      );
    }

    const conversationMessages = messages.filter((msg: any, index: number) => {
      if (msg.role === 'user') return true;
      if (msg.role === 'assistant' && index > 0) {
        return messages[index - 1].role === 'user';
      }
      return false;
    });

    const buildSpendGuardContext = (data: any) => {
      const parts = [];
      
      parts.push('=== USER PROFILE ===');
      parts.push(`Level: ${data.userStats?.currentLevel || 1}`);
      parts.push(`Current Streak: ${data.userStats?.currentStreak || 0} days`);
      parts.push(`Longest Streak: ${data.userStats?.longestStreak || 0} days`);
      parts.push(`Total Points: ${data.userStats?.totalPointsEarned || 0}`);
      parts.push(`Total Saved: $${data.userStats?.totalSaved?.toFixed(2) || '0.00'}`);
      parts.push(`Total Spent: $${data.userStats?.totalSpent?.toFixed(2) || '0.00'}`);
      parts.push(`ADHD Tax Total: $${data.userStats?.adhdTaxTotal?.toFixed(2) || '0.00'}`);
      
      parts.push('\n=== USER SETTINGS ===');
      parts.push(`Impulse Threshold: $${data.userSettings?.impulseThreshold || 50}`);
      parts.push(`Cooldown Period: ${data.userSettings?.cooldownHours || 48} hours`);
      parts.push(`Monthly Budget: $${data.userSettings?.monthlyBudget || 'Not set'}`);
      parts.push(`Currency: ${data.userSettings?.currency || 'USD'}`);

      if (data.badges && data.badges.length > 0) {
        parts.push('\n=== EARNED BADGES ===');
        parts.push(data.badges.join(', '));
      }

      if (data.wishlistItems && data.wishlistItems.length > 0) {
        parts.push('\n=== CURRENT WISHLIST ===');
        data.wishlistItems.forEach((item: any, idx: number) => {
          const cooldownStatus = item.status === 'cooling_down' ? 
            `(cooling down until ${new Date(item.cooldownEndsAt).toLocaleDateString()})` : 
            `(${item.status})`;
          parts.push(`${idx + 1}. ${item.name} - $${item.price} ${cooldownStatus}`);
          if (item.category) parts.push(`   Category: ${item.category}`);
          if (item.moodTag) parts.push(`   Mood when added: ${item.moodTag}`);
          if (item.contextTag) parts.push(`   Context: ${item.contextTag}`);
          if (item.notes) parts.push(`   Notes: ${item.notes}`);
        });
      }

      if (data.recentPurchases && data.recentPurchases.length > 0) {
        parts.push('\n=== RECENT PURCHASES (Last 10) ===');
        data.recentPurchases.slice(0, 10).forEach((purchase: any, idx: number) => {
          const date = new Date(purchase.date).toLocaleDateString();
          const impulseTag = purchase.wasImpulse ? '[IMPULSE]' : '[PLANNED]';
          parts.push(`${idx + 1}. ${purchase.name} - $${purchase.amount} ${impulseTag} on ${date}`);
          if (purchase.category) parts.push(`   Category: ${purchase.category}`);
          if (purchase.moodTag) parts.push(`   Mood: ${purchase.moodTag}`);
          if (purchase.contextTag) parts.push(`   Context: ${purchase.contextTag}`);
        });
      }

      if (data.adhdTaxItems && data.adhdTaxItems.length > 0) {
        parts.push('\n=== ADHD TAX ITEMS (Last 10) ===');
        data.adhdTaxItems.slice(0, 10).forEach((item: any, idx: number) => {
          const date = new Date(item.date).toLocaleDateString();
          parts.push(`${idx + 1}. ${item.type}: ${item.description} - $${item.amount} on ${date}`);
          if (item.notes) parts.push(`   Notes: ${item.notes}`);
        });
      }

      if (data.recentRewards && data.recentRewards.length > 0) {
        parts.push('\n=== RECENT ACHIEVEMENTS (Last 5) ===');
        data.recentRewards.slice(0, 5).forEach((reward: any, idx: number) => {
          const date = new Date(reward.earnedAt).toLocaleDateString();
          if (reward.type === 'points') {
            parts.push(`${idx + 1}. +${reward.points} points: ${reward.description} (${date})`);
          } else if (reward.type === 'badge') {
            parts.push(`${idx + 1}. 🏆 Badge: ${reward.description} (${date})`);
          }
        });
      }

      if (data.recentPurchases && data.recentPurchases.length > 0) {
        parts.push('\n=== SPENDING SUMMARY ===');
        const byCategory: Record<string, number> = {};
        const byMood: Record<string, number> = {};
        let impulseCount = 0;
        let plannedCount = 0;
        
        data.recentPurchases.forEach((p: any) => {
          if (p.category) {
            byCategory[p.category] = (byCategory[p.category] || 0) + p.amount;
          }
          if (p.moodTag) {
            byMood[p.moodTag] = (byMood[p.moodTag] || 0) + p.amount;
          }
          if (p.wasImpulse) impulseCount++;
          else plannedCount++;
        });

        parts.push(`Total Purchases Tracked: ${data.recentPurchases.length}`);
        parts.push(`Impulse: ${impulseCount} | Planned: ${plannedCount}`);
        
        if (Object.keys(byCategory).length > 0) {
          parts.push('\nSpending by Category:');
          Object.entries(byCategory)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .forEach(([cat, amt]) => {
              parts.push(`  ${cat}: $${(amt as number).toFixed(2)}`);
            });
        }

        if (Object.keys(byMood).length > 0) {
          parts.push('\nSpending by Mood:');
          Object.entries(byMood)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .forEach(([mood, amt]) => {
              parts.push(`  ${mood}: $${(amt as number).toFixed(2)}`);
            });
        }
      }

      return parts.join('\n');
    };

    const spendGuardContext = buildSpendGuardContext(spendGuardData || {});
    
    const systemMessage = {
      role: 'system',
      content: `You are a supportive financial assistant for SpendGuard, an app designed to help ADHD adults practice mindful spending. 

CRITICAL INSTRUCTIONS - READ CAREFULLY:
⚠️ You MUST respond based ONLY on the SpendGuard user data provided below
⚠️ DO NOT use web search capabilities - ignore any web search results
⚠️ DO NOT provide general financial advice from external sources
⚠️ ONLY analyze and reference the specific data in the USER'S SPENDGUARD DATA section below
⚠️ If asked about something not in the user's data, acknowledge this and suggest they track it in SpendGuard

YOUR ROLE:
- Analyze the user's specific SpendGuard spending patterns and data
- Be encouraging, non-judgmental, and understanding of ADHD challenges
- Offer actionable advice based ONLY on their actual tracked patterns
- Celebrate their wins and help them learn from setbacks
- Reference specific numbers, items, and dates from their profile

RESPONSE RULES:
✓ DO reference specific purchases, wishlist items, and amounts from the data below
✓ DO mention their actual streaks, points, and savings numbers
✓ DO analyze patterns visible in their mood tags and categories
✓ DO be personal and specific to their journey
✗ DON'T use information not present in the data below
✗ DON'T cite external sources or general statistics
✗ DON'T make up data points
✗ DON'T reference web search results

===== USER'S SPENDGUARD DATA (YOUR ONLY DATA SOURCE) =====
${spendGuardContext}
===== END OF SPENDGUARD DATA =====

Remember: Base your entire response on the data between the equal signs above. Be specific, warm, and helpful using ONLY their SpendGuard information.`
    };

    const enhancedMessages = [systemMessage, ...conversationMessages];

    console.log('Sending messages to Perplexity:', JSON.stringify(enhancedMessages.map(m => ({ role: m.role })), null, 2));

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: enhancedMessages,
        temperature: 0.7,
        max_tokens: 1000,
        search_domain_filter: [],
        return_related_questions: false,
        return_images: false,
        return_citations: false,
      }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: 'Failed to parse error response' };
      }
      console.error('Perplexity API error status:', response.status);
      console.error('Perplexity API error details:', JSON.stringify(errorData, null, 2));
      return NextResponse.json(
        { error: `Perplexity API error: ${JSON.stringify(errorData)}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      message: data.choices?.[0]?.message?.content || 'No response from AI',
      usage: data.usage,
    });

  } catch (error: any) {
    console.error('Error in Perplexity chat route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

