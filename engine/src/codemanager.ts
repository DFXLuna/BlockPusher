import { World as WorldBase } from "./world";
import { GameObject as GameObjectBase } from "./gameobject";
import { Render } from "./render";
import { Time } from "./time";
import { Input } from "./input";
import { AudioComponent as Audio } from "./audio";

interface GameObjectClassInfo {
    setupFunction: Function;
    objectClass: typeof GameObjectBase;
}

export namespace CodeManager {
    
    // We just pass user code an instance of the
    // world class to edit. There are a lot of weird
    // games we can play with prototype chains but they
    // can get very messy.
    var WorldSetupFunction: Function = ()=>{};
    export var World: WorldBase;

    // For object classes, we store the class and a setup function for each.
    // The setup function is built from user code and is used to populate the class.
    var gameObjectClasses: {[className: string]: GameObjectClassInfo} = {};
    
    export function setup() {
        World = new WorldBase();
        callSetupFunction(WorldSetupFunction);
        
        // TODO reset all those game object classes
    }

    function callSetupFunction(f: Function, objClass?: typeof GameObjectBase | undefined) {
        if (objClass != null)
            f(World,Render,Audio,Time,Input,objClass.prototype);
        else
            f(World,Render,Audio,Time,Input);
    }

    function makeSetupFunction(code: string, isObjectSetupFunc = false) {
        if (isObjectSetupFunc)
            return new Function("World","Render","Audio","Time","Input","GameObject",code);
        else
            return new Function("World","Render","Audio","Time","Input",code);
    }

    export function runScript(name: string, code: string | null) {
        if (name == "World.js") {
            if (code == null) {
                // Deleting the world script doesn't make sense.
                // Just give up.
                return;
            }

            WorldSetupFunction = makeSetupFunction(code);
            callSetupFunction(WorldSetupFunction);
        } else {
            let objClassName = name.split(".")[0];

            if (code == null) {
                delete gameObjectClasses[objClassName];
                return;
            }

            let classInfo = createObjectClassIfNotExist(objClassName);

            classInfo.setupFunction = makeSetupFunction(code,true);
            callSetupFunction(classInfo.setupFunction, classInfo.objectClass);
        }
    }

    export function getGameObjectClass(name: string) {
        return gameObjectClasses[name].objectClass;
    }

    export function getGameObjectClassName(obj: GameObjectBase) {
        for (let className in gameObjectClasses) {
            if (obj instanceof gameObjectClasses[className].objectClass)
                return className;
        }
    }

    export function getClassList() {
        let result: {[key: string]: string} = {};
        for (let className in gameObjectClasses) {
            result[className] = <string>gameObjectClasses[className].objectClass.prototype.image;
        }
        return result;
    }

    export function createObjectClassIfNotExist(objClassName: string) {
        let classInfo = gameObjectClasses[objClassName];

        if (classInfo == null) {
            classInfo = {
                objectClass: (class GameObject extends GameObjectBase {}),
                setupFunction: ()=>{}
            }
            gameObjectClasses[objClassName] = classInfo;
        }

        return classInfo;
    }
}
