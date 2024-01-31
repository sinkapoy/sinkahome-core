# sinkahome-core

sinkahome-core is a framework for creating a home automation system. It is built on top of the ECS (Entity-Component-System) from the ash package. Automation elements are represented in the engine as gadgets with a set of properties, events, and actions.

The entire automation system is built on adapter plugins, which convert devices from other systems into a unified gadget interface. This means that any protocol such as zigbee, miot, etc. can be transformed into an adapter system that converts signals within the ECS into messages of the selected protocol.

# TODO:
 - stable API for events (will appear with miot plugin)
 - testing actions with miot plugin
 - change the mechanism of write property events (probably, not sure. It works as is, but I want to make it more elegant and robust)
 - user auth and rules
 - global settings