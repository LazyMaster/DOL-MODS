
Renderer.CanvasModels["main"].layers.sclera.srcfn=function(options) {
    return 'img/face/' + options.facestyle + '/' + options.BE_eyes_type + (options.eyes_bloodshot ? "sclerabloodshot" : "sclera") + '.png'
}
Renderer.CanvasModels["main"].layers.left_iris.srcfn=function(options) {
    return 'img/face/' + options.facestyle + '/'+ options.BE_eyes_type  + (options.trauma ? "irisempty" : "iris") + (options.BE_eyeorg ? "_org" : "") + '_left.png'
}
Renderer.CanvasModels["main"].layers.right_iris.srcfn=function(options) {
    return 'img/face/' + options.facestyle + '/'+ options.BE_eyes_type  + (options.trauma ? "irisempty" : "iris") + (options.BE_eyeorg ? "_org" : "") + '_right.png'
}
Renderer.CanvasModels["main"].layers.eyelids.srcfn=function(options) {
    return 'img/face/' + options.facestyle + '/'+ options.BE_lashes_type  + 'eyelids' + (options.eyes_half ? "_halfclosed" : "") + '.png'
}
Renderer.CanvasModels["main"].layers.lashes.srcfn=function(options) {
    return 'img/face/' + options.facestyle + '/'+ options.BE_lashes_type  + 'lashes' + (options.eyes_half ? "_halfclosed" : "") + '.png'
}
//增加layer
Renderer.CanvasModels["main"].layers.pussy_cum={
    srcfn(options) {
        return 'img/face/' + options.facestyle+ '/' +options.BE_side_type + 'pussy_cum' + options.pussy_cum + '.png'
    },
    showfn(options) {
        return options.show_face && options.pussy_cum !== "none"
    },
    filters: ["body"],
    z: ZIndices.pussy_cum , 
    animation: "idle" 
}
Renderer.CanvasModels["main"].layers.pussy={
    srcfn(options) {
        return 'img/face/' + options.facestyle+ '/' +options.BE_side_type + 'pussy' + options.pussy + '.png'
    },
    showfn(options) {
        return options.show_face && options.pussy_cum !== "none"
    },
    filters: ["body"],
    z: ZIndices.pussy , 
    animation: "idle" 
}
Renderer.CanvasModels["main"].layers.breasts.srcfn=function(options){
    if (options.mannequin) {
        return "img/body/mannequin/breasts/" +
            (options.breast_size - 1) +
            (options.breasts === "cleavage" && options.breast_size >= 4 ? "_clothed" : "") + ".png"
    } else {
        if (options.breast_size <= 0) return "";
        let fn = "breasts" + options.breast_size + (options.breasts === "cleavage" && options.breast_size >= 3 ? "_clothed" : "") + ".png";
        return "img/body/breasts/" + options.BE_breasts_type  + fn;
    }
}
//basehead
Renderer.CanvasModels["main"].layers.basehead.srcfn=function(options) {
    if (options.mannequin) return "img/body/mannequin/basehead.png"
    if (options.BE_side_type === "") return "img/body/basehead.png"
    return 'img/face/' + options.facestyle+ '/' +options.BE_side_type + 'basehead.png'
}
//init
//--修改defaultOptions
function decorator(originalFunction) {
    return function() {
        const options = originalFunction(); 
        options["pussy_cum"] = 0;
        options["pussy"] = 0;
        options["BE_lashes_type"] = "";
        options["BE_eyes_type"] = "";
        options["BE_breasts_type"] = "";
        options["BE_side_type"] = "";
        return options
    };
}
Renderer.CanvasModels["main"].defaultOptions = decorator(Renderer.CanvasModels["main"].defaultOptions);

