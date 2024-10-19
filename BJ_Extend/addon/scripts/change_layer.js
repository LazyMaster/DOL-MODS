
Renderer.CanvasModels["main"].layers.sclera.srcfn=function(options) {
    return 'img/face/' + options.facestyle + '/' + (options.BE_eyes_type||"") + (options.eyes_bloodshot ? "sclerabloodshot" : "sclera") + '.png'
}
Renderer.CanvasModels["main"].layers.left_iris.srcfn=function(options) {
    return 'img/face/' + options.facestyle + '/'+ (options.BE_eyes_type||"")  + (options.trauma ? "irisempty" : "iris") + (options.BE_eyeorg ? "_org" : "") + '_left.png'
}
Renderer.CanvasModels["main"].layers.right_iris.srcfn=function(options) {
    return 'img/face/' + options.facestyle + '/'+ (options.BE_eyes_type||"")  + (options.trauma ? "irisempty" : "iris") + (options.BE_eyeorg ? "_org" : "") + '_right.png'
}
Renderer.CanvasModels["main"].layers.eyelids.srcfn=function(options) {
    return 'img/face/' + options.facestyle + '/'+ (options.BE_eyes_type||"")  + 'eyelids' + (options.eyes_half ? "_halfclosed" : "") + '.png'
}
Renderer.CanvasModels["main"].layers.lashes.srcfn=function(options) {
    return 'img/face/' + options.facestyle + '/'+ (options.BE_eyes_type||"")  + 'lashes' + (options.eyes_half ? "_halfclosed" : "") + '.png'
}
Renderer.CanvasModels["main"].layers.brows.srcfn=function(options) {
    return 'img/face/' + options.facestyle + '/'+ (options.BE_brows_type||"")  + 'brow' + options.brows + '.png'
}

Renderer.CanvasModels["main"].layers.breasts.srcfn=function(options){
    if (options.mannequin) {
        return "img/body/mannequin/breasts/" +
            (options.breast_size - 1) +
            (options.breasts === "cleavage" && options.breast_size >= 4 ? "_clothed" : "") + ".png"
    } else {
        if (options.breast_size <= 0) return "";
        let fn = "breasts" + options.breast_size + (options.breasts === "cleavage" && options.breast_size >= 3 ? "_clothed" : "") + ".png";
        return "img/body/breasts/" + (options.BE_breasts_type||"")  + fn;
    }
}

//basehead
Renderer.CanvasModels["main"].layers.basehead.srcfn=function(options) {
    if (options.mannequin) return "img/body/mannequin/basehead.png"
    if (!options.BE_head_type) return "img/body/basehead.png"
    return 'img/face/' + options.facestyle+ '/' +(options.BE_head_type || '') + 'basehead.png'
}
Renderer.CanvasModels["main"].layers.mouth.srcfn=function(options) {
    return 'img/face/' + options.facestyle + '/' +(options.BE_mouth_type|| '') + 'mouth' + options.mouth + '.png'
}
//增加layer
Renderer.CanvasModels["main"].layers.left_lashes={
    srcfn(options) {
        return 'img/face/' + options.facestyle + '/'+ (options.BE_eyes_type||"")  + 'lashes' + (options.eyes_half ? "_halfclosed" : "") + '.png'
    },
    showfn(options) {
        return options.BE_left_lashes
    },
    masksrcfn(options) {
        return 'img/face/' + options.facestyle + '/left_lashes_mask.png'
    },
    animationfn(options) {
        return options.blink_animation
    },
    z: ZIndices.BE_left_lashes , //120 
    animation: "idle" 
}
Renderer.CanvasModels["main"].layers.right_lashes={
    srcfn(options) {
        return 'img/face/' + options.facestyle + '/'+ (options.BE_eyes_type||"")  + 'lashes' + (options.eyes_half ? "_halfclosed" : "") + '.png'
    },
    showfn(options) {
        return options.BE_right_lashes
    },
    masksrcfn(options) {
        return 'img/face/' + options.facestyle + '/right_lashes_mask.png'
    },
    animationfn(options) {
        return options.blink_animation
    },
    z: ZIndices.BE_left_lashes , //120 
    animation: "idle" 
}
Renderer.CanvasModels["main"].layers.side_border={
    srcfn(options) {
        return 'img/face/' + options.facestyle+ '/' +(options.BE_side_type||"") + 'side_border.png'
    },
    showfn(options) {
        return options.show_face
    },
    filters: ["BE_border"],
    z: ZIndices.side_border , //120 
    animation: "idle" 
}
//pussy type
//----------------------------------------
Renderer.CanvasModels["main"].layers.pussy_cum={
    srcfn(options) {
        return 'img/face/' + options.facestyle+ '/' +(options.BE_pussy_type||"") + 'pussy_cum' + options.pussy_cum + '.png'
    },
    showfn(options) {
        return options.show_face && options.BE_pussy_type
    },
    filters: ["body"],
    z: ZIndices.pussy_cum , //200
    animation: "idle" 
}
Renderer.CanvasModels["main"].layers.pussy={
    srcfn(options) {
        return 'img/face/' + options.facestyle+ '/' +(options.BE_pussy_type||"") + 'pussy' + options.pussy + '.png'
    },
    showfn(options) {
        return options.show_face && options.BE_pussy_type
    },
    filters: ["body"],
    z: ZIndices.pussy , //199
    animation: "idle" 
}
Renderer.CanvasModels["main"].layers.side_border_pussy={
    srcfn(options) {
        return 'img/face/' + options.facestyle+ '/' +options.BE_pussy_type + 'side_border_pussy.png'
    },
    showfn(options) {
        return options.show_face && options.BE_pussy_type
    },
    filters: ["BE_border"],
    z: ZIndices.side_border_pussy , //201
    animation: "idle" 
}
//----------------------------------------
//--修改preprocess

DefineMacro("BJ_Canvas_add", function () {
    setup.BE.update()
	if (V.vaginastate == "penetrated"){
		T.modeloptions.pussy = 1}
	else
		{T.modeloptions.pussy = 0}
    
	//<!--Blush and Orgasm-->
	
	V._blush_flow_target = Math.min(5, Math.floor(V.arousal / 2000) + 1 + V.BE.easyerblush)
    V._blush_flow_target = ( V._blush_flow_target < 2 && V.exposed >= 2) ? 2 : V._blush_flow_target
	
	//	<!---緩慢下降-->
	if( V._blush_flow_target < V.BE.org_last_blush){
		T.modeloptions.blush = V.BE.org_last_blush -1}
	else{
		T.modeloptions.blush = V._blush_flow_target}
	T.modeloptions.pussy_cum = 0
	if( V.orgasmdown >= 1){
		T.modeloptions.blush = 5;
		T.modeloptions.pussy_cum = 1;
		if( T.modeloptions.pussy === 1) T.modeloptions.pussy_cum = 2;
    }
	T.modeloptions.BE_eyeorg = false
	if( V.orgasmdown >= 1){
		if( V.BE.Eye_condition === "OG")T.modeloptions.BE_eyeorg = true
		if( V.BE.Mouse_condition === "OG")T.modeloptions.mouth = "org"}
		
	if(T.modeloptions.blush === 5)
		if( V.BE.Eye_condition === "B5")T.modeloptions.BE_eyeorg = true;
		if( V.BE.Mouse_condition === "B5")T.modeloptions.mouth = "org";
		
    V.BE.org_last_blush = T.modeloptions.blush
	if( V.BE.half_close)T.modeloptions.eyes_half = true
	

    //<!--Layer Load-->

    setup.BE.layer_loader()
    
    }
)

setup.BE = {
    'type_init' : {
        "eyes_type" : "",
        "breasts_type" : "",
        "side_type" : "BE_side_0/",
        "pussy_type": "",
        "head_type": "",
        "mouth_type": "",
        "brows_type": "",
        "left_lashes": "",
        "right_lashes": "",
        "border_colour": ""

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
    preprocess_add(options){
        options.filters.BE_border = lookupColour(options,setup.colours.clothes_map, options.BE_border_colour ,"BE_border");
    },
    update(){
        if (V.BE === undefined)V.BE = {};
        //update
        for (let key in this.init) {
            if (V.BE[key] === undefined) V.BE[key] = this.init[key];
        }
        for (let key in this.type_init) {
            if (V.BE[key] === undefined) V.BE[key] = this.type_init[key];
        }
    },
    layer_loader(){
        for(let key in this.type_init){
            T.modeloptions['BE_'+ key] = V.BE[key]
        }
    },
    simple_type_choice(type_name,num,buttum_name_list =false){
        let _text = ''
        _text += '<<listbox "$BE.' + type_name + '_type" autoselect>>'
	    _text += '  <<option "Default" "">>'
        if (buttum_name_list){
            for(let i = 0;i < num;i ++){
                _text += '  <<option "' + buttum_name_list[i] +'" "BE_' + type_name + '_' + i + '/">>'
            }
        }else{
            for(let i = 0;i < num;i ++){
                _text += '  <<option "BE_' + type_name+'_' + i + '" "BE_' + type_name + '_' + i + '/">>'
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


