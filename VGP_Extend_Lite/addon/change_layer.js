 
const allowed_hair_fringe_types = [
        "default",
        "drill ringlets",
        "framed",
        "hime",
        "loose",
        "overgrown",
        "ringlet curl",
        "ringlets",
        "straight",
        "straight curl",
        "swept left",
        "thin flaps",
        "trident",
        "wide flaps"
        ]
const allowed_hair_sides_types = [
        "default",
        "straight",
        "swept left",
        "twintails"
        ]  
const side_hair_condition_dict={
        "default":{"head_type":"1"}
        }
const allowed_hair_fringe_list = Object.fromEntries(allowed_hair_fringe_types.map(x => [x, x]));
const allowed_hair_sides_list = Object.fromEntries(allowed_hair_sides_types.map(x => [x, x]));

let e_buttuns={
    'actexp_mouth':{
        'name':'做表情-嘴',
        'type':'listbox',
        'list':{
            '不做' : '',
            'chew' : 'chew',
            'frown' : 'frown',
            'neutral' : 'neutral',
            'cry' : 'cry',
            'smile' : 'smile',
            'org' : 'org',
        }
    },
    'org_iris':{
        'name':'高潮眼',
        'type':'checkbox'},
    'act_org_iris':{
        'name':'做高潮眼',
        'type':'checkbox',
    },
    'org_mouth':{
        'name':'高潮嘴',
        'type':'checkbox'},
    'head_type':{
        'name':'頭型',
        'type':'listbox',
        'list':{
            'default' : '0',
            'type1' : '1',
            'type2' : '2'
        },
    },
    'brow_type':{
            'name':'眉毛',
            'type':'listbox',
            'list':{
                'default' : '',
                'type1' : '1',
                'type2' : '2'
            }
    },
    'mouth_neutral_type':{
            'name':'嘴型 中性',
            'type':'listbox',
            'list':{
                'default' : '',
                'type1' : '1',
            }
    },
    'mouth_smile_type':{
            'name':'嘴型 微笑',
            'type':'listbox',
            'list':{
                'default' : '',
                'type1' : '1',
            }
    },
    'mouth_org_type':{
            'name':'嘴型 高潮',
            'type':'listbox',
            'list':{
                'default' : '0',
                'type1' : '1',
                'type2' : '2',
            }
    },
    'eyestype':{
            'name':'眼型',
            'type':'listbox',
            'list':{
                'default' : '0',
                'type1' : '1',
                'type2' : '2',
            }
    },
    'iris_light':{
            'name':'眼睛反光',
            'type':'listbox',
            'list':{
                '高' : 'h',
                '低' : 'l',
            }
    },
    'side_hair':{
            'name':'側邊髮自選',
            'type':'checkbox',
    },
    'side_hair_fringe':{
            'name':'側邊前髮',
            'type':'listbox',
            'list':allowed_hair_fringe_list
    },
    'side_hair_sides':{
            'name':'側邊後髮',
            'type':'listbox',
            'list':allowed_hair_sides_list
    },
    'pussy_show':{
            'name':'小穴特寫(WIP)',
            'type':'checkbox',
    },
}


let e_layers={

    "VE_left_iris": {
			filters: ["left_eye"],
			z: ZIndices.iris,
			animation: "idle",

			srcfn(options) {
            if (V.SE.org_iris_show){
                return `img/svr/iris_org/iris_org.png`;
            }
            return `img/svr/iris/iris.png`;
        },
			showfn(options) {
				return options.show_face;
			},
			masksrcfn(options) {
				return "img/svr/face/masks/left.png"
			}
		},
	"VE_right_iris": {
			filters: ["right_eye"],
			z: ZIndices.iris,
			animation: "idle",

			srcfn(options) {
            if (V.SE.org_iris_show){
                return `img/svr/iris_org/iris_org.png`;
            }
            return `img/svr/iris/iris.png`;
        },
			showfn(options) {
				return options.show_face;
			},
			masksrcfn(options) {
				return "img/svr/face/masks/right.png"
			}
		},
	"iris_highlight": {
		z: 32.5,
		animation: "idle",

		srcfn(options) {
                const place = V.SE.iris_light || 'h'
				return `img/svr/iris/iris_highlight_${place}.png`;
		},
		showfn(options) {
				return options.show_face && !options.trauma;
		}
	},
    "VE_basehead": {
        show: true,
        srcfn(options) {
            return `img/svr/head/basehead_${V.SE.head_type || "0"}.png`
        },
        filters: ["body"],
        z: ZIndices.basehead,
        animation: "idle" 
    },
    "VE_brows": {
        filters: ["brows"],
		z: ZIndices.brow,

		srcfn(options) {
            return `img/svr/brow_${V.SE.brow_type||"0"}/brow-${options.brows}.png`;
        },
		zfn(options) {
			return options.brows_position === "back" ? ZIndices.back_brow : ZIndices.brow;
		},
		showfn(options) {
			return options.show_face && options.brows !== "none";
		},
    },
    "VE_mouth": {
		filters: ["tan"],
		z: ZIndices.mouth,

		showfn(options) {
			return options.show_face && options.mouth !== "none";
		},

        srcfn(options) {
            let _omouth_type = V.SE.org_mouth_show ? 'org':options.mouth;
            return `img/svr/mouth-${_omouth_type}/${V.SE[`mouth_${_omouth_type}_type`]||"0"}.png`;
        },

    },
    "VE_eyelids": {
		show: true,
		filters: ["tan"],
		z: ZIndices.eyelids,

		srcfn(options) {
			const half = options.eyes_half ? "-half-closed" : "";
			return `img/svr/eyestype_${V.SE.eyestype||"0"}/eyelids${half}.png`;
		},
		animationfn(options) {
			return options.blink_animation;
		},
	},
    "VE_lashes": {
			filters: ["tan"],
			z: ZIndices.lashes,

			srcfn(options) {
				const half = options.eyes_half ? "-half-closed" : "";
				return `img/svr/eyestype_${V.SE.eyestype||"0"}/lashes${half}.png`;
			},
			showfn(options) {
				return options.show_face;
			},
			animationfn(options) {
				return options.blink_animation;
			},
		},
    "VE_sclera": {
			z: ZIndices.sclera,

			srcfn(options) {
				return `img/svr/eyestype_${V.SE.eyestype||"0"}/${options.eyes_bloodshot ? "sclera-bloodshot" : "sclera"}.png`;
			},
			showfn(options) {
				return options.show_face;
			}
		},
	"VE_blush": {
			filters: ["tan"],
			z: ZIndices.blush,

			srcfn(options) {
				return `img/svr/face/blush-${options.blush}.png`;
			},
			showfn(options) {
				return options.show_face && options.blush > 0;
			},
		},
    "VE_freckles": {
			filters: ["tan"],
			z: ZIndices.freckles,

			srcfn(options) {
				return `img/svr/face/freckles.png`;
			},
			showfn(options) {
				return options.show_face && !!options.freckles;
			},
		},
    "VE_tears": {
			z: ZIndices.tears,
			animation: "idle",

			srcfn(options) {
				return `img/svr/face/tears-${options.tears}.png`;
			},
			showfn(options) {
				return options.show_face && options.tears > 0;
			},
		},
    "VE_hair_sides": {
		filters: ["hair"],
		animation: "idle",

		srcfn(options) {
            let hair_sides_type =  V.SE.side_hair ? V.SE.side_hair_sides || options.hair_sides_type:options.hair_sides_type;
            const cond = side_hair_condition_dict[hair_sides_type];
            if (cond){
            for(let key in cond){
                if (V.SE[key] === cond[key]){
                    return `img/svr/hair/sides/${hair_sides_type}/${key}_${V.SE[key]}/${options.hair_sides_length}.png`;
                    }
                }   
            }
			return `img/svr/hair/sides/${hair_sides_type}/${options.hair_sides_length}.png`;
			},
		zfn(options) {
			return options.hair_sides_position === "front" ? ZIndices.hair_forward : ZIndices.backhair;
		},
		showfn(options) {
			let hair_sides_type =  V.SE.side_hair ? V.SE.side_hair_sides || options.hair_sides_type:options.hair_sides_type;
			return !!options.show_hair && !!hair_sides_type && allowed_hair_sides_types.includes(hair_sides_type);
		},
	},
	"VE_hair_fringe": {
		filters: ["hair_fringe"],
		z: ZIndices.front_hair,
		animation: "idle",

		srcfn(options) {
            let hair_fringe_type =  V.SE.side_hair ? V.SE.side_hair_fringe || options.hair_fringe_type:options.hair_fringe_type;
			return `img/svr/hair/fringe/${hair_fringe_type}/${options.hair_fringe_length}.png`;
		},
		showfn(options) {
            let hair_fringe_type =  V.SE.side_hair ? V.SE.side_hair_fringe || options.hair_fringe_type:options.hair_fringe_type;
			return !!options.show_hair && !!hair_fringe_type && allowed_hair_fringe_types.includes(hair_fringe_type);
		},
	},

    "pussy_cum":{
        srcfn(options) {
            return `img/svr/pussy/pussy_cum.png`
        },
        showfn(options) {
            return options.show_face && V.SE.pussy_show && V.SE.drip_vaginal >= 1
        },
        filters: ["body"],
        z: 199.5,
        animation: "idle" 
    },
    "pussy_org":{
        srcfn(options) {
            return `img/svr/pussy/pussy_org.png`
        },
        showfn(options) {
            return options.show_face && V.SE.pussy_show && V.orgasmdown >= 1
        },
        filters: ["body"],
        z: 200,
        animation: "idle" 
    },
    "pussy":{
        srcfn(options) {
            return `img/svr/pussy/pussy.png`
        },
        showfn(options) {
            return options.show_face && V.SE.pussy_show
        },
        filters: ["body"],
        z: 199,
        animation: "idle" 
    }
}
let e_canvas={
    'org_mouth':{
        condition(){
            return V.SE.org_mouth
        },
        effect(){
            V.SE.org_mouth_show = V.SE.actexp_mouth=='org' || V.orgasmdown >= 1
        } 
    },
    'eye_org':{
        condition(){
            return V.SE.org_iris
        },
        effect(){
            V.SE.org_iris_show = V.SE.act_org_iris || V.orgasmdown >= 1 
        },
    },
    'pussy_show':{
        condition(){
            return V.SE.pussy_show
        },
        effect(){
            V.SE.drip_vaginal = Math.clamp(setup.bodyliquid.combined("vagina"), 0, 5);
        },
    },
    'actexp_mouth':{
        condition(){
            return V.SE.actexp_mouth
        },
        effect(){
            T.modeloptions.mouth = V.SE.actexp_mouth=='org' ? 'cry' : V.SE.actexp_mouth
        }
    }
}


setup.SE.assign_layers(e_layers)
setup.SE.assign_buttums(e_buttuns)
setup.SE.assign_canvas(e_canvas)
setup.SE.layers_update()