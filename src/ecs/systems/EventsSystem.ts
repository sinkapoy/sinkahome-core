import { HomeSystem } from '../HomeSystem';
import { GadgetNode } from '../nodes/common';

export class EventsSystem extends HomeSystem {

    onInit(): void {
        this.setupNodeList({
            node: GadgetNode,
            onUpdate: this.onNodeUpdate.bind(this),
        });
    }

    onUpdate(_dt: number): void {
        //
    }

    onDestroy(): void {

    }

    private onNodeUpdate(node: GadgetNode) {
        const changed = [...node.properties.changedProps.values()];
        for (const prop of changed) {
            const property = node.properties.get(prop);
            if (property) {
                this.engine.emit('gadgetPropertyEvent', node.entity, property);
            }
        }
        node.properties.changedSignal.dispatch(node.entity, changed);
        node.properties.changedProps.clear();
    }
}