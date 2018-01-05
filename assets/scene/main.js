import { setTimeout } from "timers";

cc.Class({
    extends: cc.Component,

    properties: {
        __LoLayer: null,
        __SoLayer: null
    },

    onLoad: function() {
        cc.loader.loadResDir('prefab');
    },

    start: function() {

    },

    onLoHandler: function() {
        if (this.__LoLayer)
            this.__LoLayer.getComponent('lo').show();
        else {
            this.__LoLayer = cc.instantiate(cc.loader.getRes('prefab/lo', cc.Prefab));
            if (this.__LoLayer) {
                this.node.addChild(this.__LoLayer);
                this.__LoLayer.position = cc.p(cc.director.getVisibleSize().width, 0);
                setTimeout(() => {
                    this.__LoLayer.getComponent('lo').show();
                });
            }
        }
    },

    onSoHandler: function() {
        if (this.__SoLayer)
            this.__SoLayer.getComponent('so').show();
        else {
            this.__SoLayer = cc.instantiate(cc.loader.getRes('prefab/so', cc.Prefab));
            if (this.__SoLayer) {
                this.node.addChild(this.__SoLayer);
                this.__SoLayer.position = cc.p(cc.director.getVisibleSize().width, 0);
                setTimeout(() => {
                    this.__SoLayer.getComponent('so').show();
                });
            }
        }
    },

    onExitHandler: function() {
        cc.director.loadScene('authentication');
    },
});