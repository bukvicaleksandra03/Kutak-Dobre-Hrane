export class Table {
  _id: string = '';
  maxPeople: number = 0;
  x: number = 0;
  y: number = 0;

  taken: boolean = false;
  selected: boolean = false;
}

export class Kitchen {
  x: number = 0;
  y: number = 0;
}

export class Toilet {
  x: number = 0;
  y: number = 0;
}

export class Layout {
  kitchens: Kitchen[] = [];
  toilets: Toilet[] = [];
  tables: Table[] = [];
}
