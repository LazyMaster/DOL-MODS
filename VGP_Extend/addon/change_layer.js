
Renderer.CanvasModels["main"].layers.sclera.srcfn=function(options) {
    return 'img/face/' + options.facestyle +'/' + (options.SE_eyes_type ? options.SE_eyes_type : "")  + (options.eyes_bloodshot ? "sclerabloodshot" : "sclera") + '.png'
}
Renderer.CanvasModels["main"].layers.left_iris.srcfn=function(options) {
    const iris = options.trauma ? "irisempty" : "iris";
	const half = options.SE_eyeorg ? "_org" : (options.eyes_half ? "_halfclosed" : "");
    return 'img/face/' + options.facestyle +'/' + (options.SE_eyes_type ? options.SE_eyes_type : "")  + iris  + half + '_left.png'
}
Renderer.CanvasModels["main"].layers.right_iris.srcfn=function(options) {
    const iris = options.trauma ? "irisempty" : "iris";
	const half = options.SE_eyeorg ? "_org" : (options.eyes_half ? "_halfclosed" : "");
    return 'img/face/' + options.facestyle +'/' + (options.SE_eyes_type ? options.SE_eyes_type : "")  + iris  + half + '_right.png'
}
Renderer.CanvasModels["main"].layers.eyelids.srcfn=function(options) {
    return 'img/face/' + options.facestyle +'/' + (options.SE_eyes_type ? options.SE_eyes_type : "")  + 'eyelids' + (options.eyes_half ? "_halfclosed" : "") + '.png'
}
Renderer.CanvasModels["main"].layers.lashes.srcfn=function(options) {
    return 'img/face/' + options.facestyle +'/' + (options.SE_eyes_type ? options.SE_eyes_type : "")  + 'lashes' + (options.eyes_half ? "_halfclosed" : "") + '.png'
}
Renderer.CanvasModels["main"].layers.brows.srcfn=function(options) {
    return 'img/face/' + options.facestyle +'/'+ (options.SE_brows_type? options.SE_brows_type: "")  + 'brow' + options.brows + '.png'
}
Renderer.CanvasModels["main"].layers.mouth.srcfn=function(options) {
    return 'img/face/' + options.facestyle +'/' + (options.SE_mouth_type? options.SE_mouth_type: "") + 'mouth' + options.mouth + '.png'
}
Renderer.CanvasModels["main"].layers.breasts.srcfn=function(options){
    if (options.mannequin) {
        return "img/body/mannequin/breasts/" +
            (options.breast_size - 1) +
            (options.breasts === "cleavage" && options.breast_size >= 4 ? "_clothed" : "") + ".png"
    } else {
        if (options.breast_size <= 0) return "";
        let fn = "breasts" + options.breast_size + (options.breasts === "cleavage" && options.breast_size >= 3 ? "_clothed" : "") + ".png";
        return "img/body/breasts/" + options.SE_breasts_type  + fn;
    }
}

//basehead
Renderer.CanvasModels["main"].layers.basehead.srcfn=function(options) {
    if (options.mannequin) return "img/body/mannequin/basehead.png"
    if (options.SE_head_type === "") return "img/body/basehead.png"
    return 'img/face/' + options.facestyle+ '/' +options.SE_head_type + 'basehead.png'
}

//增加layer
Renderer.CanvasModels["main"].layers.side_border={
    srcfn(options) {
        return 'img/face/' + options.facestyle+ '/' +options.SE_side_type + 'side_border.png'
    },
    showfn(options) {
        return options.show_face
    },
    filters: ["SE_border"],
    z: ZIndices.side_border , //120 
    animation: "idle" 
}

//----------------------------------------
//--修改


setup.SE = {
    'type_init' : {
        "eyes_type" : "",
        "breasts_type" : "",
        "side_type" : "",
        "head_type": "",
        "mouth_type": "",
        "brows_type": ""
    },
    'type_b_list' : {
        "eyes_type" : false,
        "breasts_type" : false,
        "side_type" : false,
        "pussy_type": false,
        "head_type": false,
        "mouth_type": false,
        "brows_type": false
    },
    'init': {
        "org_last_blush" : "0",
        "easyerblush" : "0",
        "left_lashes" : false,
        "right_lashes" : false
    },
    update(){
        if (V.SE === undefined)V.SE = {};
        //update
        for (let key in this.init) {
            if (V.SE[key] === undefined) V.SE[key] = this.init[key];
        }
        for (let key in this.type_init) {
            if (V.SE[key] === undefined) V.SE[key] = this.type_init[key];
        }
    },
    layer_loader(){
        let _text = ''
        for(let key in this.type_init){
            _text += '<<set _modeloptions.SE_'+ key +' to $SE.' + key +'>>'
        }
        return _text
    },
    simple_type_choice(type_name,num,buttum_name_list =false){
        let _text = ''
        _text += '<<listbox "$SE.' + type_name + '_type" autoselect>>'
	    _text += '  <<option "Default" "">>'
        if (buttum_name_list){
            for(let i = 0;i < num;i ++){
                _text += '  <<option "' + buttum_name_list[i] +'" "SE_' + type_name + '_' + i + '/">>'
            }
        }else{
            for(let i = 0;i < num;i ++){
                _text += '  <<option "SE_' + type_name+'_' + i + '" "SE_' + type_name + '_' + i + '/">>'
            }
        }
        _text += '<</listbox>>'
        _text += '<br><br>'
        return _text
    },
    type_choice_b(vari,buttums){
        let _text = ''
        _text += '<<listbox \"' + vari + '\" autoselect>>'
	    _text += '  <<option "Default" "">>'
        for(let buttum in buttums){
	        _text += '  <<option \"' + buttum + '\" \"' + buttums[buttum] + '\">>'
        }
        _text += '<</listbox>>'
        _text += '<br>'
        return _text
    },
    colour_choice(vari){
        let _text = ''
        _text += '<<listbox \"' + vari + '\" autoselect>>'
        for(let buttum of ["black", "blue", "brown", "green", "pink", "purple", "red", "tangerine", "teal", "white", "yellow"]){
	        _text += '  <<option \"' + buttum + '\" \"' + buttum + '\">>'
        }
        _text += '<</listbox>>'
        _text += '<br><br>'
        return _text
    }
}


