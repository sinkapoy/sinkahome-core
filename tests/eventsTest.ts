import { HomeSystem } from "@root/src/ecs/HomeSystem";
import { HomeEngine } from "@root/src/ecs/HomeEngine";

class System1 extends HomeSystem {
    pass = false;
    onInit(): void {
        this.setupEvent('testEvent', (arg1: string, arg2: string)=>{
            if(arg1 === 'arg1' && arg2 === 'arg2'){
                this.pass = true;
            }
        })
    }

    onUpdate(dt: number): void {
        //
    }

    onDestroy(): void {
        //
    }
}

export function eventsTest(){
    const engine = new HomeEngine();
    const system = new System1();
    engine.addSystem(system, 0);

    engine.emit('testEvent', 'arg1', 'arg2');
    engine.update(0);
    
    return system.pass;
}

