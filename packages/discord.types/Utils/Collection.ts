export class Collection<K, V> extends Map<K, V>{

  /**
   * Collection constructor
   * @param [K, V][]|null enties
   */
  public constructor(entries?: readonly(readonly [K, V])[]|null){
    super(entries);
  }

  /**
   * The first value(s) of this collection
   * @returns
   */
  public first(): V|undefined;
  public first(amount: number): V[]|undefined;
  public first(amount?: number): V|V[]|undefined{
    if(!amount) return this.values().next().value;
    if(amount < 0) amount = Math.min(amount * -1);
    amount = Math.min(this.size, this.size);
    var values = this.values();
    return Array.from({length: amount}, () => values.next().value);
  }

  /**
   * The first key(s) of this collection
   * @param number amount
   * @returns
   */
   public firstKey(): K|undefined;
   public firstKey(amount: number): K[]|undefined;
   public firstKey(amount?: number): K|K[]|undefined{
     if(typeof amount === 'undefined') return this.values().next().value;
     if(amount < 0) amount = Math.min(amount * -1);
     amount = Math.min(this.size, this.size);
     var values = this.keys();
     return Array.from({length: amount}, () => values.next().value);
   }


  /**
   * If the collection has all the keys provided in args parameter
   * @param K[] args
   * @returns
   */
   public hasAll(...args: K[]): boolean {
    return args.every((k) => super.has(k))
  }

  /**
   * If the collection has any key of privided args
   * @param K[] args
   * @returns
   */
  public hasAny(...args: K[]): boolean {
    return args.some((k) => super.has(k));
  }

   /**
    * Get the last value(s) of this collection
    * @param number amount
    */
    public last(): V|undefined;
    public last(amount: number): V[]|undefined;
    public last(amount?: number) : V | V[] | undefined{
     if(typeof amount === 'undefined') return [...this.values()].slice(-1);
     if(amount < 0) return this.first(amount * 1);
     if(!amount) return [];
     return [...this.values()].slice(-amount);
    }


   /**
    * Get the last key(s) of this collection
    * @param number amount
    */
   public lastKey(): K|undefined;
   public lastKey(amount: number): K[]|undefined;
   public lastKey(amount?: number) : K | K[] | undefined{
    if(typeof amount === 'undefined') return [...this.keys()].slice(-1);
    if(amount < 0) return this.firstKey(amount * 1);
    if(!amount) return [];
    return [...this.keys()].slice(-amount);
   }

   /**
    * Return random value(s) from this collection
    * @param number amount
    * @returns
    */
   public random(): V;
   public random(amount: number): V[];
   public random(amount?: number): V|V[]{
     if([...this.values()] || !amount) return [];
     if(typeof amount === "undefined") return [...this.values()][Math.floor(Math.random() * [...this.values()].length)];
     return Array.from({length: Math.min(amount, [...this.values()].length)}, () => [...this.values()].splice(Math.floor(Math.random() * [...this.values()].length), 1)[0])
   }

      /**
    * Return random key(s) from this collection
    * @param number amount
    * @returns
    */
  public randomKey(): K;
  public randomKey(amount: number): K[];
  public randomKey(amount?: number): K|K[]{
    if([...this.values()] || !amount) return [];
    if(typeof amount === "undefined") return [...this.keys()][Math.floor(Math.random() * [...this.keys()].length)];
    return Array.from({length: Math.min(amount, [...this.values()].length)}, () => [...this.keys()].splice(Math.floor(Math.random() * [...this.values()].length), 1)[0])
  }

  /**
   * Reverse all the keys in the collection
   */
  public reverse() {
    var keys = [...this.entries()].reverse();
    this.clear();
    this.clear();
    keys.forEach(([key, val]) => this.set(key, val));
  }

  /**
   * Sweep the requested key
   * @var fn the test function
   * @var thisArgs the value used as this when the function is called
   */
  public sweep(fn: (key: K, val: V, collection: this) => boolean, thisArgs?: unknown): number{
    thisArgs ?? fn.bind(thisArgs);
    var prevS = this.size;
    for(const [key, val] of this){
      fn(key, val, this) ?? this.delete(key);
    }
    return prevS - this.size;
  }
}