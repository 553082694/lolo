cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function() {
        cc.loader.loadResDir('prefab');
    },

    start: function() {},

    onLoHandler: function() {
        var node = cc.instantiate(cc.loader.getRes('prefab/lo', cc.Prefab));
        if (node) {
            this.node.addChild(node);
            node.position = cc.p(cc.director.getVisibleSize().width, 0);
            node.runAction(cc.moveTo(0.2, cc.p(0, 0)));
        }
    },

    onSoHandler: function() {
        var node = cc.instantiate(cc.loader.getRes('prefab/so', cc.Prefab));
        if (node) {
            this.node.addChild(node);
            node.position = cc.p(cc.director.getVisibleSize().width, 0);
            node.runAction(cc.moveTo(0.2, cc.p(0, 0)));
        }
    },

    onExitHandler: function() {
        cc.director.loadScene('authentication');
    },
});