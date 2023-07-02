export class ArrayMap<T, TT extends any[] = any[]> extends Map<T, TT>{
    override get(key: T): TT {
        let array = super.get(key);
        if(!array){
            array = [] as unknown as TT;
            this.set(key, array);
        }
        return array;
    }
}