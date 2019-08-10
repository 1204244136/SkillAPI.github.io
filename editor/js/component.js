var hoverSpace;

var DAMAGE_TYPES = [ 'Block Explosion', 'Contact', 'Cramming', 'Dragon Breath', 'Drowning', 'Entity Attack', 'Entity Explosion', 'Fall', 'Falling Block', 'Fire', 'Fire Tick', 'Fly Into Wall', 'Hot Floor', 'Lava', 'Lightning', 'Magic', 'Melting', 'Poison', 'Projectile', 'Starvation', 'Suffocation', 'Suicide', 'Thorns', 'Void', 'Wither' ];

function canDrop(thing, target) {
    if (thing == target) return false;

    var temp = target;
    while (temp.parentNode) {
        temp = temp.parentNode;
        if (temp == thing) return false;
    }
    return true;
}

/**
 * Types of components
 */
var Type = {
    TRIGGER   : 'trigger',
    TARGET    : 'target',
    CONDITION : 'condition',
    MECHANIC  : 'mechanic'
};

/**
 * Available triggers for activating skill effects
 */
var Trigger = {
    BLOCK_BREAK          : { name: '方块破坏',          container: true, construct: TriggerBlockBreak,        premium: true },
    BLOCK_PLACE          : { name: '方块放置',          container: true, construct: TriggerBlockPlace,        premium: true },
    CAST                 : { name: '主动释放',                 container: true, construct: TriggerCast               },
    CLEANUP              : { name: '技能清除',              container: true, construct: TriggerCleanup            },
    CROUCH               : { name: '下蹲',               container: true, construct: TriggerCrouch             },
    DEATH                : { name: '死亡',                container: true, construct: TriggerDeath              },
    ENVIRONMENT_DAMAGE   : { name: '环境伤害',   container: true, construct: TriggerEnvironmentDamage, premium: true },
    INITIALIZE           : { name: '复活',           container: true, construct: TriggerInitialize         },
    KILL                 : { name: '击杀',                 container: true, construct: TriggerKill               },
    LAND                 : { name: '落地',                 container: true, construct: TriggerLand               },
    LAUNCH               : { name: '射击',               container: true, construct: TriggerLaunch             },
    MOVE                 : { name: '移动',                 container: true, construct: TriggerMove,              premium: true },
    PHYSICAL_DAMAGE      : { name: '造成物理伤害',      container: true, construct: TriggerPhysicalDamage     },
    SKILL_DAMAGE         : { name: '造成技能伤害',         container: true, construct: TriggerSkillDamage        },
    TOOK_PHYSICAL_DAMAGE : { name: '受到到物理伤害', container: true, construct: TriggerTookPhysicalDamage },
    TOOK_SKILL_DAMAGE    : { name: '受到技能伤害',    container: true, construct: TriggerTookSkillDamage    }
};

/**
 * Available target component data
 */
var Target = {
    AREA     : { name: '半径',     container: true, construct: TargetArea     },
    CONE     : { name: '圆锥',     container: true, construct: TargetCone     },
    LINEAR   : { name: '直线',   container: true, construct: TargetLinear   },
    LOCATION : { name: '坐标', container: true, construct: TargetLocation },
    NEAREST  : { name: '最近',  container: true, construct: TargetNearest  },
    OFFSET   : { name: '偏移',   container: true, construct: TargetOffset   },
    REMEMBER : { name: '标记', container: true, construct: TargetRemember },
    SELF     : { name: '自身',     container: true, construct: TargetSelf     },
    SINGLE   : { name: '个体',   container: true, construct: TargetSingle   }
};

/**
 * Available condition component data
 */
var Condition = {
    ARMOR:       { name: '护甲',       container: true, construct: ConditionArmor      },
    ATTRIBUTE:   { name: '属性',   container: true, construct: ConditionAttribute  },
    BIOME:       { name: 'Biome',       container: true, construct: ConditionBiome      },
    BLOCK:       { name: 'Block',       container: true, construct: ConditionBlock      },
    CEILING:     { name: 'Ceiling',     container: true, construct: ConditionCeiling,   premium: true },
    CHANCE:      { name: 'Chance',      container: true, construct: ConditionChance     },
    CLASS:       { name: 'Class',       container: true, construct: ConditionClass      },
    CLASS_LEVEL: { name: 'Class Level', container: true, construct: ConditionClassLevel },
    COMBAT:      { name: 'Combat',      container: true, construct: ConditionCombat     },
    CROUCH:      { name: 'Crouch',      container: true, construct: ConditionCrouch     },
    DIRECTION:   { name: 'Direction',   container: true, construct: ConditionDirection  },
    ELEVATION:   { name: 'Elevation',   container: true, construct: ConditionElevation  },
    ELSE:        { name: 'Else',        container: true, construct: ConditionElse,      premium: true },
    ENTITY_TYPE: { name: 'Entity Type', container: true, construct: ConditionEntityType,premium: true },
    FIRE:        { name: 'Fire',        container: true, construct: ConditionFire       },
    FLAG:        { name: 'Flag',        container: true, construct: ConditionFlag       },
    GROUND:      { name: 'Ground',      container: true, construct: ConditionGround,    premium: true },
    HEALTH:      { name: 'Health',      container: true, construct: ConditionHealth     },
    INVENTORY:   { name: 'Inventory',   container: true, construct: ConditionInventory  },
    ITEM:        { name: 'Item',        container: true, construct: ConditionItem       },
    LIGHT:       { name: 'Light',       container: true, construct: ConditionLight      },
    MANA:        { name: 'Mana',        container: true, construct: ConditionMana       },
    NAME:        { name: 'Name',        container: true, construct: ConditionName       },
    OFFHAND:     { name: 'Offhand',     container: true, construct: ConditionOffhand    },
    PERMISSION:  { name: 'Permission',  container: true, construct: ConditionPermission,premium: true },
    POTION:      { name: 'Potion',      container: true, construct: ConditionPotion     },
    SKILL_LEVEL: { name: 'Skill Level', container: true, construct: ConditionSkillLevel },
    SLOT:        { name: 'Slot',        container: true, construct: ConditionSlot,      premium: true },
    STATUS:      { name: 'Status',      container: true, construct: ConditionStatus     },
    TIME:        { name: 'Time',        container: true, construct: ConditionTime       },
    TOOL:        { name: 'Tool',        container: true, construct: ConditionTool       },
    VALUE:       { name: 'Value',       container: true, construct: ConditionValue      },
    WATER:       { name: 'Water',       container: true, construct: ConditionWater      },
    WEATHER:     { name: 'Weather',     container: true, construct: ConditionWeather,   premium: true }
};

/**
 * Available mechanic component data
 */
var Mechanic = {
    ATTRIBUTE:           { name: 'Attribute',           container: false, construct: MechanicAttribute          },
    BLOCK:               { name: 'Block',               container: false, construct: MechanicBlock              },
    BUFF:                { name: 'Buff',                container: false, construct: MechanicBuff,              premium: true },
    CANCEL:              { name: 'Cancel',              container: false, construct: MechanicCancel             },
    CHANNEL:             { name: 'Channel',             container: true,  construct: MechanicChannel            },
    CLEANSE:             { name: 'Cleanse',             container: false, construct: MechanicCleanse            },
    COMMAND:             { name: 'Command',             container: false, construct: MechanicCommand            },
    COOLDOWN:            { name: 'Cooldown',            container: false, construct: MechanicCooldown           },
    DAMAGE:              { name: 'Damage',              container: false, construct: MechanicDamage             },
    DAMAGE_BUFF:         { name: 'Damage Buff',         container: false, construct: MechanicDamageBuff         },
    DAMAGE_LORE:         { name: 'Damage Lore',         container: false, construct: MechanicDamageLore         },
    DEFENSE_BUFF:        { name: 'Defense Buff',        container: false, construct: MechanicDefenseBuff        },
    DELAY:               { name: 'Delay',               container: true,  construct: MechanicDelay              },
    DISGUISE:            { name: 'Disguise',            container: false, construct: MechanicDisguise           },
    DURABILITY:          { name: 'Durability',          container: false, construct: MechanicDurability,        premium: true },
    EXPLOSION:           { name: 'Explosion',           container: false, construct: MechanicExplosion          },
    FIRE:                { name: 'Fire',                container: false, construct: MechanicFire               },
    FLAG:                { name: 'Flag',                container: false, construct: MechanicFlag               },
    FLAG_CLEAR:          { name: 'Flag Clear',          container: false, construct: MechanicFlagClear          },
    FLAG_TOGGLE:         { name: 'Flag Toggle',         container: false, construct: MechanicFlagToggle         },
    FOOD:                { name: 'Food',                container: false, construct: MechanicFood,              premium: true },
    FORGET_TARGETS:      { name: 'Forget Targets',      container: false, construct: MechanicForgetTargets,     premium: true },
    HEAL:                { name: 'Heal',                container: false, construct: MechanicHeal               },
    HEALTH_SET:          { name: 'Health Set',          container: false, construct: MechanicHealthSet,         premium: true },
    HELD_ITEM:           { name: 'Held Item',           container: false, construct: MechanicHeldItem,          premium: true },
    IMMUNITY:            { name: 'Immunity',            container: false, construct: MechanicImmunity           },
    INTERRUPT:           { name: 'Interrupt',           container: false, construct: MechanicInterrupt          },
    ITEM:                { name: 'Item',                container: false, construct: MechanicItem               },
    ITEM_PROJECTILE:     { name: 'Item Projectile',     container: true,  construct: MechanicItemProjectile     },
    ITEM_REMOVE:         { name: 'Item Remove',         container: false, construct: MechanicItemRemove         },
    LAUNCH:              { name: 'Launch',              container: false, construct: MechanicLaunch             },
    LIGHTNING:           { name: 'Lightning',           container: false, construct: MechanicLightning          },
    MANA:                { name: 'Mana',                container: false, construct: MechanicMana               },
    MESSAGE:             { name: 'Message',             container: false, construct: MechanicMessage            },
    PARTICLE:            { name: 'Particle',            container: false, construct: MechanicParticle           },
    PARTICLE_ANIMATION:  { name: 'Particle Animation',  container: false, construct: MechanicParticleAnimation  },
    PARTICLE_EFFECT:     { name: 'Particle Effect',     container: false, construct: MechanicParticleEffect,    premium: true },
    CANCEL_EFFECT:       { name: 'Cancel Effect',       container: false, construct: MechanicCancelEffect,      premium: true },
    PARTICLE_PROJECTILE: { name: 'Particle Projectile', container: true,  construct: MechanicParticleProjectile },
    PASSIVE:             { name: 'Passive',             container: true,  construct: MechanicPassive            },
    PERMISSION:          { name: 'Permission',          container: false, construct: MechanicPermission         },
    POTION:              { name: 'Potion',              container: false, construct: MechanicPotion             },
    POTION_PROJECTILE:   { name: 'Potion Projectile',   container: true,  construct: MechanicPotionProjectile   },
    PROJECTILE:          { name: 'Projectile',          container: true,  construct: MechanicProjectile         },
    PURGE:               { name: 'Purge',               container: false, construct: MechanicPurge              },
    PUSH:                { name: 'Push',                container: false, construct: MechanicPush               },
    REMEMBER_TARGETS:    { name: 'Remember Targets',    container: false, construct: MechanicRememberTargets    },
    REPEAT:              { name: 'Repeat',              container: true,  construct: MechanicRepeat             },
    SOUND:               { name: 'Sound',               container: false, construct: MechanicSound              },
    SPEED:               { name: 'Speed',               container: false, construct: MechanicSpeed              },
    STATUS:              { name: 'Status',              container: false, construct: MechanicStatus             },
    TAUNT:               { name: 'Taunt',               container: false, construct: MechanicTaunt              },
    TRIGGER:             { name: 'Trigger',             container: true,  construct: MechanicTrigger,           premium: true },
    VALUE_ADD:           { name: 'Value Add',           container: false, construct: MechanicValueAdd           },
    VALUE_ATTRIBUTE:     { name: 'Value Attribute',     container: false, construct: MechanicValueAttribute     },
    VALUE_COPY:          { name: 'Value Copy',          container: false, construct: MechanicValueCopy,         premium: true },
    VALUE_DISTANCE:      { name: 'Value Distance',      container: false, construct: MechanicValueDistance,     premium: true },
    VALUE_HEALTH:        { name: 'Value Health',        container: false, construct: MechanicValueHealth,       premium: true },
    VALUE_LOCATION:      { name: 'Value Location',      container: false, construct: MechanicValueLocation      },
    VALUE_LORE:          { name: 'Value Lore',          container: false, construct: MechanicValueLore          },
    VALUE_LORE_SLOT:     { name: 'Value Lore Slot',     container: false, construct: MechanicValueLoreSlot,     premium: true},
    VALUE_MANA:          { name: 'Value Mana',          container: false, construct: MechanicValueMana,         premium: true },
    VALUE_MULTIPLY:      { name: 'Value Multiply',      container: false, construct: MechanicValueMultiply      },
    VALUE_PLACEHOLDER:   { name: 'Value Placeholder',   container: false, construct: MechanicValuePlaceholder,  premium: true },
    VALUE_RANDOM:        { name: 'Value Random',        container: false, construct: MechanicValueRandom        },
    VALUE_SET:           { name: 'Value Set',           container: false, construct: MechanicValueSet           },
    WARP:                { name: 'Warp',                container: false, construct: MechanicWarp               },
    WARP_LOC:            { name: 'Warp Location',       container: false, construct: MechanicWarpLoc            },
    WARP_RANDOM:         { name: 'Warp Random',         container: false, construct: MechanicWarpRandom         },
    WARP_SWAP:           { name: 'Warp Swap',           container: false, construct: MechanicWarpSwap           },
    WARP_TARGET:         { name: 'Warp Target',         container: false, construct: MechanicWarpTarget         },
    WARP_VALUE:          { name: 'Warp Value',          container: false, construct: MechanicWarpValue          },
    WOLF:                { name: 'Wolf',                container: true,  construct: MechanicWolf               }
};

var saveIndex;

/**
 * Represents a component of a dynamic skill
 *
 * @param {string}    name      - name of the component
 * @param {string}    type      - type of the component
 * @param {boolean}   container - whether or not the component can contain others
 * @param {Component} [parent]  - parent of the component if any
 *
 * @constructor
 */
function Component(name, type, container, parent)
{
    this.name = name;
    this.type = type;
    this.container = container;
    this.parent = parent;
    this.html = undefined;
    this.components = [];
    this.data = [new StringValue('数值变量', 'icon-key', '').setTooltip('在技能图标Lore中添加上"{attr:"该行的内容"."注释里中括号内的英文"},显示为被注释目标的值.例如：先请移步至“范围”，在该栏填上“example”,则{attr:example.radius}=半径数值')];
    if (this.type == Type.MECHANIC) {
        this.data.push(new ListValue('Counts as Cast', 'counts', [ 'True', 'False' ], 'True')
            .setTooltip('Whether or not this mechanic running treats the skill as "casted" and will consume mana and start the cooldown. Set to false if it is a mechanic appled when the skill fails such as cleanup or an error message.')
        );
    }
    else if (this.type == Type.TRIGGER && name != 'Cast' && name != 'Initialize' && name != 'Cleanup')
    {
        this.data.push(new ListValue('需要法力值', 'mana', [ 'True', 'False' ], 'False')
            .setTooltip('触发该条件是否需要消耗法力值 False为不需要')
        );
        this.data.push(new ListValue('冷却时间归零激活', 'cooldown', [ 'True', 'False' ], 'False')
            .setTooltip('触发该条件是否需要等冷却时间归零')
        );
    }

    this.dataKey = 'data';
    this.componentKey = 'children';
}

Component.prototype.dupe = function(parent)
{
    var i;
    var ele = new Component(this.name, this.type, this.container, parent);
    for (i = 0; i < this.components.length; i++)
    {
        ele.components.push(this.components[i].dupe(ele));
    }
    ele.data = ele.data.slice(0, 1);
    for (i = ele.data.length; i < this.data.length; i++)
    {
        ele.data.push(copyRequirements(this.data[i], this.data[i].dupe()));
    }
    ele.description = this.description;
    return ele;
};

/**
 * Creates the builder HTML element for the component and
 * appends it onto the target HTML element.
 *
 * @param {Element} target - the HTML element to append the result to
 */
Component.prototype.createBuilderHTML = function(target)
{
    // Create the wrapping divs with the appropriate classes
    var container = document.createElement('div');
    container.comp = this;
    if (this.type == Type.TRIGGER) {
        container.className = 'componentWrapper';
    }

    var div = document.createElement('div');
    div.className = 'component ' + this.type;
    if (this.type != Type.TRIGGER) {
        div.draggable = true;
        div.ondragstart = this.drag;
    }
    div.ondrop = this.drop;
    if (this.container) {
        div.ondragover = this.allowDrop;
    }

    // Component label
    var label = document.createElement('h3');
    label.title = '编辑 ' + this.name + ' 信息';
    label.className = this.type + 'Label';
    label.innerHTML = this.name;
    label.component = this;
    label.addEventListener('click', function(e) {
        this.component.createFormHTML();
        showSkillPage('skillForm');
    });
    div.appendChild(label);

    // Container components can add children so they get a button
    if (this.container)
    {
        var add = document.createElement('div');
        add.className = 'builderButton';
        add.innerHTML = '+ 添加内容';
        add.component = this;
        add.addEventListener('click', function(e) {
            activeComponent = this.component;
            showSkillPage('componentChooser');
        });
        div.appendChild(add);

        var vision = document.createElement('div');
        vision.title = '隐藏内容';
        vision.className = 'builderButton smallButton';
        vision.style.background = 'url("editor/img/eye.png") no-repeat center #222';
        vision.component = this;
        vision.addEventListener('click', function(e) {
            var comp = this.component;
            if (comp.childrenHidden)
            {
                comp.childDiv.style.display = 'block';
                this.style.backgroundImage = 'url("editor/img/eye.png")';
            }
            else
            {
                comp.childDiv.style.display = 'none';
                this.style.backgroundImage = 'url("editor/img/eyeShaded.png")';
            }
            comp.childrenHidden = !comp.childrenHidden;
        });
        div.appendChild(vision);
        this.childrenHidden = false;
    }

    // Add the duplicate button
    if (this.type != Type.TRIGGER)
    {
        var duplicate = document.createElement('div');
        duplicate.className = 'builderButton smallButton';
        duplicate.title = '复制';
        duplicate.style.background = 'url("editor/img/duplicate.png") no-repeat center #222';
        duplicate.component = this;
        duplicate.addEventListener('click', function(e) {
            var comp = this.component;
            var copy = comp.dupe(comp.parent);
            comp.parent.components.push(copy);
            copy.createBuilderHTML(comp.parent.html);
        });
        div.appendChild(duplicate);
    }

    // Add the remove button
    var remove = document.createElement('div');
    remove.title = '删除';
    remove.className = 'builderButton smallButton cancelButton';
    remove.style.background = 'url("editor/img/delete.png") no-repeat center #f00';
    remove.component = this;
    remove.addEventListener('click', function(e) {
        var list = this.component.parent.components;
        for (var i = 0; i < list.length; i++)
        {
            if (list[i] == this.component)
            {
                list.splice(i, 1);
                break;
            }
        }
        this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
    });
    div.appendChild(remove);

    container.appendChild(div);

    // Apply child components
    var childContainer = document.createElement('div');
    childContainer.className = 'componentChildren';
    if (this.components.length > 0) {
        for (var i = 0; i < this.components.length; i++)
        {
            this.components[i].createBuilderHTML(childContainer);
        }
    }
    container.appendChild(childContainer);
    this.childDiv = childContainer;

    // Append the content
    target.appendChild(container);

    this.html = childContainer;
};

Component.prototype.allowDrop = function(e) {
    e.preventDefault();
    if (hoverSpace) {
        hoverSpace.style.marginBottom = '0px';
        hoverSpace.onmouseout = undefined;
    }
    hoverSpace = e.target;
    while (hoverSpace.className.indexOf('component') < 0) {
        hoverSpace = hoverSpace.parentNode;
    }
    var thing = document.getElementById('dragComponent');
    if (hoverSpace.id != 'dragComponent' && hoverSpace.parentNode.comp.container && canDrop(thing, hoverSpace)) {
        hoverSpace.style.marginBottom = '30px';
        hoverSpace.onmouseout = function() {
            if (!hoverSpace) {
                this.onmouseout = undefined;
                return;
            }
            hoverSpace.style.marginBottom = '0px';
            hoverSpace.onmouseout = undefined;
            hoverSpace = undefined;
        }
    }
    else hoverSpace = undefined;
};

Component.prototype.drag = function(e) {
    e.dataTransfer.setData('text', 'anything');
    var dragged = document.getElementById('dragComponent');
    if (dragged) {
        dragged.id = '';
    }
    e.target.id = 'dragComponent';
};

Component.prototype.drop = function(e) {
    if (hoverSpace) {
        hoverSpace.style.marginBottom = '0px';
        hoverSpace = undefined;
    }

    e.preventDefault();
    var thing = document.getElementById('dragComponent').parentNode;
    var target = e.target;
    while (target.className.indexOf('component') < 0) {
        target = target.parentNode;
    }
    if (target.id == 'dragComponent' || !target.parentNode.comp.container || !canDrop(thing, target)) {
        return;
    }
    var targetComp = target.parentNode.comp;
    var thingComp = thing.comp;
    target = target.parentNode.childNodes[1];
    thing.parentNode.removeChild(thing);
    target.appendChild(thing);

    thingComp.parent.components.splice(thingComp.parent.components.indexOf(thingComp), 1);
    thingComp.parent = targetComp;
    thingComp.parent.components.push(thingComp);
};

/**
 * Creates the form HTML for editing the component data and
 * applies it to the appropriate part of the page.
 */
Component.prototype.createFormHTML = function()
{
    var target = document.getElementById('skillForm');

    var form = document.createElement('form');

    var header = document.createElement('h4');
    header.innerHTML = this.name;
    form.appendChild(header);

    if (this.description)
    {
        var desc = document.createElement('p');
        desc.innerHTML = this.description;
        form.appendChild(desc);
    }

    if (this.data.length > 1)
    {
        var h = document.createElement('hr');
        form.appendChild(h);

        var i = 1;
        for (var j = 1; j < this.data.length; j++) {
            if (this.data[j] instanceof AttributeValue) {
                i = 0;
                break;
            }
        }
        for (; i < this.data.length; i++)
        {
            this.data[i].hidden = false;
            this.data[i].createHTML(form);
        }
    }

    var hr = document.createElement('hr');
    form.appendChild(hr);

    var done = document.createElement('h5');
    done.className = 'doneButton';
    done.innerHTML = 'Done';
    done.component = this;
    done.addEventListener('click', function(e) {
        this.component.update();
        document.getElementById('skillForm').removeChild(this.component.form);
        showSkillPage('builder');
    });
    form.appendChild(done);

    this.form = form;

    target.innerHTML = '';
    target.appendChild(form);
    activeComponent = this;

    for (var i = 0; i < this.data.length; i++)
    {
        this.data[i].applyRequireValues();
    }
}

/**
 * Updates the component using the form data if it exists
 */
Component.prototype.update = function()
{
    for (var j = 0; j < this.data.length; j++)
    {
        this.data[j].update();
    }
};

/**
 * Gets the save string for the component
 *
 * @param {string} spacing - spacing to put before the data
 */
Component.prototype.getSaveString = function(spacing)
{
    this.createFormHTML();

    var id = '';
    var index = saveIndex;
    while (index > 0 || id.length == 0)
    {
        id += String.fromCharCode((index % 26) + 97);
        index = Math.floor(index / 26);
    }
    var result = spacing + this.name + '-' + id + ":\n";
    saveIndex++;

    result += spacing + "  type: '" + this.type + "'\n";
    if (this.data.length > 0)
    {
        result += spacing + '  data:\n';
        for (var i = 0; i < this.data.length; i++)
        {
            if (!this.data[i].hidden)
                result += this.data[i].getSaveString(spacing + '    ');
        }
    }
    if (this.components.length > 0)
    {
        result += spacing + '  children:\n';
        for (var j = 0; j < this.components.length; j++)
        {
            result += this.components[j].getSaveString(spacing + '    ');
        }
    }
    return result;
};

/**
 * Loads component data from the config lines stating at the given index
 *
 * @param {YAMLObject} data - the data to load
 *
 * @returns {Number} the index of the last line of data for this component
 */
Component.prototype.load = loadSection;

// -- Custom constructor ------------------------------------------------------- //

extend('CustomComponent', 'Component');
function CustomComponent(data) {
    this.super(data.display, data.type.toLowerCase(), data.container);
    this.description = data.description;

    for (var i = 0; i < data.options.length; i++) {
        var option = data.options[i];
        switch (option.type) {
            case 'NUMBER':
                this.data.push(new AttributeValue(option.display, option.key, option.base, option.scale)
                    .setTooltip(option.description)
                );
                break;
            case 'TEXT':
                this.data.push(new StringValue(option.display, option.key, option.default)
                    .setTooltip(option.description)
                );
                break;
            case 'DROPDOWN':
                this.data.push(new ListValue(option.display, option.key, option.options, option.options[0])
                    .setTooltip(option.description)
                );
                break;
            case 'LIST':
                this.data.push(new MultiListValue(option.display, option.key, option.options, [ ])
                    .setTooltip(option.description)
                );
                break;
            default:
                throw new Error("Invalid component with key " + data.key);
        }
    }
}

// -- Trigger constructors ----------------------------------------------------- //

extend('TriggerBlockBreak', 'Component');
function TriggerBlockBreak() {
    this.super('方块破坏', Type.TRIGGER, true);
    this.description = '当玩家破坏指定信息的方块时触发技能';

    this.data.push(new MultiListValue('方块类型', 'material', getAnyMaterials, [ 'Any' ])
        .setTooltip('The type of block expected to be broken')
    );
    this.data.push(new IntValue('数量', 'data', -1)
        .setTooltip('需要破坏的方块数量(-1为破坏多少都可以)')
    );
}

extend('TriggerBlockPlace', 'Component');
function TriggerBlockPlace() {
    this.super('方块放置', Type.TRIGGER, true);
    this.description = '当玩家放置指定信息的方块时触发技能';

    this.data.push(new MultiListValue('方块类型', 'material', getAnyMaterials, [ 'Any' ])
        .setTooltip('The type of block expected to be placed')
    );
    this.data.push(new IntValue('数量', 'data', -1)
        .setTooltip('需要放置的方块数量(-1为放置多少都可以)')
    );
}

extend('TriggerCast', 'Component');
function TriggerCast()
{
    this.super('主动释放', Type.TRIGGER, true);

    this.description = '使用技能栏/组合键/指令来触发技能';
}

extend('TriggerCleanup', 'Component');
function TriggerCleanup()
{
    this.super('技能清除', Type.TRIGGER, true);

    this.description = '当玩家遗忘或删除技能时触发,通常用于限定技';
}

extend('TriggerCrouch', 'Component');
function TriggerCrouch()
{
    this.super('下蹲', Type.TRIGGER, true);

    this.description = '当玩家按下或松开下蹲键(shift)触发技能';

    this.data.push(new ListValue('类型', 'type', [ 'Start Crouching', 'Stop Crouching', 'Both' ], 'Start Crouching')
        .setTooltip('分别为 按下/松开/两者')
    );
}

extend('TriggerDeath', 'Component');
function TriggerDeath()
{
    this.super('死亡', Type.TRIGGER, true);

    this.description = '玩家死亡时触发技能';
}

extend('TriggerEnvironmentDamage', 'Component');
function TriggerEnvironmentDamage()
{
    this.super('环境伤害', Type.TRIGGER, true);

    this.description = '当玩家受到环境伤害时触发技能';

    this.data.push(new ListValue('种类', 'type', DAMAGE_TYPES, 'FALL')
        .setTooltip('伤害的种类')
    );
}


extend('TriggerInitialize', 'Component');
function TriggerInitialize()
{
    this.super('复活', Type.TRIGGER, true);

    this.description = '玩家复活时触发技能,可以用来做被动技能';
}

extend('TriggerKill', 'Component');
function TriggerKill()
{
    this.super('击杀', Type.TRIGGER, true);

    this.description = '击杀实体时触发技能';
}

extend('TriggerLand', 'Component');
function TriggerLand()
{
    this.super('落地', Type.TRIGGER, true);

    this.description = '玩家落地时触发技能';

    this.data.push(new DoubleValue('最小距离', 'min-distance', 0)
        .setTooltip('距离地面的最小距离')
    );
}

extend('TriggerLaunch', 'Component');
function TriggerLaunch()
{
    this.super('射击', Type.TRIGGER, true);

    this.description = '玩家射击/投掷某物时触发技能';

    this.data.push(new ListValue('类型', 'type', [ 'Any', 'Arrow', 'Egg', 'Ender Pearl', 'Fireball', 'Fishing Hook', 'Snowball' ], 'Any')
        .setTooltip('分别为 任何东西 弓箭 蛋 暗影珍珠 火球 鱼钩 雪球')
    );
}

extend('TriggerMove', 'Component');
function TriggerMove()
{
    this.super('移动', Type.TRIGGER, true);

    this.description = '玩家移动时发动.这会占用大量资源,尽量少用.使用 "api-moved" 去查看/调用移动距离';
}

extend('TriggerPhysicalDamage', 'Component');
function TriggerPhysicalDamage()
{
    this.super('物理伤害', Type.TRIGGER, true);

    this.description = '当玩家造成物理伤害(即非技能伤害)时触发.包括近战攻击和火焰伤害';

    this.data.push(new ListValue('目标指向', 'target', [ 'True', 'False' ], 'True')
        .setTooltip('True 使目标指向玩家. False 使目标指向受到伤害的实体')
    );
    this.data.push(new ListValue('类型', 'type', [ 'Both', 'Melee', 'Projectile' ], 'Both')
        .setTooltip('分别为 两者 近战 远程')
    );
    this.data.push(new DoubleValue("最小伤害", "dmg-min", 0)
        .setTooltip('当造成的伤害大于最小伤害就触发技能')
    );
    this.data.push(new DoubleValue("最大伤害", "dmg-max", 999)
        .setTooltip('当造成的伤害大于最大伤害就取消技能,两者配合以确定一个伤害区间')
    );
}

extend('TriggerSkillDamage', 'Component');
function TriggerSkillDamage()
{
    this.super('技能伤害', Type.TRIGGER, true);

    this.description = '当玩家造成技能伤害时触发';

    this.data.push(new ListValue('目标指向', 'target', [ 'True', 'False' ], 'True')
        .setTooltip('True 使目标指向玩家. False 使目标指向受到伤害的实体')
    );
    this.data.push(new DoubleValue("最小伤害", "dmg-min", 0)
        .setTooltip('当造成的伤害大于最小伤害就触发技能')
    );
    this.data.push(new DoubleValue("最大伤害", "dmg-max", 999)
        .setTooltip('当造成的伤害大于最大伤害就取消技能,两者配合以确定一个伤害区间')
    );
    this.data.push(new StringListValue('类型', 'category', [ 'default' ] )
        .setTooltip('技能伤害的类型,不填以应用于所有技能伤害')
    );
}

extend('TriggerTookPhysicalDamage', 'Component');
function TriggerTookPhysicalDamage()
{
    this.super('受到物理伤害', Type.TRIGGER, true);

    this.description = '当玩家受到物理伤害(即非技能伤害)时触发.包括近战攻击和火焰伤害';

    this.data.push(new ListValue('目标指向', 'target', [ 'True', 'False' ], 'True')
        .setTooltip('True 使目标指向玩家. False 使目标指向攻击者')
    );
    this.data.push(new ListValue('类型', 'type', [ 'Both', 'Melee', 'Projectile' ], 'Both')
        .setTooltip('分别为 两者 近战 远程')
    );
    this.data.push(new DoubleValue("最小伤害", "dmg-min", 0)
        .setTooltip('当受到的伤害大于最小伤害就触发技能')
    );
    this.data.push(new DoubleValue("最大伤害", "dmg-max", 999)
        .setTooltip('当受到的伤害大于最大伤害就取消技能,两者配合以确定一个伤害区间')
    );
}

extend('TriggerTookSkillDamage', 'Component');
function TriggerTookSkillDamage()
{
    this.super('受到技能伤害', Type.TRIGGER, true);

    this.description = '当玩家受到技能伤害时触发，包括对自己的伤害';

    this.data.push(new ListValue('目标指向', 'target', [ 'True', 'False' ], 'True')
        .setTooltip('True 使目标指向玩家. False 使目标指向攻击者')
    );
    this.data.push(new DoubleValue("最小伤害", "dmg-min", 0)
        .setTooltip('当受到的伤害大于最小伤害就触发技能')
    );
    this.data.push(new DoubleValue("最大伤害", "dmg-max", 999)
        .setTooltip('当受到的伤害大于最大伤害就取消技能,两者配合以确定一个伤害区间')
    );
    this.data.push(new StringListValue('类型', 'category', [ 'default' ] )
        .setTooltip('技能伤害的类型,不填以应用于所有技能伤害')
    );
}

// -- Target constructors ------------------------------------------------------ //

extend('TargetArea', 'Component');
function TargetArea()
{
    this.super('范围', Type.TARGET, true);

    this.description = '将目标指向一定半径内的所有实体';

    this.data.push(new AttributeValue("半径", "radius", 3, 0)
        .setTooltip('范围的半径,单位为方块')
    );
    this.data.push(new ListValue("群组", "group", ["Ally", "Enemy", "Both"], "Enemy")
        .setTooltip('攻击范围内的实体群组 分别为：盟友 敌人 两者')
    );
    this.data.push(new ListValue("穿墙", "wall", ['True', 'False'], 'False')
        .setTooltip('是否允许技能穿过墙壁寻找目标 False为不允许')
    );
    this.data.push(new ListValue("包括施法者", "caster", [ 'True', 'False' ], 'False')
        .setTooltip('目标是否包括施法者 False为不包括')
    );
    this.data.push(new AttributeValue("最大目标", "max", 99, 0)
        .setTooltip('目标数量的最大值,超出部分无效,如果目标包括施法者,施法者也计入')
    );
    this.data.push(new ListValue("随机", "random", [ 'True', 'False' ], 'False')
        .setTooltip('是否随机选取目标 False为不随机')
    );
}

extend('TargetCone', 'Component');
function TargetCone()
{
    this.super('圆锥', Type.TARGET, true);

    this.description = '将目标指向施法者前面的一行中的所有生物(圆锥形).';

    this.data.push(new AttributeValue("距离", "range", 5, 0)
        .setTooltip('最大距离,单位为方块')
    );
    this.data.push(new AttributeValue("角度", "angle", 90, 0)
        .setTooltip('圆锥弧线角度')
    );
    this.data.push(new ListValue("群组", "group", ["Ally", "Enemy", "Both"], "Enemy")
        .setTooltip('攻击范围内的实体群组 分别为：盟友 敌人 两者')
    );
    this.data.push(new ListValue("穿墙", "wall", ['True', 'False'], 'False')
        .setTooltip('是否允许技能穿过墙壁寻找目标 False为不允许')
    );
    this.data.push(new ListValue("包括施法者", "caster", [ 'True', 'False' ], 'False')
        .setTooltip('目标是否包括施法者 False为不包括')
    );
    this.data.push(new AttributeValue("最大目标", "max", 99, 0)
        .setTooltip('目标数量的最大值,超出部分无效,如果目标包括施法者,施法者也计入')
    );
}

extend('TargetLinear', 'Component');
function TargetLinear()
{
    this.super('直线', Type.TARGET, true);

    this.description = '将目标指向施法者前面的一行中的所有生物(直线)';

    this.data.push(new AttributeValue("距离", "range", 5, 0)
        .setTooltip('最大距离,单位为方块')
    );
    this.data.push(new AttributeValue("宽度", "tolerance", 4, 0)
        .setTooltip('直线的宽度,单位为方块,越宽越容易被指向')
    );
    this.data.push(new ListValue("群组", "group", ["Ally", "Enemy", "Both"], "Enemy")
        .setTooltip('攻击范围内的实体群组 分别为：盟友 敌人 两者')
    );
    this.data.push(new ListValue("穿墙", "wall", ['True', 'False'], 'False')
        .setTooltip('是否允许技能穿过墙壁寻找目标 False为不允许')
    );
    this.data.push(new ListValue("包括施法者", "caster", [ 'True', 'False' ], 'False')
        .setTooltip('目标是否包括施法者 False为不包括')
    );
    this.data.push(new AttributeValue("最大目标", "max", 99, 0)
        .setTooltip('目标数量的最大值,超出部分无效,如果目标包括施法者,施法者也计入')
    );
}

extend('TargetLocation', 'Component');
function TargetLocation()
{
    this.super('坐标', Type.TARGET, true);

    this.description = '目标指向玩家十字准星所在位置. 将另一种目标选取与此结合以实现远程区域效果(与"范围"结合类似火男的W)';

    this.data.push(new AttributeValue('距离', 'range', 5, 0)
        .setTooltip('最大距离,单位为方块')
    );
    this.data.push(new ListValue('地面单位', 'ground', [ 'True', 'False' ], 'True')
        .setTooltip('准星坐标是否只能只在地面上(True 坐标必须在地上,False 坐标可以在空中)')
    );
}

extend('TargetNearest', 'Component');
function TargetNearest()
{
    this.super('最近', Type.TARGET, true);

    this.description = '以施法者为中心，指向最近的实体';

    this.data.push(new AttributeValue("半径", "radius", 3, 0)
        .setTooltip('范围的半径,单位为方块')
    );
    this.data.push(new ListValue("群组", "group", ["Ally", "Enemy", "Both"], "Enemy")
        .setTooltip('攻击范围内的实体群组 分别为：盟友 敌人 两者')
    );
    this.data.push(new ListValue("穿墙", "wall", ['True', 'False'], 'False')
        .setTooltip('是否允许技能穿过墙壁寻找目标 False为不允许')
    );
    this.data.push(new ListValue("包括施法者", "caster", [ 'True', 'False' ], 'False')
        .setTooltip('目标是否包括施法者 False为不包括')
    );
    this.data.push(new AttributeValue("最大目标", "max", 1, 0)
        .setTooltip('目标数量的最大值,超出部分无效,如果目标包括施法者,施法者也计入')
    );
}

extend('TargetOffset', 'Component');
function TargetOffset()
{
    this.super('偏移', Type.TARGET, true);

    this.description = '对目标选取的范围进行一定的偏移(需要之前就有一个"目标选取")并重新指向偏移后的范围';

    this.data.push(new AttributeValue('向前', 'forward', 0, 0)
        .setTooltip('目标前方(面向)的偏移量,负数为向后偏移')
    );
    this.data.push(new AttributeValue('向上', 'upward', 2, 0.5)
        .setTooltip('目标上方的偏移量,负数为向下偏移')
    );
    this.data.push(new AttributeValue('向右', 'right', 0, 0)
        .setTooltip('目标右方的偏移量,负数为向右偏移')
    );
}

extend('TargetRemember', 'Component');
function TargetRemember()
{
    this.super('标记', Type.TARGET, true);

    this.description = '指向标记目标,使用"Remember Targets"(标记目标)效果来标记目标,没有标记则释放失败';

    this.data.push(new StringValue('标记名称', 'key', 'target')
        .setTooltip('标记的名称,不可重复')
    );
}

extend('TargetSelf', 'Component');
function TargetSelf()
{
    this.super('自身', Type.TARGET, true);

    this.description = '指向自己';
}

extend('TargetSingle', 'Component');
function TargetSingle()
{
    this.super('单体', Type.TARGET, true);

    this.description = '指向在施法者前面的一个单位';

    this.data.push(new AttributeValue("距离", "range", 5, 0)
        .setTooltip('最大距离,单位为方块')
    );
    this.data.push(new AttributeValue("宽度", "tolerance", 4, 0)
        .setTooltip('宽度,单位为方块,越宽越容易被指向')
    );
    this.data.push(new ListValue("群组", "group", ["Ally", "Enemy", "Both"], "Enemy")
        .setTooltip('攻击范围内的实体群组 分别为：盟友 敌人 两者')
    );
    this.data.push(new ListValue("穿墙", "wall", ['True', 'False'], 'False')
        .setTooltip('是否允许技能穿过墙壁寻找目标 False为不允许')
    );
}

// -- Condition constructors --------------------------------------------------- //

extend('ConditionArmor', 'Component');
function ConditionArmor()
{
    this.super('装备', Type.CONDITION, true);
    this.description = "目标需要穿戴物品至指定槽位";

    this.data.push(new ListValue('护甲槽', 'armor', [ 'Helmet', 'Chestplate', 'Leggings', 'Boots', 'Any' ], 'Any')
        .setTooltip('指定的槽位,分别为头盔 胸甲 护腿 靴子 任意')
    );

    addItemOptions(this);
}

extend('ConditionAttribute', 'Component');
function ConditionAttribute()
{
    this.super('属性', Type.CONDITION, true);

    this.description = '目标需要拥有指定属性的指定值';

    this.data.push(new StringValue('属性', 'attribute', 'Vitality')
        .setTooltip('指定的属性名称')
    );
    this.data.push(new AttributeValue('最小值', 'min', 0, 0)
        .setTooltip('属性不能低于最小值')
    );
    this.data.push(new AttributeValue('最大值', 'max', 999, 0)
        .setTooltip('属性不能高于最大值')
    );
}

extend('ConditionBiome', 'Component');
function ConditionBiome()
{
    this.super('生物群系', Type.CONDITION, true);

    this.description = '目标需要在(或不在)指定的生物群系';

    this.data.push(new ListValue('类型', 'type', [ 'In Biome', 'Not In Biome' ], 'In Biome')
        .setTooltip('分别为:在指定生物群系中 不在指定生物群系中')
    );
    this.data.push(new MultiListValue('生物群系', 'biome', getBiomes, [ 'Forest' ])
            .setTooltip('指定的生物群系')
    );
}

extend('ConditionBlock', 'Component');
function ConditionBlock()
{
    this.super('方块', Type.CONDITION, true);

    this.description = '目标需要以指定方式接触指定方块';

    this.data.push(new ListValue('方式', 'standing', [ 'On Block', 'Not On Block', 'In Block', 'Not In Block' ], 'On Block')
        .setTooltip('分别为 在方块上 不在方块上 在方块里 不在方块里.在/不在方块上检测的是脚下的方块 在/不在方块里检测的是脚所在位置的方块')
    );
    this.data.push(new ListValue('类型', 'material', getMaterials, 'Dirt')
        .setTooltip('方块的类型')
    );
}

extend('ConditionCeiling', 'Component');
function ConditionCeiling()
{
    this.super('天花板', Type.CONDITION, true);

    this.description = '目标需要与天花板(即头顶最近的一个方块)保持指定距离';

    this.data.push(new AttributeValue('距离', 'distance', 5, 0)
        .setTooltip('保持的距离,单位为方块')
    );
    this.data.push(new ListValue('高于或低于', 'at-least', [ 'True', 'False' ], 'True')
        .setTooltip('True表示必须高于指定距离 False表示必须低于指定距离')
    );
}

extend('ConditionChance', 'Component');
function ConditionChance()
{
    this.super('几率', Type.CONDITION, true);

    this.description = '有几率释放技能';

    this.data.push(new AttributeValue('Chance', 'chance', 25, 0)
        .setTooltip('技能释放的几率 "25" 表示几率为25%')
    );
}

extend('ConditionClass', 'Component');
function ConditionClass()
{
    this.super('Class', Type.CONDITION, true);

    this.description = 'Applies child components when the target is the given class or optionally a profession of that class. For example, if you check for "Fighter" which professes into "Warrior", a "Warrior" will pass the check if you do not enable "exact".';

    this.data.push(new StringValue('Class', 'class', 'Fighter')
        .setTooltip('The class the player should be')
    );
    this.data.push(new ListValue('Exact', 'exact', [ 'True', 'False' ], 'False')
        .setTooltip('Whether or not the player must be exactly the given class. If false, they can be a later profession of the class.')
    );
}

extend('ConditionClassLevel', 'Component');
function ConditionClassLevel()
{
    this.super('Class Level', Type.CONDITION, true);

    this.description = 'Applies child components when the level of the class with this skill is within the range. This only checks the level of the caster, not the targets.';

    this.data.push(new IntValue('Min Level', 'min-level', 2)
        .setTooltip('The minimum class level the player should be. If the player has multiple classes, this will be of their main class')
    );
    this.data.push(new IntValue('Max Level', 'max-level', 99)
        .setTooltip('The maximum class level the player should be. If the player has multiple classes, this will be of their main class')
    );
}

extend('ConditionCombat', 'Component');
function ConditionCombat()
{
    this.super('Combat', Type.CONDITION, true);

    this.description = 'Applies child components to targets that are in/out of combat, depending on the settings.';

    this.data.push(new ListValue('In Combat', 'combat', [ 'True', 'False' ], 'True')
        .setTooltip('Whether or not the target should be in or out of combat')
    );
    this.data.push(new DoubleValue('Seconds', 'seconds', 10)
        .setTooltip('The time in seconds since the last combat activity before something is considered not in combat')
    );
}

extend('ConditionCrouch', 'Component');
function ConditionCrouch()
{
    this.super('Crouch', Type.CONDITION, true);

    this.description = 'Applies child components if the target player(s) are crouching';

    this.data.push(new ListValue('Crouching', 'crouch', [ 'True', 'False' ], 'True')
        .setTooltip('Whether or not the player should be crouching')
    );
}

extend('ConditionDirection', 'Component');
function ConditionDirection()
{
    this.super('Direction', Type.CONDITION, true);

    this.description = 'Applies child components when the target or caster is facing the correct direction relative to the other.';

    this.data.push(new ListValue('Type', 'type', [ 'Target', 'Caster' ], 'Target')
        .setTooltip('The entity to check the direction of')
    );
    this.data.push(new ListValue('Direction', 'direction', [ 'Away', 'Towards' ], 'Away')
        .setTooltip('The direction the chosen entity needs to be looking relative to the other.')
    );
}

extend('ConditionElevation', 'Component');
function ConditionElevation()
{
    this.super('Elevation', Type.CONDITION, true);

    this.description = 'Applies child components when the elevation of the target matches the settings.';

    this.data.push(new ListValue('Type', 'type', [ 'Normal', 'Difference' ], 'Normal')
        .setTooltip('The type of comparison to make. Normal is just their Y-coordinate. Difference would be the difference between that the caster\'s Y-coordinate')
    );
    this.data.push(new AttributeValue('Min Value', 'min-value', 0, 0)
        .setTooltip('The minimum value for the elevation required. A positive minimum value with a "Difference" type would be for when the target is higher up than the caster')
    );
    this.data.push(new AttributeValue('Max Value', 'max-value', 255, 0)
        .setTooltip('The maximum value for the elevation required. A negative maximum value with a "Difference" type would be for when the target is below the caster')
    );
}

extend('ConditionElse', 'Component');
function ConditionElse()
{
    this.super('Else', Type.CONDITION, true);

    this.description = 'Applies child elements if the previous component failed to execute. This not only applies for conditions not passing, but mechanics failing due to no target or other cases.';
}

extend('ConditionEntityType', 'Component');
function ConditionEntityType()
{
    this.super('Entity Type', Type.CONDITION, true);

    this.description = 'Applies child elements if the target matches one of the selected entity types'

    this.data.push(new MultiListValue('Types', 'types', getEntities)
        .setTooltip('The entity types to target')
    );
}

extend('ConditionFire', 'Component');
function ConditionFire()
{
    this.super('Fire', Type.CONDITION, true);

    this.description = 'Applies child components when the target is on fire.';

    this.data.push(new ListValue('Type', 'type', [ 'On Fire', 'Not On Fire' ], 'On Fire')
        .setTooltip('Whether or not the target should be on fire')
    );
}

extend('ConditionFlag', 'Component');
function ConditionFlag()
{
    this.super('Flag', Type.CONDITION, true);

    this.description = 'Applies child components when the target is marked by the appropriate flag.';

    this.data.push(new ListValue('Type', 'type', [ 'Set', 'Not Set' ], 'Set')
        .setTooltip('Whether or not the flag should be set')
    );
    this.data.push(new StringValue('Key', 'key', 'key')
        .setTooltip('The unique key representing the flag. This should match the key for when you set it using the Flag mechanic or the Flat Toggle mechanic')
    );
}

extend('ConditionGround', 'Component');
function ConditionGround()
{
    this.super('Ground', Type.CONDITION, true);

    this.description = 'Applies child components when the target is on the ground';

    this.data.push(new ListValue('Type', 'type', [ 'On Ground', 'Not On Ground' ], 'On Ground')
        .setTooltip('Whether or not the target should be on the ground')
    );
}

extend('ConditionHealth', 'Component');
function ConditionHealth()
{
    this.super('Health', Type.CONDITION, true);

    this.description = "Applies child components when the target's health matches the settings.";

    this.data.push(new ListValue('Type', 'type', [ 'Health', 'Percent', 'Difference', 'Difference Percent' ], 'Health')
        .setTooltip('The type of measurement to use for the health. Health is their flat health left. Percent is the percentage of health they have left. Difference is the difference between the target\'s flat health and the caster\'s. Difference percent is the difference between the target\'s percentage health left and the caster\s')
    );
    this.data.push(new AttributeValue('Min Value', 'min-value', 0, 0)
        .setTooltip('The minimum health required. A positive minimum with one of the "Difference" types would be for when the target has more health')
    );
    this.data.push(new AttributeValue('Max Value', 'max-value', 10, 2)
        .setTooltip('The maximum health required. A negative maximum with one of the "Difference" types would be for when the target has less health')
    );
}

extend('ConditionItem', 'Component');
function ConditionItem()
{
    this.super('Item', Type.CONDITION, true);
    this.description = "Applies child components when the target is wielding an item matching the given material.";

    addItemOptions(this);
}

extend('ConditionInventory', 'Component');
function ConditionInventory()
{
    this.super('Inventory', Type.CONDITION, true);

    this.description = 'Applies child components when the target player contains the given item in their inventory. This does not work on mobs.';

    this.data.push(new AttributeValue('Amount', 'amount', 1, 0)
        .setTooltip('The amount of the item needed in the player\'s inventory')
    );

    addItemOptions(this);
}

extend('ConditionLight', 'Component');
function ConditionLight()
{
    this.super('Light', Type.CONDITION, true);

    this.description = "Applies child components when the light level at the target's location matches the settings.";

    this.data.push(new AttributeValue('Min Light', 'min-light', 0, 0)
        .setTooltip('The minimum light level needed. 16 is full brightness while 0 is complete darkness')
    );
    this.data.push(new AttributeValue('Max Light', 'max-light', 16, 16)
        .setTooltip('The maximum light level needed. 16 is full brightness while 0 is complete darkness')
    );
}

extend('ConditionMana', 'Component');
function ConditionMana()
{
    this.super('Mana', Type.CONDITION, true);

    this.description = "Applies child components when the target's mana matches the settings.";

    this.data.push(new ListValue('Type', 'type', [ 'Mana', 'Percent', 'Difference', 'Difference Percent' ], 'Mana')
        .setTooltip('The type of measurement to use for the mana. Mana is their flat mana left. Percent is the percentage of mana they have left. Difference is the difference between the target\'s flat mana and the caster\'s. Difference percent is the difference between the target\'s percentage mana left and the caster\s')
    );
    this.data.push(new AttributeValue('Min Value', 'min-value', 0, 0)
        .setTooltip('The minimum amount of mana needed')
    );
    this.data.push(new AttributeValue('Max Value', 'max-value', 10, 2)
        .setTooltip('The maximum amount of mana needed')
    );
}

extend('ConditionName', 'Component');
function ConditionName()
{
    this.super('Name', Type.CONDITION, true);

    this.description = 'Applies child components when the target has a name matching the settings.';

    this.data.push(new ListValue('Contains Text', 'contains', [ 'True', 'False' ], 'True')
        .setTooltip('Whether or not the target should have a name containing the text')
    );
    this.data.push(new ListValue('Regex', 'regex', [ 'True', 'False' ], 'False')
        .setTooltip('Whether or not the text is formatted as regex. If you do not know what regex is, ignore this option')
    );
    this.data.push(new StringValue('Text', 'text', 'text')
        .setTooltip('The text to look for in the target\'s name')
    );
}

extend('ConditionOffhand', 'Component');
function ConditionOffhand()
{
    this.super('Offhand', Type.CONDITION, true);
    this.description = "Applies child components when the target is wielding an item matching the given material as an offhand item. This is for v1.9+ servers only.";

    addItemOptions(this);
}

extend('ConditionPermission', 'Component');
function ConditionPermission()
{
    this.super('Permission', Type.CONDITION, true);

    this.description = 'Applies child components if the caster has the required permission';

    this.data.push(new StringValue('Permission', 'perm', 'some.permission')
        .setTooltip('The permission the player needs to have')
    );
}

extend('ConditionPotion', 'Component');
function ConditionPotion()
{
    this.super('Potion', Type.CONDITION, true);

    this.description = 'Applies child components when the target has the potion effect.';

    this.data.push(new ListValue('Type', 'type', [ 'Active', 'Not Active' ], 'Active')
        .setTooltip('Whether or not the potion should be active')
    );
    this.data.push(new ListValue('Potion', 'potion', getAnyPotion, 'Any')
        .setTooltip('The type of potion to look for')
    );
    this.data.push(new AttributeValue('Min Rank', 'min-rank', 0, 0)
        .setTooltip('The minimum rank the potion effect can be')
    );
    this.data.push(new AttributeValue('Max Rank', 'max-rank', 999, 0)
        .setTooltip('The maximum rank the potion effect can be')
    );
}

extend('ConditionSkillLevel', 'Component');
function ConditionSkillLevel(skill)
{
    this.super('Skill Level', Type.CONDITION, true);

    this.description = 'Applies child components when the skill level is with the range. This checks the skill level of the caster, not the targets.';

    this.data.push(new StringValue('Skill', 'skill', skill)
        .setTooltip('The name of the skill to check the level of. If you want to check the current skill, enter the current skill\'s name anyway')
    );
    this.data.push(new IntValue('Min Level', 'min-level', 2)
        .setTooltip('The minimum level of the skill needed')
    );
    this.data.push(new IntValue('Max Level', 'max-level', 99)
        .setTooltip('The maximum level of the skill needed')
    );
}

extend('ConditionSlot', 'Component');
function ConditionSlot()
{
    this.super('Slot', Type.CONDITION, true);
    this.description = "Applies child components when the target player has a matching item in the given slot.";

    this.data.push(new StringListValue('Slots (one per line)', 'slot', [9])
        .setTooltip('The slots to look at. Slots 0-8 are the hot bar, 9-35 are the main inventory, 36-39 are armor, and 40 is the offhand slot. Multiple slots will check if any of the slots match.')
    );

    addItemOptions(this);
}

extend('ConditionStatus', 'Component');
function ConditionStatus()
{
    this.super('Status', Type.CONDITION, true);

    this.description = 'Applies child components when the target has the status condition.';

    this.data.push(new ListValue('Type', 'type', [ 'Active', 'Not Active' ], 'Active')
        .setTooltip('Whether or not the status should be active')
    );
    this.data.push(new ListValue('Status', 'status', [ 'Any', 'Absorb', 'Curse', 'Disarm', 'Invincible', 'Root', 'Silence', 'Stun' ], 'Any')
        .setTooltip('The status to look for')
    );
}

extend('ConditionTime', 'Component');
function ConditionTime()
{
    this.super('Time', Type.CONDITION, true);

    this.description = 'Applies child components when the server time matches the settings.';

    this.data.push(new ListValue('Time', 'time', [ 'Day', 'Night' ], 'Day')
        .setTooltip('The time to check for in the current world')
    );
}

extend('ConditionTool', 'Component');
function ConditionTool()
{
    this.super('Tool', Type.CONDITION, true);

    this.description = 'Applies child components when the target is wielding a matching tool.';

    this.data.push(new ListValue('Material', 'material', [ 'Any', 'Wood', 'Stone', 'Iron', 'Gold', 'Diamond' ], 'Any')
        .setTooltip('The material the held tool needs to be made out of')
    );
    this.data.push(new ListValue('Tool', 'tool', [ 'Any', 'Axe', 'Hoe', 'Pickaxe', 'Shovel', 'Sword' ], 'Any')
        .setTooltip('The type of tool it needs to be')
    );
}

extend('ConditionValue', 'Component');
function ConditionValue()
{
    this.super('Value', Type.CONDITION, true);

    this.description = 'Applies child components if a stored value is within the given range.';

    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('The unique string used for the value set by the Value mechanics.')
    );
    this.data.push(new AttributeValue('Min Value', 'min-value', 1, 0)
        .setTooltip('The lower bound of the required value')
    );
    this.data.push(new AttributeValue('Max Value', 'max-value', 999, 0)
        .setTooltip('The upper bound of the required value')
    );
}

extend('ConditionWater', 'Component');
function ConditionWater()
{
    this.super('Water', Type.CONDITION, true);

    this.description = 'Applies child components when the target is in or out of water, depending on the settings.';

    this.data.push(new ListValue('State', 'state', [ 'In Water', 'Out Of Water' ], 'In Water')
        .setTooltip('Whether or not the target needs to be in the water')
    );
}

extend('ConditionWeather', 'Component');
function ConditionWeather()
{
    this.super('Weather', Type.CONDITION, true);

    this.description = 'Applies child components when the target\'s location has the given weather condition';

    this.data.push(new ListValue('Type', 'type', [ 'None', 'Rain', 'Snow', 'Thunder' ], 'Rain')
        .setTooltip('Whether or not the target needs to be in the water')
    );
}

// -- Mechanic constructors ---------------------------------------------------- //

extend('MechanicAttribute', 'Component');
function MechanicAttribute()
{
    this.super('Attribute', Type.MECHANIC, false);

    this.description = 'Gives a player bonus attributes temporarily.';

    this.data.push(new StringValue('Attribute', 'key', 'Intelligence')
        .setTooltip('The name of the attribute to add to')
    );
    this.data.push(new AttributeValue('Amount', 'amount', 5, 2)
        .setTooltip('How much to add to the player\'s attribute')
    );
    this.data.push(new AttributeValue('Seconds', 'seconds', 3, 0)
        .setTooltip('How long in seconds to give the attributes to the player')
    );
    this.data.push(new ListValue('Stackable', 'stackable', [ 'True', 'False' ], 'False')
        .setTooltip('[PREM] Whether or not applying multiple times stacks the effects')
    );
}

extend('MechanicBlock', 'Component');
function MechanicBlock()
{
    this.super('Block', Type.MECHANIC, false);

    this.description = 'Changes blocks to the given type of block for a limited duration.';

    this.data.push(new ListValue('Shape', 'shape', [ 'Sphere', 'Cuboid' ], 'Sphere' )
        .setTooltip('The shape of the region to change the blocks for')
    );
    this.data.push(new ListValue('Type', 'type', [ 'Air', 'Any', 'Solid' ], 'Solid' )
        .setTooltip('The type of blocks to replace. Air or any would be for making obstacles while solid would change the environment')
    );
    this.data.push(new ListValue('Block', 'block', getMaterials, 'Ice')
        .setTooltip('The type of block to turn the region into')
    );
    this.data.push(new IntValue('Block Data', 'data', 0)
        .setTooltip('The block data to apply, mostly applicable for things like signs, woods, steps, or the similar')
    );
    this.data.push(new AttributeValue('Seconds', 'seconds', 5, 0)
        .setTooltip('How long the blocks should be replaced for')
    );
    this.data.push(new AttributeValue('Forward Offset', 'forward', 0, 0)
        .setTooltip('How far forward in front of the target the region should be in blocks. A negative value will put it behind.')
    );
    this.data.push(new AttributeValue('Upward Offset', 'upward', 0, 0)
        .setTooltip('How far above the target the region should be in blocks. A negative value will put it below.')
    );
    this.data.push(new AttributeValue('Right Offset', 'right', 0, 0)
        .setTooltip('How far to the right the region should be of the target. A negative value will put it to the left.')
    );

    // Sphere options
    this.data.push(new AttributeValue('Radius', 'radius', 3, 0).requireValue('shape', [ 'Sphere' ])
        .setTooltip('The radius of the sphere region in blocks')
    );

    // Cuboid options
    this.data.push(new AttributeValue('Width (X)', 'width', 5, 0).requireValue('shape', [ 'Cuboid' ])
        .setTooltip('The width of the cuboid in blocks')
    );
    this.data.push(new AttributeValue('Height (Y)', 'height', 5, 0).requireValue('shape', [ 'Cuboid' ])
        .setTooltip('The height of the cuboid in blocks')
    );
    this.data.push(new AttributeValue('Depth (Z)', 'depth', 5, 0).requireValue('shape', [ 'Cuboid' ])
        .setTooltip('The depth of the cuboid in blocks')
    );
}

extend('MechanicBuff', 'Component');
function MechanicBuff()
{
    this.super('Buff', Type.MECHANIC, false);

    this.description = 'Buffs combat stats of the target';

    this.data.push(new ListValue('Immediate', 'immediate', [ 'True', 'False' ], 'False')
        .setTooltip('Whether or not to apply the buff to the current damage trigger.')
    );
    this.data.push(new ListValue('Type', 'type', [ 'DAMAGE', 'DEFENSE', 'SKILL_DAMAGE', 'SKILL_DEFENSE', 'HEALING' ], 'DAMAGE')
        .requireValue('immediate', [ 'False' ])
        .setTooltip('What type of buff to apply. DAMAGE/DEFENSE is for regular attacks, SKILL_DAMAGE/SKILL_DEFENSE are for damage from abilities, and HEALING is for healing from abilities')
    );
    this.data.push(new ListValue('Modifier', 'modifier', [ 'Flat', 'Multiplier' ], 'Flat')
        .setTooltip('The sort of scaling for the buff. Flat will increase/reduce incoming damage by a fixed amount where Multiplier does it by a percentage of the damage. Multipliers above 1 will increase damage taken while multipliers below 1 reduce damage taken.')
    );
    this.data.push(new StringValue('Category', 'category', '')
        .requireValue('type', [ 'SKILL_DAMAGE', 'SKILL_DEFENSE' ])
        .setTooltip('What kind of skill damage to affect. If left empty, this will affect all skill damage.')
    );
    this.data.push(new AttributeValue('Value', 'value', 1, 0)
        .setTooltip('The amount to increase/decrease incoming damage by')
    );
    this.data.push(new AttributeValue('Seconds', 'seconds', 3, 0)
        .requireValue('immediate', [ 'False' ])
        .setTooltip('The duration of the buff in seconds')
    );
}

extend('MechanicCancel', 'Component');
function MechanicCancel()
{
    this.super('Cancel', Type.MECHANIC, false);

    this.description = 'Cancels the event that caused the trigger this is under to go off. For example, damage based triggers will stop the damage that was dealt while the Launch trigger would stop the projectile from firing.';
}

extend('MechanicCancelEffect', 'Component');
function MechanicCancelEffect()
{
    this.super('Cancel Effect', Type.MECHANIC, false);

    this.description = 'Stops a particle effect prematurely.';

    this.data.push(new StringValue('Effect Key', 'effect-key', 'default')
        .setTooltip('The key used when setting up the effect')
    );
}

extend('MechanicChannel', 'Component');
function MechanicChannel()
{
    this.super('Channel', Type.MECHANIC, true);

    this.description = 'Applies child effects after a duration which can be interrupted. During the channel, the player cannot move, attack, or use other spells.';

    this.data.push(new ListValue('Still', 'still', [ 'True', 'False' ], 'True')
        .setTooltip('Whether or not to hold the player in place while channeling')
    );
    this.data.push(new AttributeValue('Time', 'time', 3, 0)
        .setTooltip('The amouont of time, in seconds, to channel for')
    );
}

extend('MechanicCleanse', 'Component');
function MechanicCleanse()
{
    this.super('Cleanse', Type.MECHANIC, false);

    this.description = 'Cleanses negative potion or status effects from the targets.';

    this.data.push(new ListValue('Potion', 'potion', getBadPotions, 'All')
        .setTooltip('The type of potion effect to remove from the target')
    );
    this.data.push(new ListValue('Status', 'status', [ 'None', 'All', 'Curse', 'Disarm', 'Root', 'Silence', 'Stun' ], 'All')
        .setTooltip('The status to remove from the target')
    );
}

extend('MechanicCommand', 'Component');
function MechanicCommand()
{
    this.super('Command', Type.MECHANIC, false);

    this.description ='Executes a command for each of the targets either from them directly by oping them or via the console using their name.';

    this.data.push(new StringValue('Command', 'command', '')
        .setTooltip('The command to execute')
    );
    this.data.push(new ListValue('Execute Type', 'type', [ 'Console', 'OP' ], 'OP')
        .setTooltip('How to execute the command. Console will execute the command for the console while OP will have the target player execute it while given a temporary OP permission. Use {player} to embed the target player\'s name into the command')
    );
}

extend('MechanicCooldown', 'Component');
function MechanicCooldown()
{
    this.super('Cooldown', Type.MECHANIC, false);

    this.description = "Lowers the cooldowns of the target's skill(s). If you provide a negative amount, it will increase the cooldown.";

    this.data.push(new StringValue('Skill (or "all")', 'skill', 'all')
        .setTooltip('The skill to modify the cooldown for')
    );
    this.data.push(new ListValue('Type', 'type', [ 'Seconds', 'Percent' ], 'Seconds')
        .setTooltip('The modification unit to use. Seconds will add/subtract seconds from the cooldown while Percent will add/subtract a percentage of its full cooldown')
    );
    this.data.push(new AttributeValue('Value', 'value', -1, 0)
        .setTooltip('The amount to add/subtract from the skill\'s cooldown')
    );
}

extend('MechanicDamage', 'Component');
function MechanicDamage()
{
    this.super('Damage', Type.MECHANIC, false);

    this.description = 'Inflicts skill damage to each target. Multiplier type would be a percentage of the target health.';

    this.data.push(new ListValue('Type', 'type', [ 'Damage', 'Multiplier', 'Percent Left', 'Percent Missing' ], 'Damage')
        .setTooltip('The unit to use for the amount of damage. Damage will deal flat damage, Multiplier will deal a percentage of the target\'s max health, Percent Left will deal a percentage of their current health, and Percent Missing will deal a percentage of the difference between their max health and current health')
    );
    this.data.push(new AttributeValue("Value", "value", 3, 1)
        .setTooltip('The amount of damage to deal')
    );
    this.data.push(new ListValue('True Damage', 'true', [ 'True', 'False' ], 'False')
        .setTooltip('Whether or not to deal true damage. True damage ignores armor and all plugin checks.')
    );
    this.data.push(new StringValue('Classifier', 'classifier', 'default')
        .setTooltip('[PREMIUM ONLY] The type of damage to deal. Can act as elemental damage or fake physical damage')
    );
}

extend('MechanicDamageBuff', 'Component');
function MechanicDamageBuff()
{
    this.super('Damage Buff', Type.MECHANIC, false);

    this.description = 'Modifies the physical damage dealt by each target by a multiplier or a flat amount for a limited duration. Negative flat amounts or multipliers less than one will reduce damage dealt while the opposite will increase damage dealt. (e.g. a 5% damage buff would be a multiplier or 1.05)';

    this.data.push(new ListValue('Type', 'type', [ 'Flat', 'Multiplier' ], 'Flat')
        .setTooltip('The type of buff to apply. Flat increases damage by a fixed amount while multiplier increases it by a percentage.')
    );
    this.data.push(new ListValue('Skill Damage', 'skill', [ 'True', 'False' ], 'False')
        .setTooltip('Whether or not to buff skill damage. If false, it will affect physical damage.')
    );
    this.data.push(new AttributeValue('Value', 'value', 1, 0)
        .setTooltip('The amount to increase/decrease the damage by. A negative amoutn with the "Flat" type will decrease damage, similar to a number less than 1 for the multiplier.')
    );
    this.data.push(new AttributeValue('Seconds', 'seconds', 3, 0)
        .setTooltip('The duration of the buff in seconds')
    );
}

extend('MechanicDamageLore', 'Component');
function MechanicDamageLore()
{
    this.super('Damage Lore', Type.MECHANIC, false);

    this.description = 'Damages each target based on a value found in the lore of the item held by the caster.';

    this.data.push(new ListValue("Hand", "hand", [ 'Main', 'Offhand' ], 'Main')
        .setTooltip('The hand to check for the item. Offhand items are MC 1.9+ only.')
    );
    this.data.push(new StringValue('Regex', 'regex', 'Damage: {value}')
        .setTooltip('The regex for the text to look for. Use {value} for where the important number should be. If you do not know about regex, consider looking it up on Wikipedia or avoid using major characters such as [ ] { } ( ) . + ? * ^ \\ |')
    );
    this.data.push(new AttributeValue('Multiplier', 'multiplier', 1, 0)
        .setTooltip('The multiplier to use on the value to get the actual damage to deal')
    );
    this.data.push(new ListValue('True Damage', 'true', [ 'True', 'False' ], 'False')
        .setTooltip('Whether or not to deal true damage. True damage ignores armor and all plugin checks.')
    );
    this.data.push(new StringValue('Classifier', 'classifier', 'default')
        .setTooltip('[PREMIUM ONLY] The type of damage to deal. Can act as elemental damage or fake physical damage')
    );
}

extend('MechanicDefenseBuff', 'Component');
function MechanicDefenseBuff()
{
    this.super('Defense Buff', Type.MECHANIC, false);

    this.description = 'Modifies the physical damage taken by each target by a multiplier or a flat amount for a limited duration. Negative flag amounts or multipliers less than one will reduce damage taken while the opposite will increase damage taken. (e.g. a 5% defense buff would be a multiplier or 0.95, since you would be taking 95% damage)';

    this.data.push(new ListValue('Type', 'type', [ 'Flat', 'Multiplier' ], 'Flat')
        .setTooltip('The type of buff to apply. Flat will increase/reduce incoming damage by a fixed amount where Multiplier does it by a percentage of the damage. Multipliers above 1 will increase damage taken while multipliers below 1 reduce damage taken.')
    );
    this.data.push(new ListValue('Skill Defense', 'skill', [ 'True', 'False' ], 'False')
        .setTooltip('Whether or not to buff skill defense. If false, it will affect physical defense.')
    );
    this.data.push(new AttributeValue('Value', 'value', 1, 0)
        .setTooltip('The amount to increase/decrease incoming damage by')
    );
    this.data.push(new AttributeValue('Seconds', 'seconds', 3, 0)
        .setTooltip('The duration of the buff in seconds')
    );
}

extend('MechanicDelay', 'Component');
function MechanicDelay()
{
    this.super('Delay', Type.MECHANIC, true);

    this.description = 'Applies child components after a delay.';

    this.data.push(new AttributeValue('Delay', 'delay', 2, 0)
        .setTooltip('The amount of time to wait before applying child components in seconds')
    );
}

extend('MechanicDisguise', 'Component');
function MechanicDisguise()
{
    this.super('Disguise', Type.MECHANIC, false);

    this.description = 'Disguises each target according to the settings. This mechanic requires the LibsDisguise plugin to be installed on your server.';

    this.data.push(new AttributeValue('Duration', 'duration', -1, 0)
        .setTooltip('How long to apply the disguise for in seconds. Use a negative number to permanently disguise the targets.')
    );
    this.data.push(new ListValue('Type', 'type', [ 'Mob', 'Player', 'Misc' ], 'Mob')
        .setTooltip('The type of disguise to use, as defined by the LibsDisguise plugin.')
    );

    this.data.push(new ListValue('Mob', 'mob', [ 'Bat', 'Blaze', 'Cave Spider', 'Chicken', 'Cow', 'Creeper', 'Donkey', 'Elder Guardian', 'Ender Dragon', 'Enderman', 'Endermite', 'Ghast', 'Giant', 'Guardian', 'Horse', 'Iron Golem', 'Magma Cube', 'Mule', 'Mushroom Cow', 'Ocelot', 'Pig', 'Pig Zombie', 'Rabbit', 'Sheep', 'Shulker', 'Silverfish', 'Skeleton', 'Slime', 'Snowman', 'Spider', 'Squid', 'Undead Horse', 'Villager', 'Witch', 'Wither', 'Wither Skeleton', 'Wolf', 'Zombie', 'Zombie Villager'], 'Zombie')
        .requireValue('type', [ 'Mob' ])
        .setTooltip('The type of mob to disguise the target as')
    );
    this.data.push(new ListValue('Adult', 'adult', [ 'True', 'False', ], 'True')
        .requireValue('type', [ 'Mob' ])
        .setTooltip('Whether or not to use the adult variant of the mob')
    );

    this.data.push(new StringValue('Player', 'player', 'Eniripsa96')
        .requireValue('type', [ 'Player' ])
        .setTooltip('The player to disguise the target as')
    );

    this.data.push(new ListValue('Misc', 'misc', [ 'Area Effect Cloud', 'Armor Stand', 'Arrow', 'Boat', 'Dragon Fireball', 'Dropped Item', 'Egg', 'Ender Crystal', 'Ender Pearl', 'Ender Signal', 'Experience Orb', 'Falling Block', 'Fireball', 'Firework', 'Fishing Hook', 'Item Frame', 'Leash Hitch', 'Minecart', 'Minecart Chest', 'Minecart Command', 'Minecart Furnace', 'Minecart Hopper', 'Minecart Mob Spawner', 'Minecart TNT', 'Painting', 'Primed TNT', 'Shulker Bullet', 'Snowball', 'Spectral Arrow', 'Splash Potion', 'Tipped Arrow', 'Thrown EXP Bottle', 'Wither Skull' ], 'Painting')
        .requireValue('type', [ 'Misc' ])
        .setTooltip('The object to disguise the target as')
    );
    this.data.push(new IntValue('Data', 'data', 0)
        .requireValue('type', [ 'Misc' ])
        .setTooltip('Data value to use for the disguise type. What it does depends on the disguise')
    );
}

extend('MechanicDurability', 'Component');
function MechanicDurability()
{
    this.super('Durability', Type.MECHANIC, false);

    this.description = 'Lowers the durability of a held item';

    this.data.push(new AttributeValue('Amount', 'amount', 1, 0)
        .setTooltip('Amount to reduce the item\'s durability by')
    );
    this.data.push(new ListValue('Offhand', 'offhand', [ 'True', 'False' ], 'False')
        .setTooltip('Whether or not to apply to the offhand slot')
    );
}

extend('MechanicExplosion', 'Component');
function MechanicExplosion()
{
    this.super('Explosion', Type.MECHANIC, false);

    this.description = 'Causes an explosion at the current target\'s position';

    this.data.push(new AttributeValue('Power', 'power', 3, 0)
        .setTooltip('The strength of the explosion')
    );
    this.data.push(new ListValue('Damage Blocks', 'damage', [ 'True', 'False' ], 'False')
        .setTooltip('Whether or not to damage blocks with the explosion')
    );
    this.data.push(new ListValue('Fire', 'fire', [ 'True', 'False' ], 'False')
        .setTooltip('Whether or not to set affected blocks on fire')
    );
}

extend('MechanicFire', 'Component');
function MechanicFire()
{
    this.super('Fire', Type.MECHANIC, false);

    this.description = 'Sets the target on fire for a duration.';

    this.data.push(new AttributeValue('Seconds', 'seconds', 3, 1)
        .setTooltip('The duration of the fire in seconds')
    );
}

extend('MechanicFlag', 'Component');
function MechanicFlag()
{
    this.super('Flag', Type.MECHANIC, false);

    this.description = 'Marks the target with a flag for a duration. Flags can be checked by other triggers, spells or the related for interesting synergies and effects.';

    this.data.push(new StringValue('Key', 'key', 'key')
        .setTooltip('The unique string for the flag. Use the same key when checking it in a Flag Condition.')
    );
    this.data.push(new AttributeValue('Seconds', 'seconds', 3, 1)
        .setTooltip('The duration the flag should be set for. To set one indefinitely, use Flag Toggle.')
    );
}

extend('MechanicFlagClear', 'Component');
function MechanicFlagClear()
{
    this.super('Flag Clear', Type.MECHANIC, false);

    this.description = 'Clears a flag from the target.';

    this.data.push(new StringValue('Key', 'key', 'key')
        .setTooltip('The unique string for the flag. This should match that of the mechanic that set the flag to begin with.')
    );
}

extend('MechanicFlagToggle', 'Component');
function MechanicFlagToggle()
{
    this.super('Flag Toggle', Type.MECHANIC, false);

    this.description = 'Toggles a flag on or off for the target. This can be used to make toggle effects.';

    this.data.push(new StringValue('Key', 'key', 'key')
        .setTooltip('The unique string for the flag. Use the same key when checking it in a Flag Condition')
    );
}

extend('MechanicFood', 'Component');
function MechanicFood()
{
    this.super('Food', Type.MECHANIC, false);

    this.description = 'Adds or removes to a player\'s hunger and saturation';

    this.data.push(new AttributeValue('Food', 'food', 1, 1)
        .setTooltip('The amount of food to give. Use a negative number to lower the food meter.')
    );
    this.data.push(new AttributeValue('Saturation', 'saturation', 0, 0)
        .setTooltip('How much saturation to give. Use a negative number to lower saturation. This is the hidden value that determines how long until food starts going down.')
    );
}

extend('MechanicForgetTargets', 'Component');
function MechanicForgetTargets()
{
    this.super('Forget Targets', Type.MECHANIC, false);

    this.description = 'Clears targets stored by the "Remember Targets" mechanic';

    this.data.push(new StringValue('Key', 'key', 'key')
        .setTooltip('The unique key the targets were stored under')
    );
}

extend('MechanicHeal', 'Component');
function MechanicHeal()
{
    this.super('Heal', Type.MECHANIC, false);

    this.description = 'Restores health to each target.';

    this.data.push(new ListValue("Type", "type", [ "Health", "Percent" ], "Health")
        .setTooltip('The unit to use for the amount of health to restore. Health restores a flat amount while Percent restores a percentage of their max health.')
    );
    this.data.push(new AttributeValue("Value", "value", 3, 1)
        .setTooltip('The amount of health to restore')
    );
}

extend('MechanicHealthSet', 'Component');
function MechanicHealthSet()
{
    this.super('Health Set', Type.MECHANIC, false);

    this.description = 'Sets the target\'s health to the specified amount, ignoring resistances, damage buffs, and so on';

    this.data.push(new AttributeValue("Health", "health", 1, 0)
        .setTooltip('The health to set to')
    );
}

extend('MechanicHeldItem', 'Component');
function MechanicHeldItem()
{
    this.super('Held Item', Type.MECHANIC, false);

    this.description = 'Sets the held item slot of the target player. This will do nothing if trying to set it to a skill slot.';

    this.data.push(new AttributeValue("Slot", "slot", 0, 0)
        .setTooltip('The slot to set it to')
    );
}

extend('MechanicImmunity', 'Component');
function MechanicImmunity()
{
    this.super('Immunity', Type.MECHANIC, false);

    this.description = 'Provides damage immunity from one source for a duration.'

    this.data.push(new ListValue('Type', 'type', DAMAGE_TYPES, 'Poison')
        .setTooltip('The damage type to give an immunity for')
    );
    this.data.push(new AttributeValue('Seconds', 'seconds', 3, 0)
        .setTooltip('How long to give an immunity for')
    );
    this.data.push(new AttributeValue('Multiplier', 'multiplier', 0, 0)
        .setTooltip('The multiplier for the incoming damage. Use 0 if you want full immunity.')
    );
}

extend('MechanicInterrupt', 'Component');
function MechanicInterrupt()
{
    this.super('Interrupt', Type.MECHANIC, false);

    this.description = 'Interrupts any channeling being done by each target if applicable.';
}

extend('MechanicItem', 'Component');
function MechanicItem()
{
    this.super('Item', Type.MECHANIC, false);

    this.description = 'Gives each player target the item defined by the settings.';

    this.data.push(new ListValue('Material', 'material', getMaterials, 'Arrow')
        .setTooltip('The type of item to give to the player')
    );
    this.data.push(new IntValue('Amount', 'amount', 1)
        .setTooltip('The quantity of the item to give to the player')
    );
    this.data.push(new IntValue('Durability', 'data', 0)
        .setTooltip('The durability value of the item to give to the player')
    );
    this.data.push(new IntValue('Data', 'byte', 0)
        .setTooltip('The data value of the item to give to the player for things such as egg type or wool color')
    );
    this.data.push(new ListValue('Custom', 'custom', [ 'True', 'False' ], 'False')
        .setTooltip('Whether or not to apply a custom name/lore to the item')
    );

    this.data.push(new StringValue('Name', 'name', 'Name').requireValue('custom', [ 'True' ])
        .setTooltip('The name of the item')
    );
    this.data.push(new StringListValue('Lore', 'lore', []).requireValue('custom', [ 'True' ])
        .setTooltip('The lore text for the item (the text below the name)')
    );
}

extend('MechanicItemProjectile', 'Component');
function MechanicItemProjectile()
{
    this.super('Item Projectile', Type.MECHANIC, true);

    this.description = 'Launches a projectile using an item as its visual that applies child components upon landing. The target passed on will be the collided target or the location where it landed if it missed.';


    this.data.push(new ListValue('Item', 'item', getMaterials, 'Jack O Lantern')
        .setTooltip('The item type to use as a projectile')
    ),
    this.data.push(new IntValue('Item Data', 'item-data', 0)
        .setTooltip('The durability value for the item to use as a projectile, most notably for dyes or colored items like wool')
    ),

    addProjectileOptions(this);
    addEffectOptions(this, true);
}

extend('MechanicItemRemove', 'Component');
function MechanicItemRemove()
{
    this.super('Item Remove', Type.MECHANIC, false);

    this.description = 'Removes an item from a player inventory. This does nothing to mobs.';

    this.data.push(new AttributeValue('Amount', 'amount', 1, 0)
        .setTooltip('The amount of the item needed in the player\'s inventory')
    );

    addItemOptions(this);
}

extend('MechanicLaunch', 'Component');
function MechanicLaunch()
{
    this.super('Launch', Type.MECHANIC, false);

    this.description = 'Launches the target relative to their forward direction. Use negative values to go in the opposite direction (e.g. negative forward makes the target go backwards)';

    this.data.push(new ListValue('[PREM] Relative', 'relative', [ 'Target', 'Caster', 'Between'], 'Target')
        .setTooltip('Determines what is considered "forward". Target uses the direction the target is facing, Caster uses the direction the caster is facing, and Between uses the direction from the caster to the target.')
    );
    this.data.push(new AttributeValue('Forward Speed', 'forward', 0, 0)
        .setTooltip('The speed to give the target in the direction they are facing')
    );
    this.data.push(new AttributeValue('Upward Speed', 'upward', 2, 0.5)
        .setTooltip('The speed to give the target upwards')
    );
    this.data.push(new AttributeValue('Right Speed', 'right', 0, 0)
        .setTooltip('The speed to give the target to their right')
    );
}

extend('MechanicLightning', 'Component');
function MechanicLightning()
{
    this.super('Lightning', Type.MECHANIC, false);

    this.description = 'Strikes lightning on or near the target. Negative offsets will offset it in the opposite direction (e.g. negative forward offset puts it behind the target).';

    this.data.push(new ListValue('Damage', 'damage', ['True', 'False'], 'True')
        .setTooltip('Whether or not the lightning should deal damage')
    );
    this.data.push(new AttributeValue('Forward Offset', 'forward', 0, 0)
        .setTooltip('How far in front of the target in blocks to place the lightning')
    );
    this.data.push(new AttributeValue('Right Offset', 'right', 0, 0)
        .setTooltip('How far to the right of the target in blocks to place the lightning')
    );
}

extend('MechanicMana', 'Component');
function MechanicMana()
{
    this.super('Mana', Type.MECHANIC, false);

    this.description = 'Restores or deducts mana from the target.';

    this.data.push(new ListValue('Type', 'type', [ 'Mana', 'Percent' ], 'Mana')
        .setTooltip('The unit to use for the amount of mana to restore/drain. Mana does a flat amount while Percent does a percentage of their max mana')
    );
    this.data.push(new AttributeValue('Value', 'value', 1, 0)
        .setTooltip('The amount of mana to restore/drain')
    );
}

extend('MechanicMessage', 'Component');
function MechanicMessage()
{
    this.super('Message', Type.MECHANIC, false);

    this.description = 'Sends a message to each player target. To include numbers from Value mechanics, use the filters {<key>} where <key> is the key the value is stored under.'

    this.data.push(new StringValue('Message', 'message', 'text')
        .setTooltip('The message to display')
    );
}

extend('MechanicParticle', 'Component');
function MechanicParticle()
{
    this.super('Particle', Type.MECHANIC, false);

    this.description = 'Plays a particle effect about the target.';

    addParticleOptions(this);

    this.data.push(new DoubleValue('Forward Offset', 'forward', 0)
        .setTooltip('How far forward in front of the target in blocks to play the particles. A negative value will go behind.')
    );
    this.data.push(new DoubleValue('Upward Offset', 'upward', 0)
        .setTooltip('How far above the target in blocks to play the particles. A negative value will go below.')
    );
    this.data.push(new DoubleValue('Right Offset', 'right', 0)
        .setTooltip('How far to the right of the target to play the particles. A negative value will go to the left.')
    );
}

extend('MechanicParticleAnimation', 'Component');
function MechanicParticleAnimation()
{
    this.super('Particle Animation', Type.MECHANIC, false);

    this.description = 'Plays an animated particle effect at the location of each target over time by applying various transformations.';

    this.data.push(new IntValue('Steps', 'steps', 1, 0)
        .setTooltip('The number of times to play particles and apply translations each application.')
    );
    this.data.push(new DoubleValue('Frequency', 'frequency', 0.05, 0)
        .setTooltip('How often to apply the animation in seconds. 0.05 is the fastest (1 tick). Lower than that will act the same.')
    );
    this.data.push(new IntValue('Angle', 'angle', 0)
        .setTooltip('How far the animation should rotate over the duration in degrees')
    );
    this.data.push(new IntValue('Start Angle', 'start', 0)
        .setTooltip('The starting orientation of the animation. Horizontal translations and the forward/right offsets will be based off of this.')
    );
    this.data.push(new AttributeValue('Duration', 'duration', 5, 0)
        .setTooltip('How long the animation should last for in seconds')
    );
    this.data.push(new AttributeValue('H-Translation', 'h-translation', 0, 0)
        .setTooltip('How far the animation moves horizontally relative to the center over a cycle. Positive values make it expand from the center while negative values make it contract.')
    );
    this.data.push(new AttributeValue('V-Translation', 'v-translation', 0, 0)
        .setTooltip('How far the animation moves vertically over a cycle. Positive values make it rise while negative values make it sink.')
    );
    this.data.push(new IntValue('H-Cycles', 'h-cycles', 1)
        .setTooltip('How many times to move the animation position throughout the animation. Every other cycle moves it back to where it started. For example, two cycles would move it out and then back in.')
    );
    this.data.push(new IntValue('V-Cycles', 'v-cycles', 1)
        .setTooltip('How many times to move the animation position throughout the animation. Every other cycle moves it back to where it started. For example, two cycles would move it up and then back down.')
    );

    addParticleOptions(this);

    this.data.push(new DoubleValue('Forward Offset', 'forward', 0)
        .setTooltip('How far forward in front of the target in blocks to play the particles. A negative value will go behind.')
    );
    this.data.push(new DoubleValue('Upward Offset', 'upward', 0)
        .setTooltip('How far above the target in blocks to play the particles. A negative value will go below.')
    );
    this.data.push(new DoubleValue('Right Offset', 'right', 0)
        .setTooltip('How far to the right of the target to play the particles. A negative value will go to the left.')
    );
}

extend('MechanicParticleEffect', 'Component');
function MechanicParticleEffect()
{
    this.super('Particle Effect', Type.MECHANIC, false);

    this.description = 'Plays a particle effect that follows the current target, using formulas to determine shape, size, and motion';

    addEffectOptions(this, false);
}

extend('MechanicParticleProjectile', 'Component');
function MechanicParticleProjectile()
{
    this.super('Particle Projectile', Type.MECHANIC, true);

    this.description = 'Launches a projectile using particles as its visual that applies child components upon landing. The target passed on will be the collided target or the location where it landed if it missed.';

    addProjectileOptions(this);

    this.data.push(new DoubleValue('Gravity', 'gravity', 0)
        .setTooltip('How much gravity to apply each tick. Negative values make it fall while positive values make it rise')
    );
    this.data.push(new ListValue('Pierce', 'pierce', [ 'True', 'False' ], 'False')
        .setTooltip('Whether or not this projectile should pierce through initial targets and continue hitting those behind them')
    );

    addParticleOptions(this);

    this.data.push(new DoubleValue('Frequency', 'frequency', 0.05)
        .setTooltip('How often to play a particle effect where the projectile is. It is recommended not to change this value unless there are too many particles playing')
    );
    this.data.push(new DoubleValue('Lifespan', 'lifespan', 3)
        .setTooltip('How long in seconds before the projectile will expire in case it doesn\'t hit anything')
    );

    addEffectOptions(this, true);
}

extend('MechanicPassive', 'Component');
function MechanicPassive()
{
    this.super('Passive', Type.MECHANIC, true);

    this.description = 'Applies child components continuously every period. The seconds value below is the period or how often it applies.';

    this.data.push(new AttributeValue('Seconds', 'seconds', 1, 0)
        .setTooltip('The delay in seconds between each application')
    );
}

extend('MechanicPermission', 'Component');
function MechanicPermission()
{
    this.super('Permission', Type.MECHANIC, true);

    this.description = 'Grants each player target a permission for a limited duration. This mechanic requires Vault with an accompanying permissions plugin in order to work.';

    this.data.push(new StringValue('Permission', 'perm', 'plugin.perm.key')
        .setTooltip('The permission to give to the player')
    );
    this.data.push(new AttributeValue('Seconds', 'seconds', 3, 0)
        .setTooltip('How long in seconds to give the permission to the player')
    );
}

extend('MechanicPotion', 'Component');
function MechanicPotion()
{
    this.super('Potion', Type.MECHANIC, false);

    this.description = 'Applies a potion effect to the target for a duration.';

    this.data.push(new ListValue('Potion', 'potion', getPotionTypes, 'Absorption')
        .setTooltip('The type of potion effect to apply')
    );
    this.data.push(new ListValue('Ambient Particles', 'ambient', [ 'True', 'False' ], 'True')
        .setTooltip('Whether or not to show ambient particles')
    );
    this.data.push(new AttributeValue('Tier', 'tier', 1, 0)
        .setTooltip('The strength of the potion')
    );
    this.data.push(new AttributeValue('Seconds', 'seconds', 3, 1)
        .setTooltip('How long to apply the effect for')
    );
}

extend('MechanicPotionProjectile', 'Component');
function MechanicPotionProjectile()
{
    this.super('Potion Projectile', Type.MECHANIC, true);

    this.description = 'Drops a splash potion from each target that does not apply potion effects by default. This will apply child elements when the potion lands. The targets supplied will be everything hit by the potion. If nothing is hit by the potion, the target will be the location it landed.';

    this.data.push(new ListValue('Type', 'type', getPotionTypes, 'Fire Resistance')
        .setTooltip('The type of the potion to use for the visuals')
    );
    this.data.push(new ListValue("Group", "group", ["Ally", "Enemy", "Both"], "Enemy")
        .setTooltip('The alignment of entities to hit')
    );
    this.data.push(new ListValue('Linger', 'linger', [ 'True', 'False' ], 'False')
        .setTooltip('Whether or not the potion should be a lingering potion (for 1.9+ only)')
    );
}

extend('MechanicProjectile', 'Component');
function MechanicProjectile()
{
    this.super('Projectile', Type.MECHANIC, true);

    this.description = 'Launches a projectile that applies child components on hit. The target supplied will be the struck target.';

    this.data.push(new ListValue('Projectile', 'projectile', [ 'Arrow', 'Egg', 'Ghast Fireball', 'Snowball' ], 'Arrow')
        .setTooltip('The type of projectile to fire')
    );
    this.data.push(new ListValue('Flaming', 'flaming', [ 'True', 'False' ], 'False')
        .setTooltip('Whether or not to make the launched projectiles on fire.')
    );
    this.data.push(new ListValue('Cost', 'cost', [ 'None', 'All', 'One' ], 'None')
        .setTooltip('The cost of the skill of the fired item. All will cost the same number of items as the skill fired.')
    );

    addProjectileOptions(this);
    addEffectOptions(this, true);
}

extend('MechanicPurge', 'Component');
function MechanicPurge()
{
    this.super('Purge', Type.MECHANIC, false);

    this.description = 'Purges the target of positive potion effects or statuses';

    this.data.push(new ListValue('Potion', 'potion', getGoodPotions, 'All')
        .setTooltip('The potion effect to remove from the target, if any')
    );
    this.data.push(new ListValue('Status', 'status', [ 'None', 'All', 'Absorb', 'Invincible' ], 'All')
        .setTooltip('The status to remove from the target, if any')
    );
}

extend('MechanicPush', 'Component');
function MechanicPush()
{
    this.super('Push', Type.MECHANIC, false);

    this.description = 'Pushes the target relative to the caster. This will do nothing if used with the caster as the target. Positive numbers apply knockback while negative numbers pull them in.';

  this.data.push(new ListValue('Type', 'type', [ 'Fixed', 'Inverse', 'Scaled' ], 'Fixed')
    .setTooltip('How to scale the speed based on relative position. Fixed does the same speed to all targets. Inverse pushes enemies farther away faster. Scaled pushes enemies closer faster.')
  );
    this.data.push(new AttributeValue('Speed', 'speed', 3, 1)
      .setTooltip('How fast to push the target away. Use a negative value to pull them closer.')
  );
    this.data.push(new StringValue('Source', 'source', 'none')
        .setTooltip('The source to push/pull from. This should be a key used in a Remember Targets mechanic. If no targets are remembered, this will default to the caster.')
    );
}

extend('MechanicRememberTargets', 'Component');
function MechanicRememberTargets()
{
    this.super('Remember Targets', Type.MECHANIC, false);

    this.description = 'Stores the current targets for later use under a specified key';

    this.data.push(new StringValue('Key', 'key', 'target')
        .setTooltip('The unique key to store the targets under. The "Remember" target will use this key to apply effects to the targets later on.')
    );
}

extend('MechanicRepeat', 'Component');
function MechanicRepeat()
{
    this.super('Repeat', Type.MECHANIC, true);

    this.description = 'Applies child components multiple times. When it applies them is determined by the delay (seconds before the first application) and period (seconds between successive applications).';

    this.data.push(new AttributeValue('Repetitions', 'repetitions', 3, 0)
        .setTooltip('How many times to activate child components')
    );
    this.data.push(new DoubleValue('Period', 'period', 1)
        .setTooltip('The time in seconds between each time applying child components')
    );
    this.data.push(new DoubleValue('Delay', 'delay', 0)
        .setTooltip('The initial delay before starting to apply child components')
    );
    this.data.push(new ListValue('Stop on Fail', 'stop-on-fail', [ 'True', 'False' ], 'False')
        .setTooltip('Whether or not to stop the repeat task early if the effects fail')
    );
}

extend('MechanicSound', 'Component');
function MechanicSound()
{
    this.super('Sound', Type.MECHANIC, false);

    this.description = "Plays a sound at the target's location.";

    this.data.push(new ListValue('Sound', 'sound', getSounds, 'Ambience Cave')
        .setTooltip('The sound clip to play')
    );
    this.data.push(new AttributeValue('Volume', 'volume', 100, 0)
        .setTooltip('The volume of the sound as a percentage. Numbers above 100 will not get any louder, but will be heard from a farther distance')
    );
    this.data.push(new AttributeValue('Pitch', 'pitch', 1, 0)
        .setTooltip('The pitch of the sound as a numeric speed multiplier between 0.5 and 2.')
    );
}

extend('MechanicSpeed', 'Component');
function MechanicSpeed()
{
    this.super('Speed', Type.MECHANIC, false);

    this.description = 'Modifies the base speed of a player using a multiplier (stacks with potions)';

    this.data.push(new AttributeValue('Multiplier', 'multiplier', 1.2, 0)
        .setTooltip('The multiplier of the player\'s base speed to use')
    );
    this.data.push(new AttributeValue('Duration', 'duration', 3, 1)
        .setTooltip('How long to multiply their speed for')
    );
}

extend('MechanicStatus', 'Component');
function MechanicStatus()
{
    this.super('Status', Type.MECHANIC, false);

    this.description = 'Applies a status effect to the target for a duration.';

    this.data.push(new ListValue('Status', 'status', [ 'Absorb', 'Curse', 'Disarm', 'Invincible', 'Root', 'Silence', 'Stun' ], 'Stun')
        .setTooltip('The status to apply')
    );
    this.data.push(new AttributeValue('Duration', 'duration', 3, 1)
        .setTooltip('How long in seconds to apply the status')
    );
}

extend('MechanicTaunt', 'Component');
function MechanicTaunt()
{
    this.super('Taunt', Type.MECHANIC, false);

    this.description = 'Draws aggro of targeted creatures. Regular mobs are set to attack the caster. The Spigot/Bukkit API for this was not functional on older versions, so it may not work on older servers. For MythicMobs, this uses their aggro system using the amount chosen below.';

    this.data.push(new AttributeValue('Amount', 'amount', 1, 0)
        .setTooltip('The amount of aggro to apply if MythicMobs is active. Use negative amounts to reduce aggro')
    );
}

extend('MechanicTrigger', 'Component');
function MechanicTrigger()
{
    this.super('Trigger', Type.MECHANIC, true);

    this.description = 'Listens for a trigger on the current targets for a duration.';

    this.data.push(new ListValue('Trigger', 'trigger', [ 'Crouch', 'Death', 'Environment Damage', 'Kill', 'Land', 'Launch', 'Physical Damage', 'Skill Damage', 'Took Physical Damage', 'Took Skill Damage' ], 'Death')
        .setTooltip('The trigger to listen for')
    );
    this.data.push(new AttributeValue('Duration', 'duration', 5, 0)
        .setTooltip('How long to listen to the trigger for')
    );
    this.data.push(new ListValue('Stackable', 'stackable', [ 'True', 'False', ], 'True')
        .setTooltip('Whether or not different players (or the same player) can listen to the same target at the same time')
    );
    this.data.push(new ListValue('Once', 'once', [ 'True', 'False' ], 'True')
        .setTooltip('Whether or not the trigger should only be used once each cast. When false, the trigger can execute as many times as it happens for the duration.')
    );

    // CROUCH
    this.data.push(new ListValue('Type', 'type', [ 'Start Crouching', 'Stop Crouching', 'Both' ], 'Start Crouching')
        .requireValue('trigger', [ 'Crouch' ])
        .setTooltip('Whether or not you want to apply components when crouching or not crouching')
    );

    // ENVIRONMENT_DAMAGE
    this.data.push(new ListValue('Type', 'type', DAMAGE_TYPES, 'FALL')
        .requireValue('trigger', [ 'Environment Damage' ])
        .setTooltip('The source of damage to apply for')
    );

    // LAND
    this.data.push(new DoubleValue('Min Distance', 'min-distance', 0)
        .requireValue('trigger', [ 'Land' ])
        .setTooltip('The minimum distance the player should fall before effects activating.')
    );

    // LAUNCH
    this.data.push(new ListValue('Type', 'type', [ 'Any', 'Arrow', 'Egg', 'Ender Pearl', 'Fireball', 'Fishing Hook', 'Snowball' ], 'Any')
        .requireValue('trigger', [ 'Launch' ])
        .setTooltip('The type of projectile that should be launched.')
    );

    // PHYSICAL
    this.data.push(new ListValue('Type', 'type', [ 'Both', 'Melee', 'Projectile' ], 'Both')
        .requireValue('trigger', [ 'Physical Damage', 'Took Physical Damage' ])
        .setTooltip('The type of damage dealt')
    );

    // SKILL
    this.data.push(new StringValue('Category', 'category', '')
        .requireValue('trigger', [ 'Skill Damage', 'Took Skill Damage' ])
        .setTooltip('The type of skill damage to apply for. Leave this empty to apply to all skill damage.')
    );

    // DAMAGE
    var damageTriggers = [ 'Physical Damage', 'Skill Damage', 'Took Physical Damage', 'Took Skill Damage' ];
    this.data.push(new ListValue('Target Listen Target', 'target', [ 'True', 'False' ], 'True')
        .requireValue('trigger', damageTriggers)
        .setTooltip('True makes children target the target that has been listened to. False makes children target the entity fighting the target entity.')
    );
    this.data.push(new DoubleValue("Min Damage", "dmg-min", 0)
        .requireValue('trigger', damageTriggers)
        .setTooltip('The minimum damage that needs to be dealt')
    );
    this.data.push(new DoubleValue("Max Damage", "dmg-max", 999)
        .requireValue('trigger', damageTriggers)
        .setTooltip('The maximum damage that needs to be dealt')
    );
}

extend('MechanicValueAdd', 'Component');
function MechanicValueAdd()
{
    this.super('Value Add', Type.MECHANIC, false);
    
    this.description = 'Adds to a stored value under a unique key for the caster. If the value wasn\'t set before, this will set the value to the given amount.';
    
    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
    this.data.push(new AttributeValue('Amount', 'amount', 1, 0)
        .setTooltip('The amount to add to the value')
    );
}

extend('MechanicValueAttribute', 'Component');
function MechanicValueAttribute() 
{
    this.super('Value Attribute', Type.MECHANIC, false);
    
    this.description = 'Loads a player\'s attribute count for a specific attribute as a stored value to be used in other mechanics.';
    
    this.data.push(new StringValue('Key', 'key', 'attribute')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
    this.data.push(new StringValue('Attribute', 'attribute', 'Vitality')
        .setTooltip('The name of the attribute you are loading the value of')
    );
}

extend('MechanicValueCopy', 'Component');
function MechanicValueCopy()
{
    this.super('Value Copy', Type.MECHANIC, false);
    
    this.description = 'Copies a stored value from the caster to the target or vice versa';
    
    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
    this.data.push(new StringValue('Destination', 'destination', 'value')
        .setTooltip('The key to copy the original value to')
    );
    this.data.push(new ListValue('To target', 'to-target', [ 'True', 'False' ], 'True')
        .setTooltip('The amount to add to the value')
    );
}

extend('MechanicValueDistance', 'Component');
function MechanicValueDistance()
{
    this.super('Value Distance', Type.MECHANIC, false);

    this.description = 'Stores the distance between the target and the caster into a value';

    this.data.push(new StringValue('Key', 'key', 'attribute')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
}

extend('MechanicValueHealth', 'Component');
function MechanicValueHealth()
{
    this.super('Value Health', Type.MECHANIC, false);
    
    this.description = 'Stores the target\'s current health as a value under a given key for the caster';
    
    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
    this.data.push(new ListValue('Type', 'type', [ 'Current', 'Max', 'Missing', 'Percent' ], 'Current')
        .setTooltip('Current provides the health the target has, max provides their total health, missing provides how much health they have lost, and percent is the ratio of health to total health.')
    );
}

extend('MechanicValueLocation', 'Component');
function MechanicValueLocation() 
{
    this.super('Value Location', Type.MECHANIC, false);
    
    this.description = 'Loads the first target\'s current location into a stored value for use at a later time.';
    
    this.data.push(new StringValue('Key', 'key', 'location')
        .setTooltip('The unique key to store the location under. This key can be used in place of attribute values to use the stored value.')
    );
}

extend('MechanicValueLore', 'Component');
function MechanicValueLore()
{
    this.super('Value Lore', Type.MECHANIC, false);
    
    this.description = 'Loads a value from a held item\'s lore into a stored value under the given unique key for the caster.';
    
    this.data.push(new StringValue('Key', 'key', 'lore')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
    this.data.push(new ListValue("Hand", "hand", [ 'Main', 'Offhand' ], 'Main')
        .setTooltip('The hand to check for the item. Offhand items are MC 1.9+ only.')
    );
    this.data.push(new StringValue('Regex', 'regex', 'Damage: {value}')
        .setTooltip('The regex string to look for, using {value} as the number to store. If you do not know about regex, consider looking it up on Wikipedia or avoid using major characters such as [ ] { } ( ) . + ? * ^ \\ |')
    );
    this.data.push(new AttributeValue('Multiplier', 'multiplier', 1, 0)
        .setTooltip('The multiplier for the acquired value. If you want the value to remain unchanged, leave this value at 1.')
    );
}

extend('MechanicValueLoreSlot', 'Component');
function MechanicValueLoreSlot()
{
    this.super('Value Lore Slot', Type.MECHANIC, false);
    
    this.description = 'Loads a value from an item\'s lore into a stored value under the given unique key for the caster.';
    
    this.data.push(new StringValue('Key', 'key', 'lore')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
    this.data.push(new IntValue("Slot", "slot", 9)
        .setTooltip('The slot of the inventory to fetch the item from. Slots 0-8 are the hotbar, 9-35 are the main inventory, 36-39 are armor, and 40 is the offhand slot.')
    );
    this.data.push(new StringValue('Regex', 'regex', 'Damage: {value}')
        .setTooltip('The regex string to look for, using {value} as the number to store. If you do not know about regex, consider looking it up on Wikipedia or avoid using major characters such as [ ] { } ( ) . + ? * ^ \\ |')
    );
    this.data.push(new AttributeValue('Multiplier', 'multiplier', 1, 0)
        .setTooltip('The multiplier for the acquired value. If you want the value to remain unchanged, leave this value at 1.')
    );
}

extend('MechanicValueMana', 'Component');
function MechanicValueMana()
{
    this.super('Value Mana', Type.MECHANIC, false);
    
    this.description = 'Stores the target player\'s current mana as a value under a given key for the caster';
    
    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
    this.data.push(new ListValue('Type', 'type', [ 'Current', 'Max', 'Missing', 'Percent' ], 'Current')
        .setTooltip('Current provides the mana the target has, max provides their total mana, missing provides how much mana they have lost, and percent is the ratio of health to total mana.')
    );
}

extend('MechanicValueMultiply', 'Component');
function MechanicValueMultiply()
{
    this.super('Value Multiply', Type.MECHANIC, false);

    this.description = 'Multiplies a stored value under a unique key for the caster. If the value wasn\'t set before, this will not do anything.';

    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
    this.data.push(new AttributeValue('Multiplier', 'multiplier', 1, 0)
        .setTooltip('The amount to multiply the value by')
    );
}

extend('MechanicValuePlaceholder', 'Component');
function MechanicValuePlaceholder()
{
    this.super('Value Placeholder', Type.MECHANIC, false);

    this.description = 'Uses a placeholder string and stores it as a value for the caster';

    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
    this.data.push(new ListValue("Type", "type", [ 'Number', 'String' ], 'Number')
        .setTooltip('The type of value to store. Number values require numeric placeholders. String values can be used in messages or commands.')
    );
    this.data.push(new StringValue('Placeholder', 'placeholder', '%player_food_level%')
        .setTooltip('The placeholder string to use. Can contain multiple placeholders if using the String type.')
    );
}

extend('MechanicValueRandom', 'Component')
function MechanicValueRandom()
{
    this.super('Value Random', Type.MECHANIC, false);
    
    this.description = 'Stores a specified value under a given key for the caster.';
    
    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
    this.data.push(new ListValue('Type', 'type', [ 'Normal', 'Triangular' ], 'Normal')
        .setTooltip('The type of random to use. Triangular favors numbers in the middle, similar to rolling two dice.')
    );
    this.data.push(new AttributeValue('Min', 'min', 0, 0)
        .setTooltip('The minimum value it can be')
    );
    this.data.push(new AttributeValue('Max', 'max', 0, 0)
        .setTooltip('The maximum value it can be')
    );
}

extend('MechanicValueSet', 'Component');
function MechanicValueSet()
{
    this.super('Value Set', Type.MECHANIC, false);
    
    this.description = 'Stores a specified value under a given key for the caster.';
    
    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
    this.data.push(new AttributeValue('Value', 'value', 1, 0)
        .setTooltip('The value to store under the key')
    );
}

extend('MechanicWarp', 'Component');
function MechanicWarp()
{
    this.super('Warp', Type.MECHANIC, false);
    
    this.description = 'Warps the target relative to their forward direction. Use negative numbers to go in the opposite direction (e.g. negative forward will cause the target to warp backwards).';
    
    this.data.push(new ListValue('Through Walls', 'walls', [ 'True', 'False' ], 'False')
        .setTooltip('Whether or not to allow the target to teleport through walls')
    );
    this.data.push(new AttributeValue('Forward', 'forward', 3, 1)
        .setTooltip('How far forward in blocks to teleport. A negative value teleports backwards.')
    );
    this.data.push(new AttributeValue('Upward', 'upward', 0, 0)
        .setTooltip('How far upward in blocks to teleport. A negative value teleports downward.')
    );
    this.data.push(new AttributeValue('Right', 'right', 0, 0)
        .setTooltip('How far to the right in blocks to teleport. A negative value teleports to the left.')
    );
}

extend('MechanicWarpLoc', 'Component');
function MechanicWarpLoc()
{
    this.super('Warp Location', Type.MECHANIC, false);
    
    this.description = 'Warps the target to a specified location.';
    
    this.data.push(new StringValue('World (or "current")', 'world', 'current')
        .setTooltip('The name of the world that the location is in')
    );
    this.data.push(new DoubleValue('X', 'x', 0)
        .setTooltip('The X-coordinate of the desired position')
    );
    this.data.push(new DoubleValue('Y', 'y', 0)
        .setTooltip('The Y-coordinate of the desired position')
    );
    this.data.push(new DoubleValue('Z', 'z', 0)
        .setTooltip('The Z-coordinate of the desired position')
    );
    this.data.push(new DoubleValue('Yaw', 'yaw', 0)
        .setTooltip('The Yaw of the desired position (left/right orientation)')
    );
    this.data.push(new DoubleValue('Pitch', 'pitch', 0)
        .setTooltip('The Pitch of the desired position (up/down orientation)')
    );
}

extend('MechanicWarpRandom', 'Component');
function MechanicWarpRandom()
{
    this.super('Warp Random', Type.MECHANIC, false);
    
    this.description = 'Warps the target in a random direction the given distance.';
    
    this.data.push(new ListValue('Only Horizontal', 'horizontal', [ 'True', 'False' ], 'True')
        .setTooltip('Whether or not to limit the random position to the horizontal plane')
    );
    this.data.push(new ListValue('Through Walls', 'walls', [ 'True', 'False' ], 'False')
        .setTooltip('Whether or not to allow the target to teleport through walls')
    );
    this.data.push(new AttributeValue('Distance', 'distance', 3, 1)
        .setTooltip('The max distance in blocks to teleport')
    );
}

extend('MechanicWarpSwap', 'Component');
function MechanicWarpSwap()
{
    this.super('Warp Swap', Type.MECHANIC, false);
    
    this.description = 'Switches the location of the caster and the target. If multiple targets are provided, this takes the first one.';
}

extend('MechanicWarpTarget', 'Component');
function MechanicWarpTarget()
{
    this.super('Warp Target', Type.MECHANIC, false);
    
    this.description = 'Warps either the target or the caster to the other. This does nothing when the target is the caster.';
    
    this.data.push(new ListValue('Type', 'type', [ 'Caster to Target', 'Target to Caster' ], 'Caster to Target')
        .setTooltip('The direction to warp the involved targets')
    );
}

extend('MechanicWarpValue', 'Component');
function MechanicWarpValue() 
{
    this.super('Warp Value', Type.MECHANIC, false);
    
    this.description = 'Warps all targets to a location remembered using the Value Location mechanic.';
    
    this.data.push(new StringValue('Key', 'key', 'location')
        .setTooltip('The unique key the location is stored under. This should be the same key used in the Value Location mechanic.')
    );
}

extend('MechanicWolf', 'Component');
function MechanicWolf()
{
    this.super('Wolf', Type.MECHANIC, true);
    
    this.description = 'Summons a wolf on each target for a duration. Child components will start off targeting the wolf so you can add effects to it. You can also give it its own skillset, though Cast triggers will not occur.';
    
    this.data.push(new ListValue('Collar Color', 'color', getDyes(), 'Black')
        .setTooltip('The color of the collar that the wolf should wear')
    );
    this.data.push(new StringValue('Wolf Name', 'name', "{player}'s Wolf")
        .setTooltip('The displayed name of the wolf. Use {player} to embed the caster\'s name.')
    );
    this.data.push(new AttributeValue('Health', 'health', 10, 0)
        .setTooltip('The starting health of the wolf')
    );
    this.data.push(new AttributeValue('Damage', 'damage', 3, 0)
        .setTooltip('The damage dealt by the wolf each attack')
    );
    this.data.push(new ListValue('Sitting', 'sitting', [ 'True', 'False' ], 'False')
        .setTooltip('[PREMIUM] whether or not the wolf starts of sitting')
    );
    this.data.push(new AttributeValue('Duration', 'seconds', 10, 0)
        .setTooltip('How long to summon the wolf for')
    );
    this.data.push(new AttributeValue('Amount', 'amount', 1, 0)
        .setTooltip('How many wolves to summon')
    );
    this.data.push(new StringListValue('Skills (one per line)', 'skills', [])
        .setTooltip('The skills to give the wolf. Skills are executed at the level of the skill summoning the wolf. Skills needing a Cast trigger will not work.')
    );
}

// The active component being edited or added to
var activeComponent = undefined;

/**
 * Adds the options for item related effects to the component
 *
 * @param {Component} component - the component to add to
 */
function addItemOptions(component) {
    
    component.data.push(new ListValue('物品形状', 'check-mat', [ 'True', 'False' ], 'True')
        .setTooltip('物品是否需要指定形状 True为需要')
    );
    component.data.push(new ListValue('形状', 'material', getMaterials, 'Arrow')
        .requireValue('check-mat', [ 'True' ])
        .setTooltip('物品的形状')
    );
    
    component.data.push(new ListValue('物品数据', 'check-data', [ 'True', 'False' ], 'False')
        .setTooltip('物品是否需要指定的数据值 False为不需要')
    );
    component.data.push(new IntValue('数据', 'data', 0)
        .requireValue('check-data', [ 'True' ])
        .setTooltip('物品的数据值')
    );
    
    component.data.push(new ListValue('物品Lore', 'check-lore', [ 'True', 'False' ], 'False')
        .setTooltip('物品是否需要指定的Lore False为不需要')
    );
    component.data.push(new StringValue('Lore', 'lore', 'text')
        .requireValue('check-lore', [ 'True' ])
        .setTooltip('物品的Lore')
    );
    
    component.data.push(new ListValue('显示名称', 'check-name', [ 'True', 'False' ], 'False')
        .setTooltip('是否需要指定的显示名称 False为不需要')
    );
    component.data.push(new StringValue('名称', 'name', 'name')
        .requireValue('check-name', [ 'True' ])
        .setTooltip('物品的名称')
    );
    
    component.data.push(new ListValue('正则表达式', 'regex', [ 'True', 'False' ], 'False')
        .setTooltip('物品的名字和lore是否需要被正则表达式所检索,False为不需要')
    );
}

function addProjectileOptions(component) {
    
    // General data
    component.data.push(new ListValue("Group", "group", ["Ally", "Enemy"], "Enemy")
        .setTooltip('The alignment of targets to hit')
    );
    component.data.push(new ListValue('Spread', 'spread', [ 'Cone', 'Horizontal Cone', 'Rain' ], 'Cone')
        .setTooltip('The orientation for firing projectiles. Cone will fire arrows in a cone centered on your reticle. Horizontal cone does the same as cone, just locked to the XZ axis (parallel to the ground). Rain drops the projectiles from above the target. For firing one arrow straight, use "Cone"')
    );
    component.data.push(new AttributeValue('Amount', 'amount', 1, 0)
        .setTooltip('The number of projectiles to fire')
    );
    component.data.push(new AttributeValue('Velocity', 'velocity', 3, 0)
        .setTooltip('How fast the projectile is launched. A negative value fires it in the opposite direction.')
    );
    
    // Cone values
    component.data.push(new AttributeValue('Angle', 'angle', 30, 0)
        .requireValue('spread', [ 'Cone', 'Horizontal Cone' ])
        .setTooltip('The angle in degrees of the cone arc to spread projectiles over. If you are only firing one projectile, this does not matter.')
    );
    component.data.push(new DoubleValue('Position', 'position', 0, 0)
        .requireValue('spread', [ 'Cone', 'Horizontal Cone' ])
        .setTooltip('The height from the ground to start the projectile')
    );
    
    // Rain values
    component.data.push(new AttributeValue('Height', 'height', 8, 0)
        .requireValue('spread', [ 'Rain' ])
        .setTooltip('The distance in blocks over the target to rain the projectiles from')
    );
    component.data.push(new AttributeValue('Radius', 'rain-radius', 2, 0)
        .requireValue('spread', [ 'Rain' ])
        .setTooltip('The radius of the rain emission area in blocks')
    );
    
    // Offsets
    component.data.push(new AttributeValue('Forward Offset', 'forward', 0, 0)
        .setTooltip('How far forward in front of the target the projectile should fire from in blocks. A negative value will put it behind.')
    );
    component.data.push(new AttributeValue('Upward Offset', 'upward', 0, 0)
        .setTooltip('How far above the target the projectile should fire from in blocks. A negative value will put it below.')
    );
    component.data.push(new AttributeValue('Right Offset', 'right', 0, 0)
        .setTooltip('How far to the right of the target the projectile should fire from. A negative value will put it to the left.')
    );
}

/**
 * Adds the options for particle effects to the components
 *
 * @param {Component} component - the component to add to
 */
function addParticleOptions(component) {
    component.data.push(new ListValue('Particle', 'particle', 
        [ 
            'Angry Villager', 
            'Barrier',
            'Block Crack', 
            'Bubble', 
            'Cloud', 
            'Crit', 
            'Damage Indicator',
            'Death', 
            'Death Suspend', 
            'Dragon Breath',
            'Drip Lava', 
            'Drip Water', 
            'Enchantment Table', 
            'End Rod',
            'Ender Signal', 
            'Explode', 
            'Firework Spark', 
            'Flame', 
            'Footstep', 
            'Happy Villager', 
            'Heart', 
            'Huge Explosion', 
            'Hurt', 
            'Icon Crack', 
            'Instant Spell', 
            'Large Explode', 
            'Large Smoke', 
            'Lava', 
            'Magic Crit', 
            'Mob Spell', 
            'Mob Spell Ambient', 
            'Mobspawner Flames', 
            'Note', 
            'Portal', 
            'Potion Break', 
            'Red Dust', 
            'Sheep Eat', 
            'Slime', 
            'Smoke', 
            'Snowball Poof', 
            'Snow Shovel', 
            'Spell', 
            'Splash', 
            'Sweep Attack',
            'Suspend', 
            'Town Aura', 
            'Water Drop',
            'Water Wake',
            'Witch Magic', 
            'Wolf Hearts', 
            'Wolf Shake', 
            'Wolf Smoke' 
        ], 'Angry Villager')
        .setTooltip('The type of particle to display. Particle effects that show the DX, DY, and DZ options are not compatible with Cauldron')
    );
    
    component.data.push(new ListValue('Material', 'material', getMaterials, 'Dirt').requireValue('particle', [ 'Block Crack', 'Icon Crack' ])
        .setTooltip('The material to use for the Block Crack or Icon Crack particles')
    );
    component.data.push(new IntValue('Type', 'type', 0).requireValue('particle', [ 'Block Crack', 'Icon Crack' ])
        .setTooltip('The material data value to se for the Block Crack or Icon Crack particles')
    );
    
    component.data.push(new ListValue('Arrangement', 'arrangement', [ 'Circle', 'Hemisphere', 'Sphere' ], 'Circle')
        .setTooltip('The arrangement to use for the particles. Circle is a 2D circle, Hemisphere is half a 3D sphere, and Sphere is a 3D sphere')
    );
    component.data.push(new AttributeValue('Radius', 'radius', 4, 0)
        .setTooltip('The radius of the arrangement in blocks')
    );
    component.data.push(new AttributeValue('Particles', 'particles', 20, 0)
        .setTooltip('The amount of particles to play')
    );
    
    // Circle arrangement direction
    component.data.push(new ListValue('Circle Direction', 'direction', [ 'XY', 'XZ', 'YZ' ], 'XZ').requireValue('arrangement', [ 'Circle' ])
        .setTooltip('The orientation of the circle. XY and YZ are vertical circles while XZ is a horizontal circle.')
    );
    
    // Bukkit particle data value
    component.data.push(new IntValue('Data', 'data', 0).requireValue('particle', [ 'Smoke', 'Ender Signal', 'Mobspawner Flames', 'Potion Break' ])
        .setTooltip('The data value to use for the particle. The effect changes between particles such as the orientation for smoke particles or the color for potion break')
    );
    
    // Reflection particle data
    var reflectList = [ 'Angry Villager', 'Bubble', 'Cloud', 'Crit', 'Damage Indicator', 'Death Suspend', 'Dragon Breath', 'Drip Lava', 'Drip Water', 'Enchantment Table', 'End Rod', 'Explode', 'Fireworks Spark', 'Flame', 'Footstep', 'Happy Villager', 'Hear', 'Huge Explosion', 'Instant Spell', 'Large Explode', 'Large Smoke', 'Lava', 'Magic Crit', 'Mob Spell', 'Mob Spell Ambient', 'Note', 'Portal', 'Red Dust', 'Slime', 'Snowball Poof', 'Snow Shovel', 'Spell', 'Splash', 'Suspend', 'Sweep Attack', 'Town Aura', 'Water Drop', 'Water Wake', 'Witch Magic' ];
    component.data.push(new IntValue('Visible Radius', 'visible-radius', 25).requireValue('particle', reflectList)
        .setTooltip('How far away players can see the particles from in blocks')
    );
    component.data.push(new DoubleValue('DX', 'dx', 0).requireValue('particle', reflectList)
        .setTooltip('A packet variable that varies between particles. It generally is used for how far from the position a particle can move in the X direction.')
    );
    component.data.push(new DoubleValue('DY', 'dy', 0).requireValue('particle', reflectList)
        .setTooltip('A packet variable that varies between particles. It generally is used for how far from the position a particle can move in the Y direction.')
    );
    component.data.push(new DoubleValue('DZ', 'dz', 0).requireValue('particle', reflectList)
        .setTooltip('A packet variable that varies between particles. It generally is used for how far from the position a particle can move in the Z direction.')
    );
    component.data.push(new DoubleValue('Particle Speed', 'speed', 1).requireValue('particle', reflectList)
        .setTooltip('A packet variable that varies between particles. It generally controlls the color or velocity of the particle.')
    );
    component.data.push(new DoubleValue('Packet Amount', 'amount', 1).requireValue('particle', reflectList)
        .setTooltip('A packet variable that varies between particles. Setting this to 0 lets you control the color of some particles.')
    );
}

function addEffectOptions(component, optional)
{
    var opt = appendNone;
    if (optional)
    {
        opt = appendOptional;
        
        component.data.push(new ListValue('Use Effect', 'use-effect', [ 'True', 'False' ], 'False')
            .setTooltip('Whether or not to use the premium particle effects.')
        );
    }
    
    component.data.push(opt(new StringValue('Effect Key', 'effect-key', 'default')
        .setTooltip('The key to refer to the effect by. Only one effect of each key can be active at a time.')
    ));
    component.data.push(opt(new AttributeValue('Duration', 'duration', 1, 0)
        .setTooltip('The time to play the effect for in seconds')
    ));
    
    component.data.push(opt(new StringValue('Shape', '-shape', 'hexagon')
        .setTooltip('Key of a formula for deciding where particles are played each iteration. View "effects.yml" for a list of defined formulas and their keys.')
    ));
    component.data.push(opt(new ListValue('Shape Direction', '-shape-dir', [ 'XY', 'YZ', 'XZ' ], 'XY')
        .setTooltip('The plane the shape formula applies to. XZ would be flat, the other two are vertical.')
    ));
    component.data.push(opt(new StringValue('Shape Size', '-shape-size', '1')
        .setTooltip('Formula for deciding the size of the shape. This can be any sort of formula using the operations defined in the wiki.')
    ));
    component.data.push(opt(new StringValue('Animation', '-animation', 'one-circle')
        .setTooltip('Key of a formula for deciding where the particle effect moves relative to the target. View "effects.yml" for a list of defined formulas and their keys.')
    ));
    component.data.push(opt(new ListValue('Animation Direction', '-anim-dir', [ 'XY', 'YZ', 'XZ' ], 'XZ')
        .setTooltip('The plane the animation motion moves through. XZ wold be flat, the other two are vertical.')
    ));
    component.data.push(opt(new StringValue('Animation Size', '-anim-size', '1')
        .setTooltip('Formula for deciding the multiplier of the animation distance. This can be any sort of formula using the operations defined in the wiki.')
    ));
    component.data.push(opt(new IntValue('Interval', '-interval', 1)
        .setTooltip('Number of ticks between playing particles.')
    ));
    component.data.push(opt(new IntValue('View Range', '-view-range', 25)
        .setTooltip('How far away the effect can be seen from')
    ));
    
    component.data.push(opt(new ListValue('Particle Type', '-particle-type', [
            'BARRIER',
            'BLOCK_CRACK',
            'CLOUD',
            'CRIT',
            'CRIT_MAGIC',
            'DAMAGE_INDICATOR',
            'DRAGON_BREATH',
            'DRIP_LAVA',
            'DRIP_WATER',
            'ENCHANTMENT_TABLE',
            'END_ROD',
            'EXPLOSION_HUGE',
            'EXPLOSION_LARGE',
            'EXPLOSION_NORMAL',
            'FIREWORKS_SPARK',
            'FLAME',
            'FOOTSTEP',
            'HEART',
            'LAVA',
            'MOB_APPEARANCE',
            'NOTE',
            'PORTAL',
            'REDSTONE',
            'SLIME',
            'SMOKE_NORMAL',
            'SMOKE_LARGE',
            'SNOWBALL',
            'SNOW_SHOVEL',
            'SPELL',
            'SPELL_INSTANT',
            'SPELL_MOB',
            'SPELL_MOB_AMBIENT',
            'SPELL_WITCH',
            'SUSPEND_DEPTH',
            'SUSPENDED',
            'SWEEP_ATTACK',
            'TOWN_AURA',
            'VILLAGER_ANGRY',
            'VILLAGER_HAPPY',
            'WATER_BUBBLE',
            'WATER_SPLASH',
            'WATER_WAKE'
        ], 'BARRIER')
        .setTooltip('The type of particle to use')
    ));
    component.data.push(opt(new ListValue('Particle Material', '-particle-material', getMaterials, 'WOOD')
        .requireValue('-particle-type', [ 'BLOCK_CRACK' ])
        .setTooltip('The material to use for the particle')
    ));
    component.data.push(opt(new IntValue('Particle Data', '-particle-data', 0)
        .requireValue('-particle-type', [ 'BLOCK_CRACK' ])
        .setTooltip('The data value for the material used by the particle')
    ));
    component.data.push(opt(new IntValue('Particle Num', '-particle-amount', 0)
        .setTooltip('The integer data for the particle, often labeled as "amount"')
    ));
    component.data.push(opt(new DoubleValue('DX', '-particle-dx', 0)
        .setTooltip('Particle DX value, often used for color')
    ));
    component.data.push(opt(new DoubleValue('DY', '-particle-dy', 0)
        .setTooltip('Particle DY value, often used for color')
    ));
    component.data.push(opt(new DoubleValue('DZ', '-particle-dz', 0)
        .setTooltip('Particle DZ value, often used for color')
    ));
    component.data.push(opt(new DoubleValue('Speed', '-particle-speed', 1)
        .setTooltip('Speed value for the particle, sometimes relating to velocity')
    ));
}

function appendOptional(value)
{
    value.requireValue('use-effect', [ 'True' ]);
    return value;
}

function appendNone(value)
{
    return value;
}
