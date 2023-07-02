import { eventsTest } from "./eventsTest";

const functions = [eventsTest];
console.log('start testing');
functions.forEach((f)=>{
    if(f()){
        console.log(f.name + ' pass');
    } else {
        console.error(f.name + ' error');
    }
});