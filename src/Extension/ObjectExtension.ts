
declare global {
    interface Object {
        getPropertyByPath(path: string, _default: any): any;
    }
}

Object.prototype.getPropertyByPath = function(path: string, _default: any = undefined): any
{
    const obj = Object(this);

    if(obj.hasOwnProperty(path)) {
        return obj[path];
    }

    const dotIndex = path.indexOf('.');
    const prop = path.substr(0, dotIndex);

    if(dotIndex >= 0 && obj.hasOwnProperty(prop)) {
        return obj[prop].getPropertyByPath(path.substr(dotIndex+1), _default);
    }

    return _default;
}



export {};