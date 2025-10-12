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
        if (!this.key_dict.updated || V.SE.reupdate){
            if (V.SE === undefined)V.SE = {};
            for (let key in this.buttums) {
                if (V.SE[key] === undefined) V.SE[key] = false;
            }
            this.key_dict.updated = true;
            V.SE.reupdate = false;
        }

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
        if (this.layers[name].replaced){
            return false;
        }
        const mainLayer = Renderer.CanvasModels.main.layers[name];
        const layer = this.layers[name];
        const self = this;
        for (const key of ["srcfn", "showfn"]) {
            layer[`vanila_${key}`] = mainLayer[key];
            if (layer[key]){
                Renderer.CanvasModels.main.layers[name][key] = layer.condition === undefined ?
                layer[key]:
                function(options) {
                    return layer.condition === undefined || layer.condition(options) 
                        ? layer[key](options)
                        : self.layers[name][`vanila_${key}`](options);
                }
            };    
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
            else if (this.buttums[key].type === 'colour') {
                _text += `
                    ${this.buttums[key].name}
                    <<listbox "$SE.${key}" autoselect>>
                `;
                for(let buttum of ["gray","black", "blue", "brown", "green", "pink", "purple", "red", "tangerine", "teal", "white", "yellow"]){
                    _text += `<<option "${buttum}" "${buttum}">>`
                }
                _text += '<</listbox>><br>'
                if (V.SE[key] ===undefined) V.SE[key] = "gray"
            }
        }
        return _text;
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