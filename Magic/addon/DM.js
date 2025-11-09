

// NEXT : 
// 更多主動獲得點數機制
//     奪取童貞 淨化腐化
//     扶他化
//試煉 達成試煉獲得點數


setup.DM = {
    'classes_list':['base','meat','mind control','alchemy','b_magic'],
    'classes':{
        'base':{
            'subclass_list':['perk','spell','battle']
        },
        'meat':{
            'subclass_list':['perk','spell','body','liquid','battle','virginity','transform']
        },
        'mind control':{
            'subclass_list':['perk','spell','battle']
        },
        'alchemy':{
            'subclass_list':['perk','spell',]
        },
        'b_magic':{
            'subclass_list':['perk','spell',]
        }
    },
    'classes_cn':{
        'base':'塑能',
        'meat':'血肉',
        'mind control':'惑控',
        'alchemy':'鍊金',
        'b_magic':'黑魔法',

        'perk':'專精',
        'spell':'技能',
        'battle':'戰鬥',
        'virginity':'貞潔',
        'transform':'轉化',
        'body':'外觀',
        'liquid':'體液'

    },
    'stat_transform':{
        'base':{
            'orgasmstat':{
                'name':'高潮經驗',
                'cost':1
            }
        },
        'meat':{
            'milk_produced_stat':{
                'name':'產乳經驗',
                'cost':500
            },
            'semen_produced_stat':{
                'name':'產精經驗',
                'cost':250
            },
            'pregnancyStats.playerChildren':{
                'name':'生育經驗',
                'cost':0.02
            },
            'pregnancyStats.playerChildren':{
                'name':'生育經驗',
                'cost':0.02
            },
            'sexStats.vagina.pregnancy.parasiteBirthEvents':{
                'name':'陰道寄生蟲生育經驗',
                'cost':0.1
            },
            'sexStats.anus.pregnancy.parasiteBirthEvents':{
                'name':'肛門寄生蟲生育經驗',
                'cost':0.1
            }
            
        },
        'mind control':{
            'dancestat':{
                'name':'跳舞經驗',
                'cost':1
            },
            'prostitutionstat':{
                'name':'賣淫經驗',
                'cost':0.1
            },
            'masseur_stat':{
                'name':'按摩經驗',
                'cost':0.2
            }
        },
        'alchemy':{
        },
        'b_magic':{
            'DM.shackles_arousal_reward':{
                'name':'慾望枷鎖',
                'cost':0.1
            }
        }

    },
    'init': {
        'Is_game_started':false,
        'Mana':0,
        'Mana_max':0,
        'Mana_pool':0,
        'perk_switch':{},
        'spell_used':{},
        'daily':{},
        'menutype':'overlay',
        'slave_w':0,
        'slave_b':0,
        'desctibe_perk':false,
        'desctibe_m':false,
        'f_pairs':[],
        'class_pt':{},
        'stat_transform_history':{},
        'Foldout':{},
        'shackles_willpower':0,
        'shackles_arousal_reward_start':false,
        'shackles_arousal_reward_end':false,
        'shackles_arousal_reward':0,
        'shackles_arousal':0,
        'milk_gain':0,
        'effect_message':'',
        'weekly_money':0
    },
    DM_update_spell_list:[]
    ,
    DM_update(){
        if (!this.init.Is_game_started){
            this.init.Is_game_started = true
            if (V.DM === undefined){V.DM = {}}
            for (let key in this.init) {
                if (V.DM[key] === undefined){
                    V.DM[key] = this.init[key]
                }
            }
            for (let key in this.Perks) {
                if (V.DM[key] === undefined){
                    V.DM[key] = 0
                }
            }
            this.DM_update_spell_list = Object.keys(this.Perks).filter(key => this.Perks[key].update && typeof this.Perks[key].update === "function");
            if (V.backgroundTraits.includes("greenthumb")){V.DM["Greenthumb"] = 1}
            if (V.backgroundTraits.includes("lustful")){V.DM["Lustful"] = 1}
            if (V.DM.fatahenshin){
                V.DM.futa_to_me = 1;
                delete V.DM.fatahenshin;
            }
        }
        //update
        V.milk_max = (V.cow >= 6 ? 6000 : 3000 )+ 300 * V.DM.milk_gain
        V.milk_amount = V.DM.perk_switch.milk_infinite ? (Math.max(V.milk_amount,Math.round(V.milk_volume/3)) || Math.round(V.milk_volume/3)) :(V.milk_amount || 0);
        V.semen_max = (V.cow >= 6 ? 6000 : 3000 )+ 300 * V.DM.semen_gain || 500
        V.semen_amount = V.DM.perk_switch.semen_infinite ? (Math.max(V.semen_amount,Math.round(V.semen_volume*0.8)) || Math.round(V.semen_volume*0.8)) :(V.semen_amount || 0);
        V.milk_volume = V.milk_volume || 30;
        V.orgasmcount = V.DM.perk_switch.org_infinite ? (Math.min(V.orgasmcount , 3) || 0) : (V.orgasmcount||0)
        if (V.DM.perk_switch.milk_nofull && V.milk_amount >= V.milk_volume/2)  V.milk_amount = Math.round(V.milk_volume/2);
        V.DM.Mana_max = 100 * (1 + V.DM.Mana_pool);
        if (V.DM.Mana > V.DM.Mana_max) V.DM.Mana = V.DM.Mana_max;
        if (V.player.penisExist) {
            V.semen_volume = V.semen_volume || V.semen_max;
            V.semen_amount = V.semen_amount || V.semen_volume;
        } else {
            V.semen_volume = 0;
            V.semen_amount = 0;
        }
        for (let key of this.DM_update_spell_list){
            if (V.DM.perk_switch[key]) this.Perks[key].update();
        }
        if (V.DM.perk_switch.shackles_arousal && V.DM.shackles_arousal === 10){
            V.DM.shackles_arousal_reward_end = false
        }else{
            V.DM.shackles_arousal_reward_start = false
        }
        V.DM.world_support_now = V.DM.world_support_now || 0
        let w_d = V.DM.perk_switch.world_support ? V.DM.world_support - V.DM.world_support_now : -1 * V.DM.world_support_now
        if (w_d) {
            wikifier(`<<world_corruption "hard" ${-1 * w_d}>>`)
            V.DM.world_support_now += w_d
        }
        
        
    },
    getValueByPath(obj, path) {
        let keys = path.split('.');
        return keys.reduce((acc, key) => acc && acc[key], obj);
    },
    Linkbuttun(b_name , eff ,timepass = false){
        let _text = ""
        if (timepass){_text += '<<link [[' + b_name + '|$passage]]>>' + eff}
        else{_text += '<<link \"' + b_name + '\">>' + eff}
        _text += '<<replace #customOverlayContent>><<DM_overlay>><</replace>>'
        _text += '<</link>>'
        return _text
    },
    "Perks":{
        //Master  ---------------------
        "master_base":{
            'class':'base',
            'max':100,
            'cost_type':'Class_PT',
            'name': '塑能專精',
            'descript':'每個等級最大法力值+100，法力恢復+10。',
            'cost': 100,
            'noswich':1,
            'Effect':"<<set $DM.Mana_pool += 1>>",
        },
        "master_meat":{
            'class':'meat',
            'max':100,
            'cost_type':'Class_PT',
            'name': '血肉專精',
            'descript':'每個等級最大法力值+100，法力恢復+10。',
            'noswich':1,
            'cost': 100,
            'Effect':"<<set $DM.Mana_pool += 1>>",
        },
        "master_mind control":{
            'class':'mind control',
            'max':100,
            'cost_type':'Class_PT',
            'name': '惑控專精',
            'descript':'每個等級最大法力值+100，法力恢復+10。',
            'noswich':1,
            'cost': 100,
            'Effect':"<<set $DM.Mana_pool += 1>>",
        },
        "master_alchemy":{
            'class':'alchemy',
            'max':100,
            'cost_type':'Class_PT',
            'name': '鍊金專精',
            'descript':'每個等級最大法力值+100，法力恢復+10。',
            'noswich':1,
            'cost': 100,
            'Effect':"<<set $DM.Mana_pool += 1>>",
        },
        "master_b":{
            'class':'b_magic',
            'max':1000,
            'cost_type':'Class_PT',
            'name': '深淵專精',
            'descript':'每個等級最大法力值+100，法力恢復+10。',
            'noswich':1,
            'cost': 100,
            'Effect':"<<set $DM.Mana_pool += 1>>",
        },
        

        //shackles---------------------
        "shackles_willpower":{
            'class':'b_magic',
            'max':9,
            'cost_type':'Class_PT',
            'name': '意志枷鎖',
            'descript':'意志下降<<print $DM.shackles_willpower>>0%，法力恢復增加0.<<print $DM.shackles_willpower>>倍。',
            'cost': 0,
            'reducible' : true,
            'shackles':true
        },
        "shackles_arousal":{
            'class':'b_magic',
            'max':10,
            'cost_type':'Class_PT',
            'name': '慾望枷鎖',
            descript(){
                return `慾望下限會上升${(V.DM.shackles_arousal === 10 ?'9999' : V.DM.shackles_arousal+'000')}，法力恢復增加${(V.DM.shackles_arousal === 10 ?'4' :'0.'+ V.DM.shackles_arousal)}倍。`
            },
            'cost': 0,
            'reducible' : true,
            'shackles':true,
            update(){V.arousal = Math.max(V.arousal , Math.min(V.DM.shackles_arousal*1000 , 9999)) || V.arousal}
        },
        "world_end":{
            'class':'b_magic',
            'max':1,
            'cost_type':'M',
            'name': '魔法廢棄',
            'Effect_only':true,
            'noswich':1,
            descript(){
                return `失去一切的魔法，甚至記憶也會遺忘。`
            },
            'cost': 0,
            'reducible' : true,
            'shackles':true,
            Effect_f(){
                let w_d = -1 * V.DM.world_support_now
                if (w_d) {
                    wikifier(`<<world_corruption "hard" ${-1 * w_d}>>`)
                    V.DM.world_support_now += w_d
                }
                delete V.DM
                setup.DM.init.Is_game_started = false
            },

        },
        "world_support":{
            'class':'alchemy',
            'max':10,
            'cost_type':'Class_PT',
            'name': '世界支柱',
            descript(){
                return `支撐世界，避免腐化。`
            },
            cost_function(n){
                return 1000*(n+1)
            },
            'effect_describe':'世界更堅實了。',
           
        },
        //點數補充方案
        "sa_mana":{
            'class':'base',
            'max':1,
            'cost_type':'Class_PT',
            'name': '法力精鍊',
            'descript':'獻祭法力，增強你對能量的控制。',
            cost_function(_){
                return -1 * Math.floor(V.DM.Mana / 100)
            },
            'Effect_only':true,
            'noswich':1,
            Effect_f(){
                V.DM.Mana = V.DM.Mana %= 100
            },
            require_f(){
                if (V.DM.Mana < 100) return '沒有足夠的法力。'
            },
            'effect_describe':'法力被轉換了。'
        },
        "sa_mana_auto":{
            'class':'base',
            'max':1,
            'cost_type':'Class_PT',
            'name': '法力自動精鍊',
            'descript':'在法力滿值的時候自動精煉。',
            cost_function(_){
                return 100
            },
            update(){
                if (V.DM.Mana_max - V.DM.Mana < V.DM.hourly_M){
                    let _c = Math.ceil((V.DM.hourly_M + V.DM.Mana - V.DM.Mana_max)/100)
                    V.DM.Mana -= _c*100
                    V.DM.class_pt.base += _c
                }
            },
            'effect_describe':'法力自動精鍊開始了。'
        },
        "temperature_forever":{
            'class':'base',
            'max':1,
            'cost_type':'Class_PT',
            'name': '自動保溫',
            'descript':'總是讓身體的溫度保持正常。',
            cost_function(_){
                return 200
            },
            update(){
                V.player.bodyTemperature = 37
            },
            'effect_describe':'自動保溫開始了。'
        },
        "auto_dry":{
            'class':'base',
            'max':1,
            'cost_type':'Class_PT',
            'name': '自動烘乾',
            'descript':'防止衣服太濕。',
            cost_function(_){
                return 200
            },
            update(){
                V.upperwet = Math.min(V.upperwet,80)
                V.lowerwet = Math.min(V.lowerwet,80)
                V.underlowerwet = Math.min(V.underlowerwet,80)
                V.underupperwet = Math.min(V.underupperwet,80)
            },
            'effect_describe':'自動烘乾開始了。'
        },	

        "ge_mana":{
            'class':'base',
            'max':1,
            'cost_type':'Class_PT',
            'name': '應急法力',
            'descript':'獲得應急的法力。',
            cost_function(_){
                return 1
            },
            'Effect_only':true,
            'noswich':1,
            Effect_f(){
                V.DM.Mana += 30
            },
            'effect_describe':'法力被補充了。'
        },
        "mind_sa":{
            'class':'b_magic',
            'max':1,
            'cost_type':'M',
            'name': '心靈榨取',
            'descript':'直接把法力補滿，但會造成巨大的心靈創傷。',
            cost_function(_){
                return 0
            },
            require_f(){
                if (V.trauma > V.traumamax*(0.2))
                return '你的心靈經不起搾取'
            },
            'Effect_only':true,
            'noswich':1,
            Effect_f(){
                V.DM.Mana = V.DM.Mana_max
                V.trauma = V.traumamax
                V.DM.mind_sa_exp = V.DM.mind_sa_exp + 1 || 0
            },
            'effect_describe':'？？？？？？？？？？'
        },
        "sa_alchemy_change":{
            'class':'alchemy',
            'max':1,
            'cost_type':'Class_PT',
            'name': '等價交易',
            'descript':'把身上一半的金錢轉換成鍊金點數。',
            cost_function(_){
                return -10 * Math.floor(V.money / 200000)
            },
            'Effect_only':true,
            'noswich':1,
            Effect_f(){
                V.DM.cost_money = -100000 * Math.floor(V.money / 200000)
                wikifier('<<money $DM.cost_money "鍊金術">>')
                wikifier('<<clamp>>')
                wikifier('<<updatesidebarmoney>>')
                delete V.DM.cost_money
            },
            require_f(){
                if (V.money < 200000) return '沒有足夠的金錢。'
            },
            'effect_describe':'黃金變成了某種轉化的力量。'
        },
        "sa_physique":{
            'class':'meat',
            'max':1,
            'cost_type':'Class_PT',
            'name': '體能獻祭',
            'descript':'獻祭體能，讓你再次變成一個弱者。',
            cost_function(_){
                return -100 * Math.floor(V.physique / 1000)
            },
            'Effect_only':true,
            'noswich':1,
            Effect_f(){
                V.physique = V.physique %= 1000
            },
            require_f(){
                if (V.physique < 1000) return '你沒有足夠的體能。'
            },
            'effect_describe':'你感到某種存在從你的身體中流失，你變軟弱了。'
        },
        "sa_ped":{
            'class':'mind control',
            'max':1,
            'cost_type':'Class_PT',
            'name': '怪癖獻祭',
            'descript':'遺忘你所有的奇怪癖好，轉變成操控精神的能力。',
            cost_function(_){
                return -10 * Math.floor((V.promiscuity + V.exhibitionism + V.deviancy)/ 20)
            },
            'Effect_only':true,
            'noswich':1,
            Effect_f(){
                V.promiscuity = 0
                V.exhibitionism = 0
                V.deviancy = 0
            },
            require_f(){
                if ((V.promiscuity + V.exhibitionism + V.deviancy)<=20) return '你沒有足夠的癖好。'
            },
            'effect_describe':'你感到某種存在從你的心靈中流失，你變軟弱了。'
        },
        "sa_willpower":{
            'class':'mind control',
            'max':1,
            'cost_type':'Class_PT',
            'name': '意志獻祭',
            'descript':'獻祭意志，讓你再次變成一個弱者。',
            cost_function(_){
                return -10 * Math.floor(V.willpower / 10)
            },
            'Effect_only':true,
            'noswich':1,
            Effect_f(){
                V.willpower = V.willpower %= 10
            },
            require_f(){
                if (V.willpower < 10) return '你沒有足夠的意志。'
            },
            'effect_describe':'你感到某種存在從你的心靈中流失，你變軟弱了。'
        },
        "abortion":{
            'class':'b_magic',
            'max':1,
            'cost_type':'Class_PT',
            'name': '肉胎轉換',
            'descript':'你的肚子裡沒有東西，一切都是錯覺。',
            'cost': -100,
            'Effect_only':true,
            'noswich':1,
            'Effect':`<<set _pregnancyClear to getPregnancyObject()>>
                <<set _pregnancyClear.type to null>>
                <<set _pregnancyClear.fetus to []>>
                <<set _pregnancyClear.waterBreaking to false>>
                <<set _pregnancyClear.waterBreakingTimer to null>>
                <<set _pregnancyClear.timer to null>>
                <<set _pregnancyClear.timerEnd to null>>
                <<set _pregnancyClear.awareOf to null>>
                <<set _pregnancyClear.awareOfMultiple to null>>
                <<set _pregnancyClear.awareOfDetails to null>>
                <<set _pregnancyClear.potentialFathers to []>>
                <<set $sexStats[($player.vaginaExist ? "vagina" : "anus")].sperm to []>>
                <<restartMenstruationCycle>>
                <<set _menstruation to $sexStats.vagina.menstruation>>
                <<set _menstruation.currentState to "normal">>
                <<set _menstruation.recoveryTime to null>>
                <<set _menstruation.recoveryTimeStart to null>>
                <<set _menstruation.recoveryStage to null>>
                <<run delete C.npc.Alex.pregnancy.pcKnowledge>>
                <<run delete C.npc.Alex.pregnancy.test>>
                <<run delete C.npc.Alex.pregnancy.ultraSound>>
                <<run delete C.npc.Alex.pregnancy.sample>>
                <<run delete C.npc.Alex.pregnancy.ultraSoundPics>>`,
            require_f(){
                if (!playerIsPregnant()) return '一切都很好，你不能使用這個能力。'
            },
            'effect_describe':'這真的道德嗎？'
        },
        
 
        //---------------------------------------------------------------------------------
        //貞潔操作
        //---------------------------------------------------------------------------------
        "virginity_vigina":{
            'class':'meat',
            'subclass':'virginity',
            'max':1,
            'cost_type':'M',
            'name': '小穴童貞修復',
            'descript':'恢復貞潔。',
            'cost': 100,
            'Effect_only':true,
            'noswich':1,
            'Effect':"<<set $player.virginity.vaginal to true>>",
            'perk_require':'virginity_control',
            require_f(){
                if (V.player.virginity.vaginal === true){
                    return '這個法術對你沒效'
                }
            }
        },
        "virginity_penis":{
            'class':'meat',
            'subclass':'virginity',
            'max':1,
            'cost_type':'M',
            'name': '陰莖童貞修復',
            'descript':'恢復貞潔。',
            'cost': 100,
            'Effect_only':true,
            'noswich':1,
            'Effect':"<<set $player.virginity.penile to true>>",
            'perk_require':'virginity_control',
            require_f(){
                if (V.player.virginity.penile === true){
                    return '這個法術對你沒效'
                }
            }
        },
        "virginity_anal":{
            'class':'meat',
            'subclass':'virginity',
            'max':1,
            'cost_type':'M',
            'name': '肛門童貞修復',
            'descript':'恢復貞潔。',
            'cost': 100,
            'Effect_only':true,
            'noswich':1,
            'Effect':"<<set $player.virginity.anal to true>>",
            'perk_require':'virginity_control',
            require_f(){
                if (V.player.virginity.anal === true){
                    return '這個法術對你沒效'
                }
            }
        },
        "virginity_oral":{
            'class':'meat',
            'subclass':'virginity',
            'max':1,
            'cost_type':'M',
            'name': '口腔童貞修復',
            'descript':'恢復貞潔。',
            'cost': 100,
            'Effect_only':true,
            'noswich':1,
            'Effect':"<<set $player.virginity.oral to true>>",
            'perk_require':'virginity_control',
            require_f(){
                if (V.player.virginity.oral === true){
                    return '這個法術對你沒效'
                }
            }
        },
        "virginity_kiss":{
            'class':'meat',
            'subclass':'virginity',
            'max':1,
            'cost_type':'M',
            'name': '初吻修復',
            'descript':'恢復初吻。',
            'cost': 500,
            'Effect_only':true,
            'noswich':1,
            'Effect':"<<set $player.virginity.kiss to true>>",
            'perk_require':'virginity_control',
            require_f(){
                if (V.player.virginity.kiss === true){
                    return '這個法術對你沒效'
                }
            },
            'effect_describe':'世界線輕微的被干涉了，你從來沒有親吻過。'
        },
        //---------------------------------------------------------------------------------
        //塑能 對能量的控制
        //---------------------------------------------------------------------------------
        

        "Transpass_perk":{
            'class':'base',
            'max':1,
            'cost_type':'Class_PT',
            'name': '透視',
            'descript':'能看到一些東西，或許在碼頭和牌局會起作用。',
            'cost': 200
        },
        "wash":{
            'class':'base',
            'max':1,
            'cost_type':'M',
            'name': '清潔',
            'descript':'用魔法清理自己身上的髒污和筆跡。',
            'cost': 10,
            'Effect_only':true,
            'noswich':1,
            'Effect':`
                <<wash>>
                <<for _active_bodypart range setup.bodyparts>>
                    <<if $skin[_active_bodypart].pen === "marker">>
                        <<bodywriting_clear _active_bodypart>>
                        <<bodywriting_clear _active_bodypart>>
                    <</if>>
                <</for>>
                `,
            Effect_f(){
                if (V.skin['undefined']) delete V.skin['undefined'];
            },
            'base':1
        },
        "repair_cloth_auto":{
            'class':'base',
            'max':1,
            'cost_type':'Class_PT',
            'name': '服裝自動修復',
            'descript':'總是自動修復服裝。',
            'cost': 100,
            update(){
                wikifier(`
                    <<set _equip to setup.clothingLayer.all>>
                    <<for _i to 0; _i lt _equip.length; _i++>>
                        <<set $worn[_equip[_i]].integrity = clothingData(_equip[_i],$worn[_equip[_i]],'integrity_max')>>
                    <</for>>
                    <<dry>>`)
            },
        },
        "repair_cloth":{
            'class':'base',
            'max':1,
            'cost_type':'M',
            'name': '服裝修復',
            'descript':'用魔法修復自己身上的服裝（順便烘乾）。',
            'cost': 10,
            'Effect_only':true,
            'noswich':1,
            'Effect':`
                <<set _equip to setup.clothingLayer.all>>
                <<for _i to 0; _i lt _equip.length; _i++>>
                    <<set $worn[_equip[_i]].integrity = clothingData(_equip[_i],$worn[_equip[_i]],'integrity_max')>>
                <</for>>
                <<dry>>`
                ,
            'base':1
        },
        "temperature_37":{
            'class':'base',
            'max':1,
            'cost_type':'M',
            'name': '恆溫',
            'descript':'讓身體的溫度回到正常。',
            'cost': 10,
            'Effect_only':true,
            'noswich':1,
            'Effect':`<<set $player.bodyTemperature to 37>>`,
            'base':1
        },
        "tiredness_remove":{
            'class':'base',
            'max':1,
            'cost_type':'M',
            'name': '消除疲勞',
            'descript':'用魔法消除疲勞。',
            'cost': 100,
            cost_function(_){ 
                return Math.floor(V.tiredness/10)
            },
            'Effect_only':true,
            'noswich':1,
            Effect_f(){
                V.tiredness = 0;
                wikifier('<<updatesidebarimg>>');
            },
        },
        "stress_remove":{
            'class':'mind control',
            'max':1,
            'cost_type':'M',
            'name': '消除壓力',
            'descript':'用魔法消除壓力。',
            'cost': 100,
            cost_function(_){ 
                return Math.floor(V.stress/50)
            },
            'Effect_only':true,
            'noswich':1,
            Effect_f(){
                V.stress = 0;
                wikifier('<<updatesidebarimg>>');
            },
        },
        "arousal_remove":{
            'class':'base',
            'max':1,
            'cost_type':'M',
            'name': '快感平息',
            'descript':'用魔法消除興奮。（興奮：<<print Math.floor($arousal)>>）',
            'cost': 100,
            cost_function(_){ 
                return Math.floor(V.arousal/100)
            },
            'Effect_only':true,
            'noswich':1,
            Effect_f(){
                V.arousal = 0;
                wikifier('<<updatesidebarimg>>');
            },
            'base':1
        },        
        "Vow_lie":{
            'max':1,
            'class':'base',
            'cost_type':'M',
            'name': '欺騙誓言',
            'descript':'欺騙神殿的貞操誓言。',
            'cost': 10,
            'Effect_only':true,
            'noswich':1,
            'Effect':"<<set $player.virginity.temple to true>><<set $NPCName[$NPCNameList.indexOf(\"Sydney\")].virginity.temple to true>>",
            'base':1
        },
        "orgasm_charge":{
            'class':'mind control',
            'max':1,
            'cost_type':'M',
            'name': '自我高潮',
            'descript':'讓自己的快感達到最高。',
            'cost': 10,
            'Effect_only':true,
            'noswich':1,
            Effect_f(){
                V.arousal = V.arousalmax;
            },
            'base':1
        },
        //--------------------------------------------------------------------------
        //心靈 精神控制
        //--------------------------------------------------------------------------
        "MC":{
            'class':'mind control',
            'max':1,
            'cost_type':'Class_PT',
            'name': '精神操控',
            'descript':'似乎在某些場景有用。',
            'cost': 50
        },
        "Noawareness":{
            'class':'mind control',
            'max':1,
            'cost_type':'Class_PT',
            'name': '本能學識',
            'descript':'不需要意識來解鎖動作。',
            'cost': 10
        },
        "Noforget":{
            'class':'mind control',
            'max':1,
            'cost_type':'Class_PT',
            'name': '超級記憶',
            'descript':'對學科的記憶不會下降。',
            'cost': 30
        },        
        "Greenthumb":{
            'class':'mind control',
            'max':1,
            'cost_type':'Class_PT',
            'name': '園藝大師',
            'descript':'精通園藝。',
            'cost': 10,
            'noswich':1,
            'Effect':"<<set $backgroundTraits.pushUnique(\"greenthumb\")>>"
        },        
        "Lustful":{
            'class':'meat',
            'max':1,
            'cost_type':'Class_PT',
            'name': '異常淫蕩',
            'descript':'讓興奮隨時間上升(得到特性)。',
            'cost': 50,
            'noswich':1,
            'Effect':"<<set $backgroundTraits.pushUnique(\"lustful\")>>"
        },
        //--------------------------------------------------------------------------
        //轉化 對轉化的控制------------------------------------------------------------------
        //--------------------------------------------------------------------------
        "Angel_NoFallen":{
            'class':'meat',
            'subclass':'transform',
            'max':1,
            'cost_type':'Class_PT',
            'name': '不再墮落',
            'descript':'讓天使不因為失貞而墮落。',
            'cost': 20
        },
        "Demon_purity":{
            'class':'meat',
            'subclass':'transform',
            'max':1,
            'cost_type':'Class_PT',
            'name': '純潔免疫',
            'descript':'讓惡魔不因為純潔受創。',
            'cost': 20
        },
        "tansform_hide":{
            'class':'meat',
            'subclass':'transform',
            'max':1,
            'cost_type':'Class_PT',
            'name': '特徵隱藏',
            'descript':'不因為隱藏轉化而受害。',
            'cost': 20
        },
        "tansform_knowlege":{
            'class':'meat',
            'subclass':'transform',
            'max':1,
            'cost_type':'Class_PT',
            'name': '血脈學識',
            'descript':'理解轉化。',
            'cost': 1000
        },
        "transform_angel":{
            'class':'meat',
            'subclass':'transform',
            'max':1,
            'cost_type':'Class_PT',
            'name': '天使化',
            'descript':'增強天使化',
            'cost': 10,
            require_f(){
                if (V.DM.perk_switch.tansform_knowlege) return false
                if (V.feats.currentSave['Angel'] === undefined) return '你不曾變成天使，無法解鎖這個能力'
            },
            'Effect_only':true,
            'noswich':1,
            'Effect':`
                <<transform 'demon' -100>>
                <<transform 'angel' 100>>
                <<DM_transform>>
                <<clamp>>
                <<updatesidebarimg>>`,
        },
        "transform_demon":{
            'class':'meat',
            'subclass':'transform',
            'max':1,
            'cost_type':'Class_PT',
            'name': '惡魔化',
            'descript':'增強惡魔化',
            'cost': 10,
            require_f(){
                if (V.DM.perk_switch.tansform_knowlege) return false
                if (V.feats.currentSave['Demon'] === undefined) return '你不曾變成惡魔，無法解鎖這個能力'
            },
            'Effect_only':true,
            'noswich':1,
            'Effect':`
                <<transform 'demon' 100>>
                <<transform 'angel' -100>>
                <<DM_transform>>
                <<clamp>>
                <<updatesidebarimg>>`,

        },
        "transform_cat":{
            'class':'meat',
            'subclass':'transform',
            'max':1,
            'cost_type':'Class_PT',
            'name': '貓化',
            'descript':'增強貓化',
            'cost': 10,
            require_f(){
                if (V.DM.perk_switch.tansform_knowlege) return false
                if (V.feats.currentSave['Neko'] === undefined) return '你不曾變成貓，無法解鎖這個能力'
            },
            'Effect_only':true,
            'noswich':1,
            'Effect':"<<transform 'cat' 70>><<DM_transform>><<clamp>><<updatesidebarimg>>",

        },
        "transform_fox":{
            'class':'meat',
            'subclass':'transform',
            'max':1,
            'cost_type':'Class_PT',
            'name': '狐化',
            'descript':'增強狐化',
            'cost': 10,
            require_f(){
                if (V.DM.perk_switch.tansform_knowlege) return false
                if (V.feats.currentSave['Fox'] === undefined) return '你不曾變成狐，無法解鎖這個能力'
            },
            'Effect_only':true,
            'noswich':1,
            'Effect':`<<transform 'fox' 70>><<DM_transform>><<clamp>><<updatesidebarimg>>`,

        },
        "transform_wolf":{
            'class':'meat',
            'subclass':'transform',
            'max':1,
            'cost_type':'Class_PT',
            'name': '狼化',
            'descript':'增強狼化',
            'cost': 10,
            require_f(){
                if (V.DM.perk_switch.tansform_knowlege) return false
                if (V.feats.currentSave['Wolf'] === undefined) return '你不曾變成狼，無法解鎖這個能力'
            },
            'Effect_only':true,
            'noswich':1,
            'Effect':`<<transform 'wolf' 70>><<DM_transform>><<clamp>><<updatesidebarimg>>`,

        },
        "transform_cow":{
            'class':'meat',
            'subclass':'transform',
            'max':1,
            'cost_type':'Class_PT',
            'name': '牛化',
            'descript':'增強牛化',
            'cost': 10,
            require_f(){
                if (V.DM.perk_switch.tansform_knowlege) return false
                if (V.feats.currentSave['Cattle'] === undefined) return '你不曾變成牛，無法解鎖這個能力'
            },
            'Effect_only':true,
            'noswich':1,
            'Effect':"<<transform 'cow' 70>><<DM_transform>><<clamp>><<updatesidebarimg>>",

        },
        "transform_eagle":{
            'class':'meat',
            'subclass':'transform',
            'max':1,
            'cost_type':'Class_PT',
            'name': '鷹化',
            'descript':'增強鷹化',
            'cost': 10,
            require_f(){
                if (V.DM.perk_switch.tansform_knowlege) return false
                if (V.feats.currentSave['Harpy'] === undefined) return '你不曾變成哈比，無法解鎖這個能力'
            },
            'Effect_only':true,
            'noswich':1,
            'Effect':"<<transform 'bird' 70>><<DM_transform>><<clamp>><<updatesidebarimg>>",

        },
        "gender_switch":{
            'class':'meat',
            'max':1,
            'cost_type':'M',
            'name': '性轉換',
            'descript':'轉換成對立的性別。',
            'cost': 1000,
            require_f(){
                if(V.sexStats.vagina.menstruation.currentState !== 'normal') return V.sexStats.vagina.menstruation.currentState === 'recovering' ? '你的身體正從懷孕中恢復。' : '你的胎兒阻止了你。'
                if(V.earSlime.growth >= 50) return '耳朵史萊姆正在阻止你。'
                if(V.DM.gender_switching) return '轉化正在發生，你似乎需要睡眠。'
                if(!['m','f'].includes(V.player.gender)) return '這個似乎對你沒有效用'
            
            },
            'require_m':7,
            'Effect_only':true,
            'noswich':1,
            'Effect':"<<set $DM.gender_switching to true>>",
        },
        //------------------------------------------
        //鍊金術 對物質的控制
        //------------------------------------------
        
        "doll":{
            'class':'alchemy',
            'max':1,
            'cost_type':'Class_PT',
            'name': '替身人偶',
            'descript':'創造一個假人替你上課。',
            'cost': 100
        },
        "material_craft":{
            'class':'alchemy',
            'max':1,
            'cost_type':'Class_PT',
            'name': '物質創造',
            'descript':'轉化物質的能力',
            'cost': 100
        },
        "spray_craft":{
            'class':'alchemy',
            'max':5,
            'cost_type':'Class_PT',
            'name': '噴霧生成',
            descript(){
                return `每小時能夠生成${V.DM.spray_craft}瓶噴霧。`
            },
            'cost': 100,
            require_f(){
                if (!V.DM.material_craft){
                    return '需要物質創造'
                }
            }
        },
        "slave_w":{
            'class':'alchemy',
            'max':1,
            'cost_type':'Class_PT',
            'name': '工作人偶(白)',
            'Effect_only':true,
            'descript':'創造一個假人替你賺錢。(現有<<print $DM.slave_w>>具)',
            'Effect':'<<set $DM.slave_w += 1>>',
            cost_function(n){return 100 + 10*V.DM.slave_w },
            'alche':true,
            'effect_describe':'人偶變成社畜的樣子，步伐沉重的離開了。'
        },        
        "slave_b":{
            'class':'alchemy',
            'max':1,
            'cost_type':'M',
            'name': '工作人偶(黑)',
            'Effect_only':true,
            'descript':'創造一個假人替你賺錢。(現有<<print $DM.slave_b>>具)',
            'Effect':'<<set $DM.slave_b += 1>>',
            'cost': 1000,
            cost_function(n){return 1000 + 100*V.DM.slave_b },
            'alche':true,
            'effect_describe':'人偶變成脫衣舞女的樣子，步伐沉重的離開了。'
        },
        //-------------------------------
        //黑魔法
        //-------------------------------
        "Encourage_perk":{
            'class':'mind control',
            'max':5,
            'cost_type':'Class_PT',
            'name': '強欲',
            'descript':'能讓做愛對手更持久，效果隨技能增強。',
            'cost': 100,
            'spell':true,
            'spell_effect':'對象好像更持久了。<<set $enemyarousalmax += 500 * $DM.Encourage_perk>>',
            'spell_end_effect':'',
            times_f(_){return 1}
        },
        "Endure_perk":{
            'class':'mind control',
            'max':5,
            'cost_type':'Class_PT',
            'name': '忍耐',
            'descript':'消除疼痛，降低快感，且戰鬥後不會暈倒。',
            'cost': 100,
            'spell':true,
            'spell_effect':'你感覺好多了。<<set $pain -= 50>><<set $arousal -= 3000>>',
            'spell_end_effect':'<<set $trauma -= 100>><<set $stress to Math.min($stressmax - 1000 , $stress)>>'
        },
        "pain":{
            'class':'mind control',
            'max':10,
            'cost_type':'Class_PT',
            'name': '痛苦',
            'descript':'能給敵人痛苦，等級越高越強烈。',
            'cost': 200,
            'spell':true,
            'spell_effect':'一股痛苦衝擊了對手。<<set _to_damag to 5 + 2 * $DM.pain>><<defiance _to_damag>>',
            'spell_end_effect':'',
            times_f(n){
                if (n <= 3){return n}
                return Math.ceil(n-3/2) + 3
        }
        },
        "fastgun":{
            'class':'mind control',
            'max':5,
            'cost_type':'Class_PT',
            'name': '早洩',
            'descript':'能讓做愛對手更快高潮，效果隨技能增強。',
            'cost': 200,
            'spell':true,
            'spell_effect':'一股慾望衝擊了對手。<<set $enemyarousalmax to Math.ceil((0.8 - 0.05 * $DM.fastgun) * $enemyarousalmax)>>',
            'spell_end_effect':'',
            times_f(_){return 1}
        },
        "enlactate":{
            'class':'meat',
            'max':1,
            'cost_type':'Class_PT',
            'name': '催乳',
            'descript':'能讓做愛對手分泌乳汁。',
            'cost': 200,
            'spell':true,
            'spell_effect':'<<set $NPCList[$mouthtarget].lactation to 1>>',
            'spell_end_effect':'',
            times_f(_){return 1},
            spell_condition_f(){
                return V.NPCList[V.mouthtarget]?.gender === 'f'
            }
        },
        "futa_to_me":{
            'class':'meat',
            'max':1,
            'cost_type':'Class_PT',
            'name': '扶他化(自身)',
            'descript':'暫時長出陰莖，只有沒有陰莖的人能用。',
            'cost': 200,
            'spell':true,
            'spell_effect':`
                你長出了陰莖。
                <<set $penisuse to 0>>
                <<set $penisstate to 0>>
                <<set $player.gender to 'h'>>
                <<set $player.sex to 'h'>>
                <<set $player.penisExist to true>>
                <<set $player.ballsExist to true>>`,
            'spell_end_effect':`
                你的陰莖消失了。
                <<set $penisuse to 'none'>>
                <<set $penisstate to 'none'>>
                <<set $player.gender to 'f'>>
                <<set $player.sex to 'f'>>
                <<set $player.penisExist to false>>
                <<set $player.ballsExist to false>>`,
            times_f(_){return 1},
            spell_condition_f(){
                return V.player.gender === 'f'
            }
        },
        "futa_to_partner":{
            'class':'meat',
            'max':1,
            'cost_type':'Class_PT',
            'name': '扶他化(他人)',
            'descript':'暫時長出陰莖，只對沒有陰莖的人有用。',
            'cost': 200,
            'spell':true,
            'spell_effect':`
                對象長出了陰莖。
                <<set $NPCList[$mouthtarget].penis to 'idle'>>`,
            'spell_end_effect':`
                對象的陰莖消失了。`,
            times_f(_){return 1},
            spell_condition_f(){
                return V.NPCList[V.mouthtarget]?.penis === 'none'
            }
        },
        //---------------------------------------------------
        //血肉
        //---------------------------------------------------

        "milk_gain":{
            'class':'meat',
            'subclass':'liquid',
            'max':40,
            'cost_type':'Class_PT',
            'name': '豐壤',
            'descript':'增加母乳量。<br>現在母乳容量:<<print $milk_volume>><br>現在母乳容量最大值:<<print $milk_max>>',
            'cost': 50,
            'noswich':1,
            Effect_f(){
                
                V.milk_volume += 300
                V.milk_amount = V.milk_volume
                
                if (V.cow >= 6){V.milk_max  = 6000 + 300 * V.DM.milk_gain}
                else{V.milk_max  = 3000 + 300 * V.DM.milk_gain}
            },
        },
        "semen_gain":{
            'class':'meat',
            'subclass':'liquid',
            'max':40,
            'cost_type':'Class_PT',
            'name': '恐怖精囊',
            'descript':'增加精液量。<br>現在精液容量:<<print $semen_volume>><br>現在精液容量最大值:<<print $semen_max>>',
            'cost': 50,
            'noswich':1,
            Effect_f(){
                
                V.semen_volume += 300
                V.semen_amount = V.semen_volume
                
                if (V.cow >= 6){V.milk_max  = 6000 + 300 * V.DM.semen_gain}
                else{V.milk_max  = 3000 + 300 * V.DM.semen_gain}
            },
        },
        "milk_nofull":{
            'class':'meat',
            'subclass':'liquid',
            'max':1,
            'cost_type':'Class_PT',
            'name': '母乳抑制',
            'descript':'母乳會在到達容量一半的時候停止增加',
            'cost': 10,
        },
        "org_infinite":{
            'class':'meat',
            'max':1,
            'cost_type':'Class_PT',
            'name': '無限高潮',
            'descript':'多次高潮不會讓你痛苦',
            'cost': 10,
        },
        "milk_infinite":{
            'class':'meat',
            'subclass':'liquid',
            'max':1,
            'cost_type':'Class_PT',
            'name': '無限母乳',
            'descript':'母乳不會耗竭',
            'cost': 100,
        },
        "presure_transform":{
            'class':'mind control',
            'max':1,
            'cost_type':'Class_PT',
            'name': '壓力轉換',
            'descript':'所有壓力會轉換成快感',
            'cost': 100,
            'require_m':5,
            update(){
                if (V.stress >= 0){
                    V.arousal += V.stress
                    V.stress = 0}
            }
        },
        "semen_infinite":{
            'class':'meat',
            'subclass':'liquid',
            'max':1,
            'cost_type':'Class_PT',
            'name': '無限精液',
            'descript':'精液不會耗竭',
            'cost': 100,
        },
        "breast_size_g":{
            'class':'meat',
            'subclass':'body',
            'max':1,
            'cost_type':'M',
            'name': '乳房增大',
            'descript':'增加胸部大小',
            'cost': 100,
            'noswich':1,
            'Effect_only':true,
            'body_control':1,
            Effect_f(){
                if (V.player.breastsize < V.breastsizemax){
                    V.player.breastsize += 1;
                    wikifier('<<updatesidebarimg>>');
                }
            },
            require_f(){
                if (V.player.breastsize >= V.breastsizemax){
                    return '你的胸部似乎不能變大了'
                }
            }
        },
        "breast_size_l":{
            'class':'meat',
            'subclass':'body',
            'max':1,
            'cost_type':'M',
            'name': '乳房縮小',
            'descript':'降低胸部大小',
            'cost': 100,
            'noswich':1,
            'Effect_only':true,
            'body_control':1,
            Effect_f(){
                if (V.player.breastsize > V.breastsizemin){
                    V.player.breastsize -= 1;
                    wikifier('<<updatesidebarimg>>');
                }
            },
            require_f(){
                if (V.player.breastsize <= V.breastsizemin){
                    return '你的胸部似乎不能變小了'
                }
            }
        },
        "penis_size_g":{
            'class':'meat',
            'subclass':'body',
            'max':1,
            'cost_type':'M',
            'name': '陰莖增大',
            'descript':'增加陰莖大小',
            'cost': 100,
            'noswich':1,
            'Effect_only':true,
            'body_control':1,
            Effect_f(){
                if (V.player.penissize < V.penissizemax){
                    V.player.penissize += 1;
                    wikifier('<<updatesidebarimg>>');
                }
            },
            require_f(){
                if (V.player.penissize >= V.penissizemax){
                    return '你的陰莖似乎不能變大了'
                }
            }
        },
        "penis_size_l":{
            'class':'meat',
            'subclass':'body',
            'max':1,
            'cost_type':'M',
            'name': '陰莖縮小',
            'descript':'降低陰莖大小',
            'cost': 100,
            'noswich':1,
            'Effect_only':true,
            'body_control':1,
            Effect_f(){
                if (V.player.penissize > V.penissizemin){
                    V.player.penissize -= 1;
                    wikifier('<<updatesidebarimg>>');
                }
            },
            require_f(){
                if (V.player.penissize <= V.penissizemin){
                    return '你的陰莖似乎不能變小了'
                }
            }
        },
        "bhair_size_g":{
            'class':'meat',
            'subclass':'body',
            'max':1,
            'cost_type':'M',
            'name': '後髮增長',
            'descript':'增加後髮長度',
            'cost': 5,
            'noswich':1,
            'Effect_only':true,
            'body_control':1,
            Effect_f(){
                V.hairlength += 100;
                wikifier('<<clamp>>');
                wikifier('<<calchairlengthstage>>');
                wikifier('<<updatesidebarimg>>');
            },
            require_f(){
                if (V.hairlength >= 1000){
                    return '你的後髮似乎不能變長了'
                }
            }
        },
        "bhair_size_l":{
            'class':'meat',
            'subclass':'body',
            'max':1,
            'cost_type':'M',
            'name': '後髮縮短',
            'descript':'減少後髮長度',
            'cost': 5,
            'noswich':1,
            'Effect_only':true,
            'body_control':1,
            Effect_f(){
                V.hairlength -= 100;
                wikifier('<<clamp>>');
                wikifier('<<calchairlengthstage>>');
                wikifier('<<updatesidebarimg>>');
            },
            require_f(){
                if (V.hairlength <= 0){
                    return '你的後髮似乎不能變短了'
                }
            }
        },
        "fhair_size_g":{
            'class':'meat',
            'subclass':'body',
            'max':1,
            'cost_type':'M',
            'name': '前髮增長',
            'descript':'增加前髮長度',
            'cost': 5,
            'noswich':1,
            'Effect_only':true,
            'body_control':1,
            Effect_f(){
                V.fringelength += 100;
                wikifier('<<clamp>>');
                wikifier('<<calchairlengthstage>>');
                wikifier('<<updatesidebarimg>>');
            },
            require_f(){
                if (V.fringelength >= 1000){
                    return '你的前髮似乎不能變長了'
                }
            }
        },
        "fhair_size_l":{
            'class':'meat',
            'subclass':'body',
            'max':1,
            'cost_type':'M',
            'name': '前髮縮短',
            'descript':'減少前髮長度',
            'cost': 5,
            'noswich':1,
            'Effect_only':true,
            'body_control':1,
            Effect_f(){
                V.fringelength -= 100;
                wikifier('<<clamp>>');
                wikifier('<<calchairlengthstage>>');
                wikifier('<<updatesidebarimg>>');
            },
            require_f(){
                if (V.fringelength <= 0){
                    return '你的前髮似乎不能變短了'
                }
            }
        },"notan":{
            'class':'meat',
            'subclass':'body',
            'max':1,
            'cost_type':'M',
            'name': '日曬消除',
            'descript':'消除日曬',
            'cost': 20,
            'noswich':1,
            'Effect_only':true,
            'body_control':1,
            Effect_f(){
                V.player.skin.layers = []
            },
            require_f(){
                if (!V.player.skin.layers){
                    return '似乎對你沒用'
                }
            }
        },

        "milk_charge":{
            'class':'meat',
            'subclass':'liquid',
            'max':1,
            'cost_type':'M',
            'name': '母乳補充',
            'descript':'補充母乳到當前最大值。',
            'cost': 50,
            'noswich':1,
            'Effect_only':true,
            'Effect':"<<set $milk_amount to $milk_volume>>",
            cost_function(_){
                if(V.milk_volume > V.milk_amount){
                    return Math.ceil((V.milk_volume - V.milk_amount)/100)
                }
                return 0
            }
        },
        "milk_volume_charge":{
            'class':'meat',
            'subclass':'liquid',
            'max':1,
            'cost_type':'M',
            'name': '乳腺擴張',
            'descript':'補充母乳容量到當前最大值。',
            'cost': 50,
            'noswich':1,
            'Effect_only':true,
            'Effect':"<<set $milk_volume to $milk_max>>",
            cost_function(_){
                if(V.milk_max > V.milk_volume){
                    return Math.ceil((V.milk_max - V.milk_volume)/20)
                }
                return 0
            },
            'require_m':2
        },

        "milk_volume_die":{
            'class':'meat',
            'subclass':'liquid',
            'max':1,
            'cost_type':'M',
            'name': '乳腺枯竭',
            'descript':'枯竭你的乳腺。',
            'cost': 50,
            'noswich':1,
            'Effect_only':true,
            'Effect':"<<set $milk_volume to 30>>",
            cost_function(_){
                if(V.milk_volume > 30){
                    return Math.ceil((V.milk_volume - 30)/20)
                }
                return 0
            },
            'require_m':2
        },

        "semen_charge":{
            'class':'meat',
            'subclass':'liquid',
            'max':1,
            'cost_type':'M',
            'name': '精液補充',
            'descript':'補充精液到當前最大值。',
            'cost': 50,
            'noswich':1,
            'Effect_only':true,
            'Effect':"<<set $semen_amount to $semen_volume>>",
            cost_function(_){
                if(V.semen_volume > V.semen_amount){
                    return Math.ceil((V.semen_volume - V.semen_amount)/100)
                }
                return 0
            }
        },
        "semen_volume_charge":{
            'class':'meat',
            'subclass':'liquid',
            'max':1,
            'cost_type':'M',
            'name': '精囊擴張',
            'descript':'補充精囊容量到當前最大值。',
            'cost': 50,
            'noswich':1,
            'Effect_only':true,
            'Effect':"<<set $semen_volume to $semen_max>>",
            cost_function(_){
                if(V.semen_max > V.semen_volume){
                    return Math.ceil((V.semen_max - V.semen_volume)/20)
                }
                return 0
            },
            'require_m':2
        },
        "semen_volume_die":{
            'class':'meat',
            'subclass':'liquid',
            'max':1,
            'cost_type':'M',
            'name': '精囊枯竭',
            'descript':'枯竭你的精囊。',
            'cost': 50,
            'noswich':1,
            'Effect_only':true,
            'Effect':"<<set $semen_volume to 0>>",
            cost_function(_){
                if(V.semen_volume > 0){
                    return Math.ceil(V.semen_volume/20)
                }
                return 0
            },
            'require_m':2
        },
        "parasite_grow":{
            'class':'meat',
            'max':1,
            'cost_type':'M',
            'name': '苗床生長',
            'descript':'讓寄生蟲的孕育時間加速。',
            'cost': 100,
            'Effect_only':true,
            'noswich':1,
            Effect_f(){
                for (let genital of ["vagina" , "anus"]){
                    const pregnancy = V.sexStats[genital].pregnancy;
                    if (pregnancy.type === "parasite") {
                        pregnancy.fetus.forEach(parasite => {
                            if (parasite.fertilised) {
                                parasite.timeLeft = -1;
                                parasite.daysLeft = 0;
                                if(!parasite.stats.speed) parasite.stats.speed = 100
                                parasite.stats.speed = Math.min(parasite.stats.speed - 50 , 100)
                                parasite.stats.speed = parasite.stats.speed < 1 ? 1:parasite.stats.speed
                            }
                        });
                    }
                }
                parasiteProgressDay();
	            parasiteProgressDay("vagina");
                parasiteProgressTime(900);
	            parasiteProgressTime(900, "vagina")
            },
            'require_m':3
        },
        "slime_begone":{
            'class':'meat',
            'max':1,
            'cost_type':'M',
            'name': '耳史再見',
            'descript':'消除耳內史萊姆。',
            'cost': 300,
            'Effect_only':true,
            'noswich':1,
            'Effect':`
                <<if $parasite.left_ear.name is "slime">>
                    <<removeparasite left_ear>>
                <</if>>
                <<if $parasite.right_ear.name is "slime">>
                    <<removeparasite right_ear>>
                <</if>>`,
            'require_m':3,
            'effect_describe':'再見了朋友。',
            require_f(){
                if (V.parasite.left_ear?.name !== "slime" && V.parasite.right_ear?.name !== "slime"){
                    return '沒有效果。'
                }
            }
        },
        //----------------------------
        
        
    },
    Perk_Buy(perk_name){
        let _perkdata = this.Perks[perk_name]
        let _text = "";
        //描述
        _text += _perkdata.name + ":" 
        _text +=  typeof _perkdata.descript === "function" ? _perkdata.descript() : _perkdata.descript

        if (_perkdata.spell){_text += this.printtimes(perk_name)}
        //LV顯示
        let _ismax = false;
        if (!_perkdata.Effect_only){
            let _level = V.DM[perk_name] === undefined ? 0 : V.DM[perk_name];
            _text += ('<br>Lv:' + _level);
            if (_level >= _perkdata.max){
                    _ismax = true;
                    _text += ('(MAX)')
                }
        }
        //開關
        
        _text += this.t_perk_switch(perk_name);
        //使用
        if(!_ismax){
            _text += '<br>'
            let _typemap = {
                'Class_PT': V.DM.class_pt[_perkdata.class],
                'M': V.DM.Mana
            }
            if (_perkdata.require_m && _perkdata.require_m > V.DM['master_' + _perkdata.class]){
                _text += ('<span class="black">需要專精等級'+_perkdata.require_m+'。</span>')
            }
            else if (_perkdata.require_f && _perkdata.require_f()){
                _text += ('<span class="black">'+_perkdata.require_f()+'</span>')
            }
            else if (_typemap[_perkdata.cost_type] >= this.getcost(perk_name)){
                let buttum_name = 'Class_PT' === _perkdata.cost_type ? '升級' : '施法'
                _text += this.Linkbuttun(buttum_name,'<<=setup.DM.t_levelup(\"'+ perk_name +'\")>>',_perkdata.timepass)
            }
            else{
                _text += ('<span class="black">點數不足</span>')
            }
            if (V.DM[perk_name] !== _perkdata.max && !(_perkdata.require_f && _perkdata.require_f())){
                _text += this.printcost(perk_name)
            }
            
        }
        if (V.DM[perk_name] && _perkdata.reducible){
            _text += '|' + this.Linkbuttun('降級','<<set $DM.'+ perk_name +' -= 1>>') 
        }
        if(_perkdata.endwith){
            _text += _perkdata.endwith
        }
        _text = '<div style="border: 1px solid var(--300); padding: 0.3rem; margin: 0.15rem">' + _text + '</div>';
        return _text
    }
    ,
    getcost(perk_name){
        if (this.Perks[perk_name].cost_function){
            return this.Perks[perk_name].cost_function(V.DM[perk_name || 0])
        }
        return this.Perks[perk_name].cost
    },
    printcost(perk_name){
        let _text = ""
        if (!this.getcost(perk_name)) return '';
        let _color_dict = {
            'Class_PT':"<span class=\"gold\">",
            'M':"<span class=\"purple\">",
            undefined:""
        }
        _text += _color_dict[this.Perks[perk_name].cost_type]
        _text +=  (-1 * this.getcost(perk_name));
        if (this.Perks[perk_name].cost_type) _text += '</span>';
        _text ='(' + _text + ')'
        return _text
    },
    printtimes(perk_name){
        let _use_limit = this.Perks[perk_name].times_f ? this.Perks[perk_name].times_f(V.DM[perk_name]) : V.DM[perk_name]
        return "可用"+ _use_limit +"次。"
    },
    t_levelup(perk_name){
        let _text = ''
        if (this.Perks[perk_name].cost_type === 'Class_PT'){
            V.DM.class_pt[this.Perks[perk_name].class] -= this.getcost(perk_name)
        }
        else if(this.Perks[perk_name].cost_type === 'M'){
            V.DM.Mana -= this.getcost(perk_name)
        }
        if(!this.Perks[perk_name].Effect_only){
            V.DM[perk_name] = V.DM[perk_name] === undefined ? 1 : V.DM[perk_name]+1
            V.DM.perk_switch[perk_name] = true}
        if(this.Perks[perk_name].effect_describe){
            V.DM.desctibe_perk = perk_name
        }
        if(this.Perks[perk_name].Effect ){_text += this.Perks[perk_name].Effect}
        if(this.Perks[perk_name].Effect_f){_text += '<<=setup.DM.Perks.'+perk_name+'.Effect_f()>>'}
        return _text
    },
    t_perk_switch(perk_name){
        let _text = "";
        
        if (this.Perks[perk_name].noswich || this.Perks[perk_name].Effect_only){
            return _text
        }
        if (V.DM[perk_name]){
            if(V.DM.perk_switch[perk_name]){
                _text += '<br><span class="gold">已開啟</span>|' + this.Linkbuttun('關閉','<<set $DM.perk_switch.'+ perk_name +' to false>>')
            }else{
                _text += '<br><span class="black">已關閉</span>|'+ this.Linkbuttun('開啟','<<set $DM.perk_switch.'+ perk_name +' to true>>')
            }
            return _text
        }
        else{
            return ''
        }
    },
    spellaction_add(){
        let _text=""
        for(let key in this.Perks){
            V.DM.spell_used[key] = V.DM.spell_used[key] === undefined ? 0 : V.DM.spell_used[key]
            let _use_limit = this.Perks[key].times_f ? this.Perks[key].times_f(V.DM[key]) : V.DM[key]
            
            let _condition = this.Perks[key].spell_condition_f ? this.Perks[key].spell_condition_f() : true

            if (_condition && this.Perks[key].spell && V.DM.perk_switch[key] && V.DM.spell_used[key] < _use_limit){
                _text += '<<set _mouthaction[\"法術:' + this.Perks[key].name + '\"] to \"DM_'+ key +'\">>'
            }
        }
        return _text
    },
    spelleffect_add(){
        let _text=""
        for(let key in this.Perks){
            if (V.mouthaction === 'DM_'+ key){
                _text += this.Perks[key].spell_effect;
                V.DM.spell_used[key] += 1
            }
        }
        return _text
    },
    spellend_add(){
        let _text=""
        for(let key in this.Perks){
            if (this.Perks[key].spell && V.DM.perk_switch[key] && V.DM.spell_used[key]){
                _text += this.Perks[key].spell_end_effect;
                V.DM.spell_used[key] = 0
            }
        }
        return _text
    },
    List_Generator(pairs){
        let _text = ''
        for (let perk_name in this.Perks){
            if (pairs.every(([key, value]) => (
                (this.Perks[perk_name][key] === value) || 
                (key === 'subclass') && (this.get_subclass(perk_name) === value)
                )))
                _text += this.Perk_Buy(perk_name)
        }
        return _text
    },
    List_Filter(pairs){
        return Object.keys(this.Perks).filter(perk_name => (pairs.every(([key, value]) => (
            (this.Perks[perk_name][key] === value) || 
            (key === 'subclass') && (this.get_subclass(perk_name) === value)
            ))))

    }
    ,
    describe(){
        let _text = ''
        if (V.DM.desctibe_perk){
            _text += this.Perks[V.DM.desctibe_perk].effect_describe
            _text += '<br>'
            V.DM.desctibe_perk = false
        }
        if (V.DM.desctibe_m){
            _text += V.DM.desctibe_m
            _text += '<br>'
            V.DM.desctibe_m = false
        }
        
        return _text
    },
    mag_daily(){
        this.DM_update()
        V.DM.daily_M = 10 *((1 + V.DM.Mana_pool));
        let _modifier = 1;
        if (V.DM.perk_switch.shackles_willpower) _modifier *= (V.DM.shackles_willpower*0.1 + 1);
        if (V.DM.perk_switch.shackles_arousal) _modifier *= V.DM.shackles_arousal === 10 ? 5 : (V.DM.shackles_arousal*0.1 + 1);
        V.DM.daily_M *= _modifier;
        V.DM.daily_M = Math.floor(V.DM.daily_M)
        V.DM.hourly_M = Math.floor(V.DM.daily_M/0.24)/100

    },
    willpower_modifier(){
        let _modifier = 1;
        if (V.DM.perk_switch.shackles_willpower)_modifier -= V.DM.shackles_willpower * 0.1;
        return _modifier
    },
    dailypass(){
	    V.DM.daily.Convince = false
        V.DM.daily.expel_idlers = false
        if (V.DM.doll){
            if (Time.isSchoolDay(Time.yesterday) && V.location !== "prison"){
                V.daily.school.attended.science = true
                V.daily.school.attended.maths = true
                V.daily.school.attended.english = true
                V.daily.school.attended.history = true
                V.daily.school.attended.swimming = true
                V.daily.school.attended.housekeeping = true
            }
        }
    },
    hourlypass(){
        this.mag_daily()
        V.DM.Mana += V.DM.hourly_M
        if (V.DM.perk_switch.spray_craft && V.spray < V.spraymax){
            wikifier('<<spray $DM.spray_craft>>')
        }
        if (V.DM.perk_switch.shackles_arousal && V.DM.shackles_arousal === 10) {
            if (V.DM.shackles_arousal_reward_start & !V.DM.shackles_arousal_reward_end) {
                V.DM.shackles_arousal_reward_end = true
                V.DM.shackles_arousal_reward = V.DM.shackles_arousal_reward + 1 || 0
            }
            V.DM.shackles_arousal_reward_start = true
        }
    },
    weeklypass(){
        if (V.DM.perk_switch.Noforget){
            if (Time.schoolTerm) {
                V.science_exam = Math.clamp(V.science_exam + 7, -100, 200);
                V.maths_exam = Math.clamp(V.maths_exam + 7, -100, 200);
                V.english_exam = Math.clamp(V.english_exam + 7, -100, 200);
                V.history_exam = Math.clamp(V.history_exam + 7, -100, 200);

            }
        }
        V.DM.weekly_money = 100000 * (V.DM.slave_b + V.DM.slave_w)
        wikifier('<<money $DM.weekly_money "難過人偶">>')
        V.DM.effect_message_weekly = true
    },
    effect_message(){
        let _text = "";
        if (V.DM && V.DM.effect_message_weekly){
            if (V.DM.slave_b + V.DM.slave_w > 0){
                _text += '你的人偶為你帶來了 £<<print 1000 * ($DM.slave_b + $DM.slave_w)>>。'
            }
            V.DM.effect_message_weekly = false
        }
        if (V.DM && V.DM.effect_message){
            _text += V.DM.effect_message
            V.DM.effect_message = ''
        }
        return _text
    },
    think_magic(_class_name){
        
        if (V.DM.class_pt[_class_name] === undefined) V.DM.class_pt[_class_name] = 0
        let _text = ''
        if (V.DM.thinking_magic){
            for (let stat_path in this.stat_transform[_class_name]){
                if (V.DM.stat_transform_history[stat_path] === undefined) V.DM.stat_transform_history[stat_path] = 0;
                if (this.getValueByPath(V,stat_path) !== undefined) {
                    let _pt = Math.floor((this.getValueByPath(V,stat_path) - V.DM.stat_transform_history[stat_path])/this.stat_transform[_class_name][stat_path].cost) 
                    V.DM.class_pt[_class_name] += _pt
                    V.DM.stat_transform_history[stat_path] += _pt * this.stat_transform[_class_name][stat_path].cost
                    if (_pt){
                        _text += '你回想了你的' + this.stat_transform[_class_name][stat_path].name + '，你對於' +this.classes_cn[_class_name]+'的理解更深了，'+this.classes_cn[_class_name] + '點數增加了<span class=\"gold\">' + _pt +'</span>。<br>'
                    }
                }
            }
            delete V.DM.thinking_magic
        }
        _text += this.Linkbuttun('回想你的經驗','<<set $DM.thinking_magic to true>>') + '<br>'
        return _text
    },
    think_magic_history(_class_name){
        
        if (V.DM.class_pt[_class_name] === undefined) V.DM.class_pt[_class_name] = 0
        let _text = ''
        if (V.DM.thinking_magic_h){
            for (let stat_path in this.stat_transform[_class_name]){
                if (V.DM.stat_transform_history[stat_path]){
                    _text += this.stat_transform[_class_name][stat_path].name + " : " +V.DM.stat_transform_history[stat_path] + '<br>'
                }
            }
            delete V.DM.thinking_magic_h
        }
        _text += this.Linkbuttun('已吸收的經驗','<<set $DM.thinking_magic_h to true>>') + '<br>'
        return _text
    },
    get_class_pt(_class_name){
        if (V.DM.class_pt[_class_name] !== undefined){
            return V.DM.class_pt[_class_name]
        }
        else{
            V.DM.class_pt[_class_name] = 0
        }
    },
    class_describe(_class_name){
        let _text = ''
        _text += this.think_magic(_class_name)
        _text += this.think_magic_history(_class_name)
        _text += (this.classes_cn[_class_name] + '點數: ' + "<span class=\"gold\">" + this.get_class_pt(_class_name) + "</span>");
        _text += '<br>';
        return _text
    },
    get_subclass(perk_name){
        let _perkdata = this.Perks[perk_name];
        if (_perkdata.subclass) return _perkdata.subclass;
        if (_perkdata.Effect_only) return 'spell';
        if (_perkdata.spell) return 'battle' ;
        return 'perk';
    },
    twee_class_bar(){
        let _text = ''
        for (let _classname of this.classes_list){
            _text += this.Linkbuttun(this.classes_cn[_classname],"<<set $DM._class_menu_chosen to '"+ _classname +"'>><<set $DM.menutree to 'class_menu'>>")
            _text += '|'
        }
        return _text +'<br>'
    },
    twee_class_list(){
        let _text = ''
        for (let _s_classname of this.classes[V.DM._class_menu_chosen].subclass_list){
            _text += '<<foldout false \"DM.Foldout.'+ V.DM._class_menu_chosen + '_' + _s_classname +'\">>'
            _text += '<span class="gold">'+this.classes_cn[_s_classname]+'</span>'
            _text += this.List_Generator( [ ['class',V.DM._class_menu_chosen],['subclass',_s_classname] ] )
            _text += '<</foldout>>'
        }
        return _text 
    },
    sleep_effect_add(){
        if (V.DM && V.DM.gender_switching){
            V.DM.gender_switching = false
            if (this.Perks.gender_switch.require_f()){
                V.DM.effect_message += '因為不明原因，你的性轉換失效了。'
                return
            }
            
            V.DM.effect_message = (V.DM.effect_message || '') + '你的身體發生了某種變化，你的'  
            if (V.player.gender === 'm'){
                V.vaginause = 0
                V.vaginastate = 0
                V.penisuse = 'none'
                V.penisstate ='none'
                V.player.gender = 'f'
                V.player.sex = 'f'
                V.player.ballsExist = false
                V.player.penisExist = false
                V.player.vaginaExist = true
                V.sexStats.vagina.menstruation.running = true
                wikifier('<<updatesidebarimg>>');
                V.DM.effect_message += '陰莖消失了，並且變成了小穴。'
            }
            else if (V.player.gender === 'f'){
                V.vaginause = 'none'
                V.vaginastate = 'none'
                V.penisuse = 0
                V.penisstate = 0
                V.player.gender = 'm'
                V.player.sex = 'm'
                V.player.ballsExist = true
                V.player.penisExist = true
                V.player.vaginaExist = false
                V.sexStats.vagina.menstruation.running = false
                wikifier('<<updatesidebarimg>>');
                V.DM.effect_message += '小穴消失了，並且長出了陰莖。'
            }
            V.DM.gender_switching = false
        }


    }
}
