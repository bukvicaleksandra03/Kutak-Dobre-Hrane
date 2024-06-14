import { Kitchen, Layout, Table, Toilet } from './models/layout';

const drawingSpace_x = 20;
const drawingSpace_y = 80;
const drawingSpace_width = 560;
const drawingSpace_height = 260;

const kitchen_width = 180;
const kitchen_height = 80;

const toilet_width = 80;
const toilet_height = 80;

const table_radius = 20;

export function mouseInDrawingSpace(x: number, y: number) {
  if (
    x > drawingSpace_x &&
    x < drawingSpace_x + drawingSpace_width &&
    y > drawingSpace_y &&
    y < drawingSpace_y + drawingSpace_height
  ) {
    return true;
  }
  return false;
}

export function drawDrawingSpaceBorders(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = 'black';
  ctx.strokeRect(
    drawingSpace_x,
    drawingSpace_y,
    drawingSpace_width,
    drawingSpace_height
  );
}

export function markTableAsSelected(
  tables: Table[],
  x: number,
  y: number,
  numPeople: number
): string {
  for (const table of tables) {
    if (
      Math.abs(x - table.x) < table_radius &&
      Math.abs(y - table.y) < table_radius
    ) {
      if (table.maxPeople < numPeople) {
        return 'Table you selected is not big enough';
      }
      if (table.taken) {
        return 'Table already taken, select another table';
      }
      table.selected = true;
      return 'Table selected';
    }
  }

  return 'Click on a table to select';
}

export function unmarkTableAsSeleceted(tables: Table[]) {
  tables.forEach((table) => {
    table.selected = false;
  });
}

export function addKitchenToLayout(layout: Layout, x: number, y: number) {
  layout.kitchens.push({
    x: x,
    y: y,
  });
}

export function addTableToLayout(
  layout: Layout,
  x: number,
  y: number,
  mp: number
) {
  let z = layout.tables.length;
  layout.tables.push({
    _id: '',
    maxPeople: mp,
    x: x,
    y: y,
    taken: false,
    selected: false,
  });
}

export function addToiletToLayout(layout: Layout, x: number, y: number) {
  layout.toilets.push({
    x: x,
    y: y,
  });
}

export function drawAll(layout: Layout, ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'black';
  layout.kitchens.forEach((kitchen) => {
    drawKitchenToCanvas(kitchen, ctx);
  });
  layout.toilets.forEach((toilet) => {
    drawToiletToCanvas(toilet, ctx);
  });
  layout.tables.forEach((table) => {
    drawTableToCanvas(table, ctx);
  });
}

export function drawKitchenToCanvas(
  kitchen: Kitchen,
  ctx: CanvasRenderingContext2D
) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Kitchen', kitchen.x, kitchen.y);
  ctx.strokeRect(
    kitchen.x - kitchen_width / 2,
    kitchen.y - kitchen_height / 2,
    kitchen_width,
    kitchen_height
  );
}

export function drawToiletToCanvas(
  toilet: Toilet,
  ctx: CanvasRenderingContext2D
) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Toilet', toilet.x, toilet.y);
  ctx.strokeRect(
    toilet.x - toilet_width / 2,
    toilet.y - toilet_height / 2,
    toilet_width,
    toilet_height
  );
}

export function drawTableToCanvas(table: Table, ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.arc(table.x, table.y, table_radius, 0, 2 * Math.PI);
  if (table.taken) {
    ctx.fillStyle = 'red';
    ctx.fill();
  }
  if (table.selected) {
    ctx.fillStyle = 'yellow';
    ctx.fill();
  }
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(table.maxPeople.toString(), table.x, table.y);
  ctx.stroke();
}

export function canAddKitchen(layout: Layout, x: number, y: number) {
  return canAddElem(layout, x, y, kitchen_width, kitchen_height);
}

export function canAddToilet(layout: Layout, x: number, y: number) {
  return canAddElem(layout, x, y, toilet_width, toilet_height);
}

export function canAddTable(layout: Layout, x: number, y: number) {
  return canAddElem(layout, x, y, table_radius * 2, table_radius * 2);
}

function canAddElem(
  layout: Layout,
  x: number,
  y: number,
  width: number,
  height: number
) {
  console.log('here');
  if (
    x - width / 2 > drawingSpace_x &&
    x + width / 2 < drawingSpace_x + drawingSpace_width &&
    y - height / 2 > drawingSpace_y &&
    y + height / 2 < drawingSpace_y + drawingSpace_height
  ) {
    for (let i = 0; i < layout.kitchens.length; i++) {
      if (
        Math.abs(layout.kitchens[i].x - x) < width / 2 + kitchen_width / 2 &&
        Math.abs(layout.kitchens[i].y - y) < height / 2 + kitchen_height / 2
      )
        return false;
    }
    for (let i = 0; i < layout.toilets.length; i++) {
      if (
        Math.abs(layout.toilets[i].x - x) < width / 2 + toilet_width / 2 &&
        Math.abs(layout.toilets[i].y - y) < height / 2 + toilet_height / 2
      )
        return false;
    }
    for (let i = 0; i < layout.tables.length; i++) {
      if (
        Math.abs(layout.tables[i].x - x) < width / 2 + table_radius &&
        Math.abs(layout.tables[i].y - y) < height / 2 + table_radius
      )
        return false;
    }

    return true;
  }
  console.log('returned false');
  return false;
}

export function removeElem(layout: Layout, x: number, y: number) {
  for (let i = 0; i < layout.kitchens.length; i++) {
    if (
      Math.abs(x - layout.kitchens[i].x) < kitchen_width / 2 &&
      Math.abs(y - layout.kitchens[i].y) < kitchen_height / 2
    ) {
      layout.kitchens.splice(i, 1);
      return;
    }
  }
  for (let i = 0; i < layout.toilets.length; i++) {
    if (
      Math.abs(x - layout.toilets[i].x) < toilet_width / 2 &&
      Math.abs(y - layout.toilets[i].y) < toilet_height / 2
    ) {
      layout.toilets.splice(i, 1);
      return;
    }
  }
  for (let i = 0; i < layout.tables.length; i++) {
    if (
      Math.abs(x - layout.tables[i].x) < table_radius &&
      Math.abs(y - layout.tables[i].y) < table_radius
    ) {
      layout.tables.splice(i, 1);
      return;
    }
  }
}

export function writeMessageAboveDrawingSpace(
  ctx: CanvasRenderingContext2D,
  color: string,
  text: string
) {
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    text,
    drawingSpace_x + drawingSpace_width / 2,
    drawingSpace_y - 8
  );
  ctx.stroke();
}

export function clearMessageAboveDrawingSpace(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(drawingSpace_x, drawingSpace_y - 16, drawingSpace_width, 15);
}

export function writeRestaurantName(
  ctx: CanvasRenderingContext2D,
  name: string
) {
  ctx.beginPath();
  ctx.moveTo(20, 20);
  ctx.lineTo(30, 15);
  ctx.lineTo(290, 15);
  ctx.lineTo(300, 20);
  ctx.lineTo(300, 40);
  ctx.lineTo(290, 45);
  ctx.lineTo(30, 45);
  ctx.lineTo(20, 40);
  ctx.lineTo(20, 20);
  ctx.fillStyle = 'yellow';
  ctx.fill();
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, (300 - 20) / 2 + 20, 30);
  ctx.stroke();
}

export function writeDateAndTime(ctx: CanvasRenderingContext2D, date: Date) {
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  var day = ('0' + date.getDate()).slice(-2);
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var today = date.getFullYear() + '-' + month + '-' + day;
  var hours = ('0' + date.getHours()).slice(-2);
  var minutes = ('0' + date.getMinutes()).slice(-2);
  var time = hours + ':' + minutes;
  ctx.fillText(today + ' ' + time, 535, 30);
}

export function clearDateAndTime(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(400, 20, 180, 20);
}

export function clearDrawingSpace(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(20, 80, 560, 260);
}
