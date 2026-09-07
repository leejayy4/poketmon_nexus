import type { Direction } from './types';

// Two columns; move in the displayed direction, skipping absent final-row cells.
export function gridSelection(index:number,count:number,direction:Direction):number{
  if(count<=1)return 0;
  if(direction==='left'||direction==='right'){
    const other=index%2?index-1:index+1;return other<count?other:index;
  }
  const column=Array.from({length:count},(_,i)=>i).filter(i=>i%2===index%2);
  return column[(column.indexOf(index)+(direction==='up'?-1:1)+column.length)%column.length];
}
