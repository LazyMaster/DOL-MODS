let e_buttuns={
    'head_type':{
        'name':'頭選擇',
        'type':'listbox',
        'list':{
            'default' : '',
            'type1' : 'BE_head_0/',
            'type2' : 'BE_head_1/'
        },
    },
    'mouth_type':{
        'name':'嘴選擇',
        'type':'listbox',
        'list':{
            'default' : '',
            'type1' : 'BE_mouth_1/',
            'type2' : 'BE_mouth_2/',
            'type3' : 'BE_mouth_3/'
        },
    },
    'eyes_type':{
        'name':'眼睛選擇',
        'type':'listbox',
        'list':{
            'default' : '',
            'type1' : 'BE_eyes_0/',
            'type2' : 'BE_eyes_1/',
        },
    },
    'brows_type':{
        'name':'眉選擇',
        'type':'listbox',
        'list':{
            'default' : '',
            'type1' : 'BE_brows_0/',
            'type2' : 'BE_brows_1/',
        },
    },
    'side_type':{
        'name':'框選擇',
        'type':'listbox',
        'list':{
            'default' : '',
            'type1' : 'BE_side_0/',
            'type2' : 'BE_side_1/',
        },
    },
    'breasts_type':{
        'name':'胸部選擇',
        'type':'listbox',
        'list':{
            'default' : '',
            'Wax' : 'BE_breasts_0/',
            'Wax_with_cloth' : 'BE_breasts_1/',
            'Costom(在BE_breasts_2添加自己的胸部 沒有會報錯)' : 'BE_breasts_2/'
        },
    },
    'pussy_type':{
        'name':'穴選擇',
        'type':'listbox',
        'list':{
            'default' : '',
            'type1' : 'BE_pussy_0/',
            'type2' : 'BE_pussy_1/',
            'type3' : 'BE_pussy_2/'
        },
    },
    'eyes_condition':{
        'name':'眼高潮條件',
        'type':'listbox',
        'list':{
            "NO":"",
	        "Blush5":"B5",
	        "Orgasm":"OG",
        },
    },
    'mouth_condition':{
        'name':'嘴高潮條件',
        'type':'listbox',
        'list':{
            "NO":"",
	        "Blush5":"B5",
	        "Orgasm":"OG",
        },
    },
    'left_lashes':{
        'name':'左睫毛覆蓋頭髮',
        'type':'checkbox'},
    
    'right_lashes':{
        'name':'右睫毛覆蓋頭髮',
        'type':'checkbox'},
}

let e_layers={
    "sclera": {
        srcfn(options) {
            return 'img/face/' + options.facestyle + '/' + (V.SE.eyes_type||"") + (options.eyes_bloodshot ? "sclerabloodshot" : "sclera") + '.png'
        }
    },
    "left_iris": {
        srcfn(options) {
            return 'img/face/' + options.facestyle + '/'+ (V.SE.eyes_type||"")  + (options.trauma ? "irisempty" : "iris") + (V.SE.eyeorg ? "_org" : "") + '_left.png'
        },
        masksrcfn(options) {
            return 'img/face/' + options.facestyle + '/full_mask.png'
        },
    },
    "right_iris": {
        srcfn(options) {
            return 'img/face/' + options.facestyle + '/'+ (V.SE.eyes_type||"")  + (options.trauma ? "irisempty" : "iris") + (V.SE.eyeorg ? "_org" : "") + '_right.png'
        },
        masksrcfn(options) {
            return 'img/face/' + options.facestyle + '/full_mask.png'
        },
    },
    "eyelids": {
        srcfn(options) {
            return 'img/face/' + options.facestyle + '/'+ (V.SE.eyes_type||"")  + 'eyelids' + (options.eyes_half ? "_halfclosed" : "") + '.png'
        }
    },
    "lashes": {
        srcfn(options) {
            return 'img/face/' + options.facestyle + '/'+ (V.SE.eyes_type||"")  + 'lashes' + (options.eyes_half ? "_halfclosed" : "") + '.png'
        }
    },
    "brows": {
        srcfn(options) {
            return 'img/face/' + options.facestyle + '/'+ (V.SE.brows_type||"")  + 'brow' + options.brows + '.png'
        }
    },
    "base": {
        srcfn(options) {
            return options.mannequin ? "img/body/mannequin/basenoarms.png" : `img/body/basenoarms-f.png`;
        }
    },
    "leftarm": {
        srcfn(options) {
            return options.mannequin ? "img/body/mannequin/basenoarms.png" : `img/body/basenoarms-f.png`;
        }
    },
    "breasts": {
        srcfn(options) {
            if (options.mannequin) {
                return "img/body/mannequin/breasts/" +
                    (options.breast_size - 1) +
                    (options.breasts === "cleavage" && options.breast_size >= 4 ? "_clothed" : "") + ".png"
            } else {
                if (options.breast_size <= 0) return "";
                let fn = "breasts" + options.breast_size + (options.breasts === "cleavage" && options.breast_size >= 3 ? "_clothed" : "") + ".png";
                return "img/body/breasts/" + (V.SE.breasts_type||"")  + fn;
            }
        }
    },
    "basehead": {
        srcfn(options) {
            if (options.mannequin) return "img/body/mannequin/basehead.png"
            if (!V.SE.head_type) return "img/body/basehead.png"
            return 'img/face/' + options.facestyle+ '/' +(V.SE.head_type || '') + 'basehead.png'        
        }
    },
    "mouth": {
        srcfn(options) {
            return 'img/face/' + options.facestyle + '/' +(V.SE.mouth_type|| '') + 'mouth' + options.mouth + '.png'    
        }
    },
    //增加layer
    "left_lashes": {
        srcfn(options) {
        return 'img/face/' + options.facestyle + '/'+ (V.SE.eyes_type||"")  + 'lashes' + (options.eyes_half ? "_halfclosed" : "") + '.png'
        },
        showfn(options) {
            return V.SE.left_lashes
        },
        masksrcfn(options) {
            return 'img/face/' + options.facestyle + '/left_lashes_mask.png'
        },
        animationfn(options) {
            return options.blink_animation
        },
        z: 120 ,
        animation: "idle" 
    },
    "right_lashes": {
        srcfn(options) {
            return 'img/face/' + options.facestyle + '/'+ (V.SE.eyes_type||"")  + 'lashes' + (options.eyes_half ? "_halfclosed" : "") + '.png'
        },
        showfn(options) {
            return V.SE.right_lashes
        },
        masksrcfn(options) {
            return 'img/face/' + options.facestyle + '/right_lashes_mask.png'
        },
        animationfn(options) {
            return options.blink_animation
        },
        z: 120 ,
        animation: "idle" 
    },
    "side_border": {
        srcfn(options) {
            return 'img/face/' + options.facestyle+ '/' +(V.SE.side_type||"") + 'side_border.png'
        },
        showfn(options) {
            return options.show_face
        },
        filters: ["BE_border"],
        z: 120 ,
        animation: "idle" 
    },
    //pussy type
    //----------------------------------------
    "pussy_cum": {
        srcfn(options) {
            return 'img/face/' + options.facestyle+ '/' +(V.SE.pussy_type||"") + 'pussy_cum' + options.pussy_cum + '.png'
        },
        showfn(options) {
            return options.show_face && V.SE.pussy_type
        },
        filters: ["body"],
        z: 200,
        animation: "idle" 
    },
    "pussy": {
        srcfn(options) {
            return 'img/face/' + options.facestyle+ '/' +(V.SE.pussy_type||"") + 'pussy' + options.pussy + '.png'
        },
        showfn(options) {
            return options.show_face && V.SE.pussy_type
        },
        filters: ["body"],
        z:199,
    },
    "side_border_pussy": {
        srcfn(options) {
            return 'img/face/' + options.facestyle+ '/' +V.SE.pussy_type + 'side_border_pussy.png'
        },
        showfn(options) {
            return options.show_face && V.SE.pussy_type
        },
        filters: ["BE_border"],
        z: ZIndices.side_border_pussy , //201
        animation: "idle" 
    }
}
//----------------------------------------
//--修改preprocess
let e_canvas={
    'BE':{
        effect(){
            if (V.vaginastate == "penetrated"){
                T.modeloptions.pussy = 1}
            else
                {T.modeloptions.pussy = 0}
            
            //<!--Blush and Orgasm-->
            T.modeloptions.pussy_cum = 0
            if( V.orgasmdown >= 1){
                T.modeloptions.blush = 5;
                T.modeloptions.pussy_cum = 1;
                if( T.modeloptions.pussy === 1) T.modeloptions.pussy_cum = 2;
            }
            V.SE.eyeorg = false
            if( V.orgasmdown >= 1){
                if( V.SE.eyes_condition === "OG")V.SE.eyeorg = true
                if( V.SE.mouth_condition === "OG")T.modeloptions.mouth = "org"}
                
            if(T.modeloptions.blush === 5)
                if( V.SE.eyes_condition === "B5")V.SE.eyeorg = true;
                if( V.SE.mouth_condition === "B5")T.modeloptions.mouth = "org";
                
            V.SE.org_last_blush = T.modeloptions.blush
            if( V.SE.half_close)T.modeloptions.eyes_half = true
            

            //<!--Layer Load-->
        },
    },
}
setup.SE.assign_layers(e_layers)
setup.SE.assign_buttums(e_buttuns)
setup.SE.assign_canvas(e_canvas)
setup.SE.layers_update()
