 
let e_buttuns={
    'org_iris':{
        'name':'高潮眼',
        'type':'checkbox'},
    'head_type':{
        'name':'頭型',
        'type':'listbox',
        'list':{
            'default' : 'default',
            'type1' : '1',
            'type2' : '2'
        }
    }
    }

let e_layers={
    "left_iris": {
        condition(){
            return V.SE.org_iris_show
        },
        srcfn(options) {
            return `img/svr/iris_org/iris_org.png`;
        },
    },
    "right_iris": {
        condition(){
            return V.SE.org_iris_show
        },
        srcfn(options) {
            return `img/svr/iris_org/iris_org.png`;
        },
    },
    "basehead": {
        condition(){
            return (V.SE.head_type) && (V.SE.head_type !== 'default')
        },
        srcfn(options) {
            return options.mannequin ? `img/body/mannequin/basehead.png` : `img/svr/head/basehead_${V.SE.head_type}.png`
        },
    },
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