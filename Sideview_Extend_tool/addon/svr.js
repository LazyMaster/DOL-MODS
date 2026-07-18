setup.SE = {
    'key_dict' : {
        'enable':true,
        'updated':false,
    },
    layers_update(){
        for (let name in this.layers) {
            this.layer_replacer(name)
        }
    },
    update(){
        //update
        if (!this.key_dict.updated){
            if (V.SE === undefined)V.SE = {};
            for (let key in this.buttums) {
                if (V.SE[key] === undefined) V.SE[key] = false;
            }
            this.key_dict.updated = true;
        }
        this.layers_update()
    },
    'layers':{
    },
    'buttums':{
        'easyerblush':{
            'name':'更容易臉紅',
            'type':'checkbox'
        },
        'eye_half_close':{
            'name':'眼睛總是半開',
            'type':'checkbox'
        },
        'force_trauma':{
            'name':'強制創傷表情',
            'type':'checkbox'
        },
        'orgtear':{
            'name':'高潮時流淚',
            'type':'checkbox'
        },
        'actexp_brow':{
            'name':'做表情-眉',
            'type':'listbox',
            'list':{
                '不做' : '',
                'top' : 'top',
                'mid' : 'mid',
                'low' : 'low',
                'orgasm' : 'orgasm',
            }
        },
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
            }
        },
    },
    'canvas':{
        'always':{
            effect(){
                V._blush_flow_target = Math.min(5, Math.floor(V.arousal / 2000) + 1 + V.SE.easyerblush)
                V._blush_flow_target = ( V._blush_flow_target < 2 && V.exposed >= 2) ? 2 : V._blush_flow_target
                if( V._blush_flow_target < V.SE.org_last_blush){
                    T.modeloptions.blush = V.SE.org_last_blush -1}
                else{
                    T.modeloptions.blush = V._blush_flow_target}
                T.modeloptions.pussy_cum = 0
                if( V.orgasmdown >= 1){
                    T.modeloptions.blush = 5;
                    T.modeloptions.tears = V.SE.orgtear ? Math.max(T.modeloptions.tears , 1) : T.modeloptions.tears
                }
                V.SE.org_last_blush = T.modeloptions.blush
            }
        },
        'eye':{
            condition(){
                return V.SE.eye_half_close
            },
            effect(){
                T.modeloptions.eyes_half = true
            }
        },
        'truama':{
            condition(){
                return V.SE.force_trauma
            },
            effect(){
                T.modeloptions.trauma = true
            }
        },
        'actexp_brow':{
            condition(){
                return V.SE.actexp_brow
            },
            effect(){
                T.modeloptions.brows = V.SE.actexp_brow;
            }
        },
        'actexp_mouth':{
            condition(){
                return V.SE.actexp_mouth
            },
            effect(){
                T.modeloptions.mouth = V.SE.actexp_mouth;
            }
        }

    },
    assign_layers(n_layers){
        Object.assign(this.layers, n_layers)
    },
    assign_buttums(n_buttums){
        Object.assign(this.buttums, n_buttums)
    },
    assign_canvas(n_canvas){
        Object.assign(this.canvas, n_canvas)
    },
    layer_replacer(name){
        let mainLayer = Renderer.CanvasModels.main.layers[name];
        const layer = this.layers[name];
        const self = this;

        if (layer.replaced) return;
        if (mainLayer === undefined){ 
            Renderer.CanvasModels.main.layers[name] = layer;
            layer.replaced = true
            return true
        }
        for (const key of ["srcfn", "showfn","masksrcfn"]) {
            if (layer[key]) {
                if (mainLayer[key]){
                    layer[`vanila_${key}`] = layer[`vanila_${key}`] || mainLayer[key];
                    mainLayer[key] = function(options) {
                        return V.SE !== undefined && (layer.condition === undefined || layer.condition(options))
                            ? layer[key](options)
                            : self.layers[name][`vanila_${key}`](options);
                    }
                }
                else{
                    mainLayer[key] = layer[key];
                }
            }
        }
        for (const key of ["filters", "z"]) {
            if (layer[key] !== undefined) mainLayer[key] = layer[key]
        }
        layer.replaced = true
    },
    text_addbuttum() {
        let _text = '';
        for (let key in this.buttums) {
            if (this.buttums[key].type === 'checkbox') {
                _text += `<label>
                            <<checkbox "$SE.${key}" false true autocheck>> 
                            ${this.buttums[key].name}
                        </label><br>`;

            }
            else if (this.buttums[key].type === 'listbox') {
                _text += `
                    ${this.buttums[key].name}
                    <<listbox "$SE.${key}" autoselect>>
                `;
                for (let opt in this.buttums[key].list) {
                    _text += `<<option "${opt}" "${this.buttums[key].list[opt]}">>`;
                }
                _text += `<</listbox>><br>`;

            }
        }
        _text += `
            <<link "應用">><<updatesidebarimg true>><</link>><br>
            <<link "重設">><<=setup.SE.reset_setting()>><</link>>
        `
        return _text;
        
    },
    reset_setting() {
        if (!V.SE) V.SE = {};

        for (let key in this.buttums) {
            const b = this.buttums[key];

            if (b.type === "checkbox") V.SE[key] = false;
            else if (b.type === "listbox") V.SE[key] = b.defaule || "";
            else V.SE[key] = null;
        }
    }
}
DefineMacro("SE_Canvas_add", function () {
    setup.SE.update()

        for (let key in setup.SE.canvas){
            if (setup.SE.canvas[key].condition === undefined || setup.SE.canvas[key].condition()) setup.SE.canvas[key].effect()
        }
    }
)

setup.SE.layers_update()
