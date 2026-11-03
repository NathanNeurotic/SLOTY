import type { SymbolId } from '../../engine/types';

// SLOTY's own free-play math model (not lottery-calibrated)
// 50-stop reel strips with 3 rows per reel (5x3, 25 paylines)
export const TIMBER_REEL_STRIPS: SymbolId[][] = [
  // Reel 1: 1 owl, [2, 2] acorns (4 acorns), 1 bear
  [
    'WOOD_A', 'WOOD_K', 'WOOD_Q', 'WOOD_J', 'MUSHROOM', 'ACORN', 'ACORN', 'BERRIES', 'PINECONE', 'FOX',
    'WOOD_J', 'WOOD_Q', 'WOOD_K', 'WOOD_A', 'BEAR', 'SQUIRREL', 'WOLF', 'OWL', 'RACCOON', 'FOX',
    'MUSHROOM', 'BERRIES', 'ACORN', 'ACORN', 'PINECONE', 'WOOD_A', 'WOOD_K', 'WOOD_Q', 'WOOD_J', 'SQUIRREL',
    'MUSHROOM', 'WOLF', 'FOX', 'RACCOON', 'WOOD_K', 'WOOD_Q', 'WOOD_J', 'WOOD_A', 'BERRIES', 'PINECONE',
    'MUSHROOM', 'SQUIRREL', 'WOOD_K', 'WOOD_Q', 'WOOD_J', 'WOLF', 'FOX', 'RACCOON', 'PINECONE', 'WOOD_A',
  ],
  // Reel 2: 2 owls, [2, 2] acorns (4 acorns), 2 bears
  [
    'WOOD_K', 'WOOD_Q', 'WOOD_J', 'WOOD_A', 'BEAR', 'MUSHROOM', 'ACORN', 'ACORN', 'BERRIES', 'PINECONE',
    'FOX', 'RACCOON', 'SQUIRREL', 'WOLF', 'OWL', 'WOOD_J', 'WOOD_Q', 'WOOD_K', 'WOOD_A', 'MUSHROOM',
    'BERRIES', 'PINECONE', 'FOX', 'BEAR', 'SQUIRREL', 'ACORN', 'ACORN', 'WOOD_J', 'WOOD_Q', 'WOOD_A',
    'WOOD_K', 'WOOD_Q', 'WOOD_J', 'WOLF', 'RACCOON', 'FOX', 'MUSHROOM', 'BERRIES', 'OWL', 'SQUIRREL',
    'PINECONE', 'WOOD_A', 'WOOD_K', 'WOOD_Q', 'WOOD_J', 'MUSHROOM', 'FOX', 'WOLF', 'RACCOON', 'WOOD_K',
  ],
  // Reel 3: 2 owls, [2, 2] acorns (4 acorns), 2 bears
  [
    'WOOD_Q', 'WOOD_J', 'WOOD_A', 'WOOD_K', 'FOX', 'RACCOON', 'WOLF', 'ACORN', 'ACORN', 'MUSHROOM',
    'BERRIES', 'PINECONE', 'BEAR', 'OWL', 'SQUIRREL', 'WOOD_J', 'WOOD_Q', 'WOOD_K', 'WOOD_A', 'MUSHROOM',
    'BERRIES', 'PINECONE', 'FOX', 'RACCOON', 'SQUIRREL', 'WOOD_J', 'ACORN', 'ACORN', 'WOOD_Q', 'WOOD_K',
    'WOOD_A', 'BEAR', 'WOLF', 'MUSHROOM', 'BERRIES', 'PINECONE', 'OWL', 'FOX', 'RACCOON', 'WOOD_A',
    'WOOD_K', 'WOOD_Q', 'WOOD_J', 'SQUIRREL', 'MUSHROOM', 'WOLF', 'FOX', 'PINECONE', 'WOOD_A', 'WOOD_Q',
  ],
  // Reel 4: 2 owls, [2, 2] acorns (4 acorns), 2 bears
  [
    'WOOD_J', 'WOOD_Q', 'WOOD_K', 'WOOD_A', 'WOLF', 'FOX', 'RACCOON', 'ACORN', 'ACORN', 'MUSHROOM',
    'BERRIES', 'PINECONE', 'BEAR', 'OWL', 'SQUIRREL', 'WOOD_J', 'WOOD_Q', 'WOOD_K', 'WOOD_A', 'MUSHROOM',
    'BERRIES', 'FOX', 'RACCOON', 'ACORN', 'ACORN', 'SQUIRREL', 'WOLF', 'BEAR', 'WOOD_Q', 'WOOD_J',
    'WOOD_K', 'WOOD_A', 'MUSHROOM', 'BERRIES', 'PINECONE', 'FOX', 'OWL', 'RACCOON', 'SQUIRREL', 'WOOD_A',
    'WOOD_K', 'WOOD_Q', 'WOOD_J', 'WOLF', 'ACORN', 'MUSHROOM', 'FOX', 'PINECONE', 'WOOD_A', 'WOOD_K',
  ],
  // Reel 5: 1 owl, [2, 2] acorns (4 acorns), 2 bears
  [
    'WOOD_A', 'WOOD_K', 'WOOD_Q', 'WOOD_J', 'FOX', 'RACCOON', 'WOLF', 'ACORN', 'ACORN', 'MUSHROOM',
    'BERRIES', 'PINECONE', 'BEAR', 'OWL', 'SQUIRREL', 'WOOD_J', 'WOOD_Q', 'WOOD_K', 'WOOD_A', 'MUSHROOM',
    'BERRIES', 'PINECONE', 'FOX', 'RACCOON', 'ACORN', 'ACORN', 'SQUIRREL', 'WOLF', 'BEAR', 'WOOD_J',
    'WOOD_Q', 'WOOD_K', 'WOOD_A', 'MUSHROOM', 'FOX', 'RACCOON', 'WOOD_A', 'WOOD_K', 'WOOD_Q', 'WOOD_J',
    'SQUIRREL', 'WOLF', 'PINECONE', 'MUSHROOM', 'FOX', 'WOOD_A', 'WOOD_K', 'WOOD_Q', 'WOOD_J', 'BEAR',
  ],
];
