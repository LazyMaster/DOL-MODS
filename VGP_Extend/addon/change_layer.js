 
let e_buttuns={
    'org_iris':{
        'name':'高潮眼',
        'type':'checkbox'},
    'head_type':{
        'name':'頭型',
        'type':'listbox',
        'list':{
            'default' : '',
            'type1' : '1',
            'type2' : '2'
        },
    },
    'breasts_type':{
        'name':'胸型',
        'type':'listbox',
        'list':{
            'default' : '',
            'wax' : '1',
            'wax_clothed' : '2'
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
    }
}
const side_hair_condition_dict={
    "default":{"head_type":"1"}
    }
let e_layers={
    "left_iris": {
        condition(options){
            return V.SE.org_iris_show
        },
        srcfn(options) {
            return `img/svr/iris_org/iris_org.png`;
        },
    },
    "right_iris": {
        condition(options){
            return V.SE.org_iris_show
        },
        srcfn(options) {
            return `img/svr/iris_org/iris_org.png`;
        },
    },
    "basehead": {
        condition(options){
            return (V.SE.head_type)
        },
        srcfn(options) {
            return options.mannequin ? `img/body/mannequin/basehead.png` : `img/svr/head/basehead_${V.SE.head_type}.png`
        },
    },
    "brows": {
        condition(options){
            return (V.SE.brow_type)
        },
        srcfn(options) {
            return `img/svr/brow_${V.SE.brow_type}/brow-${options.brows}.png`;
        },
    },
    "mouth": {
        condition(options){
            return V.SE[`mouth_${options.mouth}_type`] 
        },
        srcfn(options) {
            return `img/svr/mouth-${options.mouth}/${V.SE[`mouth_${options.mouth}_type`]}.png`;
        },

    },
    "breasts": {
        condition(options){
            return V.SE.breasts_type && !options.mannequin
        },
		srcfn(options) {
			const suffix = options.breasts === "cleavage" && options.breast_size >= 3 ? "_clothed.png" : ".png";
			return `img/svr/breasts/SE_breasts_${V.SE.breasts_type}/breasts${options.breast_size}${suffix}`;
		},
    },
    "hair_sides": {
        condition(options){
            const cond = side_hair_condition_dict[options.hair_sides_type];
            if (cond){
                for(let key in cond){
                    if (V.SE[key] === cond[key]){
                        options.SE_hairsidetype_1 =key
                        options.SE_hairsidetype_2 =V.SE[key]
                        return true
                    }
                }
            }
            return false
        },
		srcfn(options) {
			return `img/hair/sides/${options.hair_sides_type}/${options.SE_hairsidetype_1}_${options.SE_hairsidetype_2}/${options.hair_sides_length}.png`;
		},
    }
}
let e_canvas={
    'eye_org':{
        condition(){
            return V.SE.org_iris
        },
        effect(){
            V.SE.org_iris_show = V.orgasmdown >= 1
        }
    }
}

setup.SE.assign_layers(e_layers)
setup.SE.assign_buttums(e_buttuns)
setup.SE.assign_canvas(e_canvas)
setup.SE.layers_update()