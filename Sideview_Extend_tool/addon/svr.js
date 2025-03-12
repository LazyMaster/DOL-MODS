setup.SE = {
    'key_dict' : {
        'enable':true,
        'updated':false,
    },
    update(){
        //update
        if (!this.key_dict.updated){
            if (V.SE === undefined)V.SE = {};
            for (let key in this.buttums) {
                if (V.SE[key] === undefined) V.SE[key] = false;
            }
            for (let name in this.layers) {
                this.layer_replacer(name)
            }
            
            this.key_dict.updated = true
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
        'orgtear':{
            'name':'高潮時流淚',
            'type':'checkbox'
        },
        
        
    },
    'canvas':{
        'always':{
            condition(){
                return true
            },
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
                return true
            },
            effect(){
                if( V.SE.eye_half_close)T.modeloptions.eyes_half = true
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
        this.layers[name].vanila_src = Renderer.CanvasModels.main.layers[name].srcfn;
        const self = this;
        Renderer.CanvasModels.main.layers[name].srcfn = function(options) {
            return self.layers[name].condition() 
                ? self.layers[name].srcfn(options)
                : self.layers[name].vanila_src(options);
        };    
    },
    text_addbuttum(){
        let _text = ''
        for (let key in this.buttums){
            if (this.buttums[key].type === 'checkbox'){
                _text += `<laSEl><<checkbox "$SE.${key}" false true autocheck>> ${this.buttums[key].name}</laSEl><br>`
            }
            else if (this.buttums[key].type === 'listbox'){
                _text +=`
                ${this.buttums[key].name}
                <<listbox "$SE.${key}" autoselect>>`
                for (let opt in this.buttums[key].list){
                    _text +=`<<option "${opt}" "${this.buttums[key].list[opt]}">>`
                }
                _text +=`<</listbox>><br><br>`
            }
        }
        return _text
    }
}
DefineMacro("SE_Canvas_add", function () {
    setup.SE.update()
        for (let key in setup.SE.canvas){
            if (setup.SE.canvas[key].condition()) setup.SE.canvas[key].effect()
        }
        }
    )

