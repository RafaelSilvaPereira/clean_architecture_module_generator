export const main = () => {
  console.log('main');
  
}

export class X {
  readonly x: any;
  constructor(builder: {x: any}) {
    Object.assign(this, builder);
  }
}