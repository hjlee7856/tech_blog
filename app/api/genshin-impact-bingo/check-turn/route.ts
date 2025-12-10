import { NextResponse } from 'next/server';

import { validateAndAutoAdvanceTurn } from '../../../(util)/genshin-impact-bingo/lib/game';

export async function POST() {
  const result = await validateAndAutoAdvanceTurn();

  return NextResponse.json(result);
}
