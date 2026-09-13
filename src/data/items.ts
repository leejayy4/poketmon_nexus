import { createCatalog, type DefinitionOrigin } from './catalog';

export type InventoryKey = 'pokeBalls' | 'potions';
export type ItemEffect = { readonly kind: 'capture'; readonly baseChance: number; readonly guaranteedHpRatio: number }
  | { readonly kind: 'heal'; readonly hp: number; readonly revives: false };
export interface RuntimeItem {
  readonly id: string;
  readonly inventoryKey: InventoryKey;
  readonly name: string;
  readonly price: number;
  readonly effect: ItemEffect;
}
export const ITEM_ORIGIN: DefinitionOrigin = Object.freeze({
  kind: 'project', source: 'existing journey-services/battle/team item contract',
  implementation: 'runtime', verification: 'not-verified-by-catalog',
});
export const POKE_BALL = Object.freeze({
  id: 'IT-poke-ball', inventoryKey: 'pokeBalls', name: '몬스터볼', price: 200,
  effect: Object.freeze({ kind: 'capture', baseChance: 0.55, guaranteedHpRatio: 0.5 }),
} as const);
export const POTION = Object.freeze({
  id: 'IT-potion', inventoryKey: 'potions', name: '상처약', price: 200,
  effect: Object.freeze({ kind: 'heal', hp: 20, revives: false }),
} as const);
export const ITEMS = createCatalog<string, RuntimeItem>('items', [POKE_BALL, POTION], row => row.id);
// Keep slot order and saved inventory keys compatible with every existing shop.
export const BASIC_SHOP_ITEMS = [POKE_BALL, POTION].map(item => ({
  key: item.inventoryKey, name: item.name, price: item.price, source: item.id,
}));

