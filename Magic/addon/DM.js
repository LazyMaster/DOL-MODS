

function DM_MinArousal_decorator(_f) {
    return  function(){
        let result = _f()
        setup.DM.Goinit()
        if (V.DM.shackles_arousal){
            result += V.DM.shackles_arousal * 1000
        }
        return result
    }   
}
// NEXT : 
// 更多主動獲得點數機制
//      奪取童貞 淨化腐化
//  枷鎖(分級式描述,可降級PERK(需要隔日))
// 打工人偶 懷孕操控 煉金術 物質創造(木頭)
// 煉金術:需要材料的技能 血檸?


setup.DM = {
    'init': {
        'minarousal_updated':false,
        "WhiteMagic_pt":0,
        "BlackMagic_pt":0,
        'Mana':0,
        'Mana_max':0,
        'perk_switch':{},
        'spell_used':{},
        'daily':{},
        'B_spell_list':[],
        'W_spell_list':[],
        'menutype':'overlay',
        'slave_w':0,
        'slave_b':0,
        'desctibe_perk':false,
        'desctibe_m':false,
        'f_pairs':[]
    },
    Goinit(){
        if (!this.init.minarousal_updated){
            playerHeatMinArousal = DM_MinArousal_decorator(playerHeatMinArousal);
            window.playerHeatMinArousal = playerHeatMinArousal;
            this.init.minarousal_updated = true
        }
        window.playerHeatMinArousal = playerHeatMinArousal;
        window.playerRutMinArousal = playerRutMinArousal;
        if (V.DM === undefined){V.DM = {}}
        //update
        for (let key in this.init) {
            if (V.DM[key] === undefined){
                if (V['DM_'+ key]){V.DM[key] = V['DM_'+ key]}
                else {V.DM[key] = this.init[key]}
            }
        }
        V.DM.B_spell_list = [];
        V.DM.W_spell_list = [];
        for(let key in this.Perks){
            if (V.DM[key] === undefined){
                V.DM[key] = 0
            }
            if      (this.Perks[key].BW === 'B'){V.DM.B_spell_list.push(key)}
            else if (this.Perks[key].BW === 'W'){V.DM.W_spell_list.push(key)}
        }
        if (V.backgroundTraits.includes("greenthumb")){V.DM["Greenthumb"] = 1}
        V.DM.WhiteMagic_pt = Math.round(V.DM.WhiteMagic_pt);
        V.DM.BlackMagic_pt = Math.round(V.DM.BlackMagic_pt);
        if (isNaN(V.DM.WhiteMagic_pt)){V.DM.WhiteMagic_pt = 1000}
        if (isNaN(V.DM.BlackMagic_pt)){V.DM.BlackMagic_pt = 1000}

        if (V.cow >= 6){V.milk_max  = 6000 + 300 * V.DM.milk_gain}
        else{V.milk_max  = 3000 + 300 * V.DM.milk_gain}

        V.DM.Mana_max = 100 * (1 + V.DM.B_Master + V.DM.W_Master)
        if (V.DM.Mana > V.DM.Mana_max) V.DM.Mana = V.DM.Mana_max
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
        "W_Master":{
            'max':100,
            'BW':'W',
            'name': '白魔法學識',
            'descript':'更容易獲得白魔法(獲得速度*<<print 1 + Math.floor($DM.W_Master*0.1)>>.<<print $DM.W_Master - Math.floor($DM.W_Master*0.1)*10>>)',
            'cost': 500,
            'noswich':1,
            cost_function(n){return n*100 + 200}
        },
        "shackles_willpower":{
            'max':5,
            'BW':'W',
            'name': '意志枷鎖',
            'descript':'你的意志會下降<<print $DM.shackles_willpower>>0%，但法力的獲取會增加<<print $DM.shackles_willpower>>倍。',
            'cost': 0,
            'reducible' : true,
            'shackles':true
        },
        //Spell Unlock
        "perk_body_control":{
            'max':1,
            'BW':'B',
            'name': '肉體操作',
            'descript':'解鎖改變身體狀態的法術。',
            'cost': 500
        },
        "perk_trans_control":{
            'max':1,
            'BW':'B',
            'name': '轉化操作',
            'descript':'能夠轉化成曾經變成的型態。',
            'cost': 500
        },
        "virginity_control":{
            'max':1,
            'BW':'W',
            'name': '貞潔操作',
            'descript':'解鎖恢復貞潔的法術，但魔法也無法恢復初吻和牽手。',
            'cost': 1000,
        },
        //貞潔操作
        "virginity_vigina":{
            'max':1,
            'BW':'M',
            'name': '小穴童貞修復',
            'descript':'恢復貞潔。',
            'cost': 100,
            'Effect_only':true,
            'noswich':1,
            'Effect':"<<set $player.virginity.vaginal to true>>",
            'perk_require':'virginity_control',
            require_f(){
                return V.player.virginity.vaginal !== true
            }
        },
        "virginity_penis":{
            'max':1,
            'BW':'M',
            'name': '陰莖童貞修復',
            'descript':'恢復貞潔。',
            'cost': 100,
            'Effect_only':true,
            'noswich':1,
            'Effect':"<<set $player.virginity.penile to true>>",
            'perk_require':'virginity_control',
            require_f(){
                return V.player.virginity.penile !== true
            }
        },
        "virginity_anal":{
            'max':1,
            'BW':'M',
            'name': '肛門童貞修復',
            'descript':'恢復貞潔。',
            'cost': 100,
            'Effect_only':true,
            'noswich':1,
            'Effect':"<<set $player.virginity.anal to true>>",
            'perk_require':'virginity_control',
            require_f(){
                return V.player.virginity.anal !== true
            }
        },
        "virginity_oral":{
            'max':1,
            'BW':'M',
            'name': '口腔童貞修復',
            'descript':'恢復貞潔。',
            'cost': 100,
            'Effect_only':true,
            'noswich':1,
            'Effect':"<<set $player.virginity.oral to true>>",
            'perk_require':'virginity_control',
            require_f(){
                return V.player.virginity.oral !== true
            }
        },
        //--------------------------------------
        //基礎法術
        "wash":{
            'max':1,
            'BW':'M',
            'name': '清潔溜溜',
            'descript':'用魔法清理自己。',
            'cost': 10,
            'Effect_only':true,
            'noswich':1,
            'Effect':"<<wash>><<for _active_bodypart range setup.bodyparts>><<bodywriting_clear $_active_bodypart>><</for>><<updatesidebarimg>>",
            'base':1
        },
        "tiredness_remove":{
            'max':1,
            'BW':'M',
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
            'base':1
        },
        "stress_remove":{
            'max':1,
            'BW':'M',
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
            'base':1
        },
        "arousal_remove":{
            'max':1,
            'BW':'M',
            'name': '快感平息',
            'descript':'用魔法消除興奮。',
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
        },        "Vow_lie":{
            'max':1,
            'BW':'M',
            'name': '欺騙誓言',
            'descript':'欺騙神殿的貞操誓言。',
            'cost': 10,
            'Effect_only':true,
            'noswich':1,
            'Effect':"<<set $player.virginity.temple to true>><<set $NPCName[$NPCNameList.indexOf(\"Sydney\")].virginity.temple to true>>",
            'base':1
        },
        "trauma_charge":{
            'max':1,
            'BW':'M',
            'name': '快速充能',
            'descript':'能夠馬上獲得法力，但會得到極大的創傷。',
            'cost': 0,
            'Effect_only':true,
            'noswich':1,
            Effect_f(){
                if (V.trauma <= V.traumamax){
                    V.trauma = Math.floor((V.traumamax))
                }
                wikifier('<<updatesidebarimg>>');
            },
            cost_function(n){
                if (V.trauma <= V.traumamax){
                    let _delta_trauma = Math.floor((V.traumamax - V.trauma)/5)
                    wikifier('<<updatesidebarimg>>');
                    return -1 * _delta_trauma
                }
                return 0
            },
            'base':1
        },
        "orgasm_charge":{
            'max':1,
            'BW':'M',
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
        //能力開關
        "expel_idlers":{
            'max':1,
            'BW':'W',
            'name': '驅逐閒人',
            'descript':'似乎在某些場景有用。',
            'cost': 100
        },
        "Call":{
            'max':1,
            'BW':'W',
            'name': '感召',
            'descript':'似乎在某些場景有用。',
            'cost': 100
        },
        "Convince":{
            'max':1,
            'BW':'W',
            'name': '說服',
            'descript':'似乎在某些場景有用。',
            'cost': 100
        },
        "Noforget":{
            'max':1,
            'BW':'W',
            'name': '超級記憶',
            'descript':'對學科的記憶不會下降。',
            'cost': 300
        },
        "Angel_NoFallen":{
            'max':1,
            'BW':'W',
            'name': '不再墮落',
            'descript':'讓天使不因為失貞而墮落。',
            'cost': 200
        },
        "Greenthumb":{
            'max':1,
            'BW':'W',
            'name': '園藝大師',
            'descript':'得到特性園藝大師',
            'cost': 50,
            'noswich':1,
            'Effect':"<<set $backgroundTraits.pushUnique(\"greenthumb\")>>"
        },"Noawareness":{
            'max':1,
            'BW':'B',
            'name': '本能學識',
            'descript':'不需要意識來解鎖動作。',
            'cost': 100
        },
        "doll":{
            'max':1,
            'BW':'B',
            'name': '替身人偶',
            'descript':'創造一個假人替你上課。',
            'cost': 400
        },

        "Transpass_perk":{
            'max':1,
            'BW':'B',
            'name': '透視',
            'descript':'能看到一些東西。',
            'cost': 200
        },
        //-----------------------
        //人偶
        "slave_w":{
            'max':1,
            'BW':'M',
            'name': '工作人偶(白)',
            'Effect_only':true,
            'descript':'創造一個假人替你賺錢。',
            'Effect':'<<set $DM.slave_w += 1>>',
            cost_function(n){return 1000 + 200 * n},
            'alche':true,
            'effect_describe':'人偶變成社畜的樣子，步伐沉重的離開了。'
        },        "slave_b":{
            'max':1,
            'BW':'M',
            'name': '工作人偶(黑)',
            'Effect_only':true,
            'descript':'創造一個假人替你賺錢。',
            'Effect':'<<set $DM.slave_b += 1>>',
            cost_function(n){return 1000 + 200 * n},
            'cost': 1000,
            'alche':true,
            'effect_describe':'人偶變成脫衣舞女的樣子，步伐沉重的離開了。'
        },
        //-------------------------------
        //戰鬥技能
        "Encourage_perk":{
            'max':5,
            'BW':'W',
            'name': '激勵',
            'descript':'能讓做愛對手更持久，效果隨技能增強。',
            'cost': 100,
            'spell':true,
            'spell_effect':'<<set $enemyarousalmax += 500 * $DM.Encourage_perk>>',
            'spell_end_effect':'',
            times_f(_){return 1}
        },
        "Endure_perk":{
            'max':5,
            'BW':'W',
            'name': '忍耐',
            'descript':'消除疼痛，降低快感，且戰鬥後不會暈倒。',
            'cost': 100,
            'spell':true,
            'spell_effect':'<<set $pain -= 50>><<set $arousal -= 3000>>',
            'spell_end_effect':'<<set $trauma -= 100>><<set $stress to Math.min($stressmax - 1000 , $stress)>>'
        },
        "pain":{
            'max':10,
            'BW':'B',
            'name': '痛苦',
            'descript':'能給敵人痛苦，等級越高越強烈。',
            'cost': 200,
            'spell':true,
            'spell_effect':'<<set _to_damag to 5 + 2 * $DM.pain>><<defiance _to_damag>>',
            'spell_end_effect':'',
            times_f(n){
                if (n <= 3){return n}
                return 3
            }
        },
        "fastgun":{
            'max':5,
            'BW':'B',
            'name': '早洩',
            'descript':'能讓做愛對手更快高潮，效果隨技能增強。',
            'cost': 200,
            'spell':true,
            'spell_effect':'<<set $enemyarousalmax to Math.ceil((0.8 - 0.05 * $DM.fastgun) * $enemyarousalmax)>>',
            'spell_end_effect':'',
            times_f(_){return 1}
        },
        "enlactate":{
            'max':1,
            'BW':'B',
            'name': '催乳',
            'descript':'能讓做愛對手分泌乳汁。',
            'cost': 200,
            'spell':true,
            'spell_effect':'<<set $NPCList[$mouthtarget].lactation to 1>>',
            'spell_end_effect':'',
            times_f(_){return 1},
            spell_condition_f(){
                return V.NPCList[V.mouthtarget] && V.NPCList[V.mouthtarget].gender === 'f'
            }
        },
        //-----------------------------
        "B_Master":{
            'max':100,
            'BW':'B',
            'name': '墮落之道',
            'descript':'你對墮落的鑽研',
            'cost': 500,
            'noswich':1,
            cost_function(n){return n*100 + 200}
        },
        "demon_tran":{
            'max':1,
            'BW':'M',
            'name': '增加惡魔化',
            'descript':'<br>現在惡魔化:<<print $demonbuild>>',
            'cost': 10,
            'Effect_only':true,
            'noswich':1,
            'Effect':"<<transform demon 1>>",
        },
        //枷鎖
        "shackles_arousal":{
            'max':5,
            'BW':'B',
            'name': '慾望枷鎖',
            'descript':'你的慾望下限會上升<<print $DM.shackles_arousal*1000>>，但法力的獲取會增加<<print $DM.shackles_arousal>>倍。',
            'cost': 0,
            'reducible' : true,
            'shackles':true
        },

        //身體操作
        "milk_gain":{
            'max':20,
            'BW':'B',
            'name': '豐壤',
            'descript':'增加母乳量。<br>現在母乳容量:<<print $milk_volume>><br>現在母乳容量最大值:<<print $milk_max>>',
            'cost': 50,
            'noswich':1,
            Effect_f(){
                V.milk_amount += 300
                V.milk_volume += 300
                
                if (V.cow >= 6){V.milk_max  = 6000 + 300 * V.DM.milk_gain}
                else{V.milk_max  = 3000 + 300 * V.DM.milk_gain}
            },
            'perk_require':'perk_body_control'
        },
        "breast_size_g":{
            'max':1,
            'BW':'M',
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
            'perk_require':'perk_body_control'
        },
        "breast_size_l":{
            'max':1,
            'BW':'M',
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
            'perk_require':'perk_body_control'
        },
        "bhair_size_g":{
            'max':1,
            'BW':'M',
            'name': '後髮增長',
            'descript':'增加後髮長度',
            'cost': 10,
            'noswich':1,
            'Effect_only':true,
            'body_control':1,
            Effect_f(){
                V.hairlength += 100;
                wikifier('<<clamp>>');
                wikifier('<<calchairlengthstage>>');
                wikifier('<<updatesidebarimg>>');
            },
            'perk_require':'perk_body_control'
        },
        "bhair_size_l":{
            'max':1,
            'BW':'M',
            'name': '後髮縮短',
            'descript':'減少後髮長度',
            'cost': 10,
            'noswich':1,
            'Effect_only':true,
            'body_control':1,
            Effect_f(){
                V.hairlength -= 100;
                wikifier('<<clamp>>');
                wikifier('<<calchairlengthstage>>');
                wikifier('<<updatesidebarimg>>');
            },
            'perk_require':'perk_body_control'
        },
        "fhair_size_g":{
            'max':1,
            'BW':'M',
            'name': '前髮增長',
            'descript':'增加前髮長度',
            'cost': 10,
            'noswich':1,
            'Effect_only':true,
            'body_control':1,
            Effect_f(){
                V.fringelength += 100;
                wikifier('<<clamp>>');
                wikifier('<<calchairlengthstage>>');
                wikifier('<<updatesidebarimg>>');
            },
            'perk_require':'perk_body_control'
        },
        "fhair_size_l":{
            'max':1,
            'BW':'M',
            'name': '前髮縮短',
            'descript':'減少前髮長度',
            'cost': 10,
            'noswich':1,
            'Effect_only':true,
            'body_control':1,
            Effect_f(){
                V.fringelength -= 100;
                wikifier('<<clamp>>');
                wikifier('<<calchairlengthstage>>');
                wikifier('<<updatesidebarimg>>');
            },
            'perk_require':'perk_body_control'
        },

        "milk_charge":{
            'max':1,
            'BW':'M',
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
            },
            'perk_require':'perk_body_control'
        },
        "milk_volume_charge":{
            'max':1,
            'BW':'M',
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
            'perk_require':'perk_body_control'
        },
        "parasite_grow":{
            'max':1,
            'BW':'M',
            'name': '苗床生長',
            'descript':'讓寄生蟲的孕育時間加速',
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
                                parasite.stats.speed = parasite.stats.speed < 0 ? 0:parasite.stats.speed
                            }
                        });
                    }
                }
                parasiteProgressDay();
	            parasiteProgressDay("vagina");
                parasiteProgressTime(900);
	            parasiteProgressTime(900, "vagina")
            },
            'perk_require':'perk_body_control'
        },
        //----------------------------
        
        
    },
    "WIP":{
        "remove_tatoo":{
            'max':1,
            'BW':'W',
            'name': '消除紋身',
            'descript':'用魔法消除紋身。',
            'cost': 200,
            'Effect_only':true,
            'noswich':1,
            'Effect':"<<set $DM.menutree to 'tatoo_remove'>>",
        }
    },
    Perk_Buy(perk_name){
        //前置
        if (this.Perks[perk_name].require_f    && !this.Perks[perk_name].require_f()){return ""}
        if (this.Perks[perk_name].perk_require && !V.DM.perk_switch[this.Perks[perk_name].perk_require]){return ""}

        let _text = "";
        //描述
        _text += (this.Perks[perk_name].name + ":" + this.Perks[perk_name].descript );
        if (this.Perks[perk_name].spell){_text += this.printtimes(perk_name)}
        //LV顯示
        let _ismax = false;
        if (!this.Perks[perk_name].Effect_only){
            let _level = V.DM[perk_name] === undefined ? 0 : V.DM[perk_name];
            _text += ('<br>Lv:' + _level);
            if (_level >= this.Perks[perk_name].max){
                    _ismax = true;
                    _text += ('(MAX)')
                }
        }
        //開關
        if (V.DM[perk_name] && this.Perks[perk_name].reducible){
            _text += this.Linkbuttun('降級','<<set $DM.'+ perk_name +' -= 1>>') + '|'
        }
        _text += this.perk_switch(perk_name);
        //使用
        if(!_ismax){
            let _typemap = {
                'W': V.DM.WhiteMagic_pt,
                'B': V.DM.BlackMagic_pt,
                'M': V.DM.Mana
            }
            if (_typemap[this.Perks[perk_name].BW] >= this.getcost(perk_name)){
                let buttum_name = ['B', 'W'].includes(this.Perks[perk_name].BW) ? '學習' : '施法'
                _text += this.Linkbuttun(buttum_name,'<<=setup.DM.levelup(\"'+ perk_name +'\")>>',this.Perks[perk_name].timepass)
            }
            else{
                _text += ('<span class="black">點數不足</span>')
            }
            if (V.DM[perk_name] !== this.Perks[perk_name].max){
                _text += this.printcost(perk_name)
            }
        }
        if(this.Perks[perk_name].endwith){
            _text += this.Perks[perk_name].endwith
        }
        _text += '<br><br>';
        return _text
    },
    List_Generator(pairs){
        let _text = ''
        for (let perk_name in this.Perks){
            if (pairs.every(([key, value]) => this.Perks[perk_name][key] === value))
                _text += this.Perk_Buy(perk_name)
        }
        return _text
    },
    describe(){
        let _text = ''
        if (V.DM.desctibe_perk){
            _text += this.Perks[V.DM.desctibe_perk].effect_describe
            V.DM.desctibe_perk = false
        }
        if (V.DM.desctibe_m){
            _text += V.DM.desctibe_m
            V.DM.desctibe_m = false
        }
        return _text
    },
    getcost(perk_name){
        if (this.Perks[perk_name].cost_function){
            return this.Perks[perk_name].cost_function(V.DM[perk_name])
        }
        return this.Perks[perk_name].cost
    },
    printcost(perk_name){
        let _text = ""
        let _color_dict = {
            'B':"<span class=\"purple\">",
            'W':"<span class=\"gold\">",
            'M':"<span class=\"blue\">",
            undefined:""
        }
         _text += _color_dict[this.Perks[perk_name].BW]
        _text +=  (-1 * this.getcost(perk_name));
        if (this.Perks[perk_name].BW) _text += '</span>';
        _text ='(' + _text + ')'
        return _text
    },
    printtimes(perk_name){
        let _use_limit = this.Perks[perk_name].times_f ? this.Perks[perk_name].times_f(V.DM[perk_name]) : V.DM[perk_name]
        return "可用"+ _use_limit +"次。"
    },
    levelup(perk_name){
        if (this.Perks[perk_name].BW === 'W'){
            V.DM.WhiteMagic_pt -= this.getcost(perk_name)
        }
        else if(this.Perks[perk_name].BW === 'B'){
            V.DM.BlackMagic_pt -= this.getcost(perk_name)
        }
        else if(this.Perks[perk_name].BW === 'M'){
            V.DM.Mana -= this.getcost(perk_name)
        }
        if(!this.Perks[perk_name].Effect_only){
            V.DM[perk_name] = V.DM[perk_name] === undefined ? 1 : V.DM[perk_name]+1
            V.DM.perk_switch[perk_name] = true}
        if(this.Perks[perk_name].effect_describe){
            V.DM.desctibe_perk = perk_name
        }
        if(this.Perks[perk_name].Effect ){return this.Perks[perk_name].Effect}
        if(this.Perks[perk_name].Effect_f){return '<<=setup.DM.Perks.'+perk_name+'.Effect_f()>>'}
    },
    perk_switch(perk_name){
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
            if (this.Perks[key].spell && V.DM.perk_switch[key]){
                _text += this.Perks[key].spell_end_effect;
                V.DM.spell_used[key] = 0
            }
        }
        return _text
    },
    mag_daily(){
        this.Goinit()
        V.DM.daily_M = 0
        V.DM.daily_M += (V.DM.W_Master * 10)
        V.DM.daily_M += (V.DM.B_Master * 10)

        V.DM.daily_w = 0
        V.DM.daily_b = 0
        V.DM.daily_purity     = Math.floor((V.purity-500)/100) * 20
        V.DM.daily_submissive = Math.floor((V.submissive-1000)/100) * 10
        V.DM.daily_masochism  = Math.floor(V.masochism/100) * 10
        V.DM.daily_sadism     = Math.floor(V.sadism/100) * -10
        V.DM.daily_trans      = V.angel >= 6 ? 50 : (V.demon >= 6 ? -50 : 0)
        for (let _dp of [
            V.DM.daily_purity , 
            V.DM.daily_submissive , 
            V.DM.daily_masochism ,
            V.DM.daily_sadism ,
            V.DM.daily_trans]){
                if (_dp >= 0){
                    V.DM.daily_w += _dp
                }else{
                    V.DM.daily_b += _dp
                }
            }
        V.DM.daily_w *= (1 + V.DM.W_Master*0.1)
        V.DM.daily_b *= (1 + V.DM.B_Master*0.1)
        V.DM.daily_w = Math.round(V.DM.daily_w)
        V.DM.daily_b = Math.round(V.DM.daily_b)
        let _modifier = 1
        _modifier += (V.DM.shackles_willpower + 1)
        _modifier += (V.DM.shackles_arousal + 1)
        V.DM.daily_b *= _modifier
        V.DM.daily_w *= _modifier
        
    },
    willpower_modifier(){
        let _modifier = 1
        _modifier = V.DM.shackles_willpower ? 0.9 : 1
        _modifier -= V.DM.shackles_willpower_2 ? 0.1 : 0
        return _modifier
    },
    mag_daily_get(n){
        this.mag_daily()
        if (n === 'b' || n === 'a') V.DM.BlackMagic_pt -= V.DM.daily_b
        if (n === 'w' || n === 'a') V.DM.WhiteMagic_pt += V.DM.daily_w
        V.DM.Mana += V.DM.daily_M
        if (V.DM.Mana > V.DM.Mana_max) V.DM.Mana = V.DM.Mana_max
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
        V.money += 30000 * (V.DM.slave_b + V.DM.slave_w)
        V.DM.effect_message_weekly = true
    },
    effect_message(){
        let _text = "";
        if (V.DM && V.DM.effect_message_weekly){
            if (V.DM.slave_b + V.DM.slave_w > 0){
                _text += '你的人偶為你帶來了 £<<print 300 * ($DM.slave_b + $DM.slave_w)>>。'
            }
            V.DM.effect_message_weekly = false
        }
        if (V.DM.magic_learn_message){
            _text += V.DM.magic_learn_message
            V.DM.magic_learn_message = false
        }

        
        return _text
    }
}