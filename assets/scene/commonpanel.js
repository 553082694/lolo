cc.Class({
    extends: cc.Component,

    properties: {
        root: cc.Node,
        toast: cc.Node,

        __twice: false
    },

    onLoad: function() {
        this.toast.active = false;

        if (cc.sys.os == cc.sys.OS_ANDROID) {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (event) => {
                if (event.keyCode === cc.KEY.back) {
                    if (this.__twice)
                        cc.director.end();
                    else {
                        this.__twice = true;
                        this.toast.active = true;
                        this.toast.opacity = 255;
                        this.toast.position = cc.p(this.toast.position.x, -460);
                        this.toast.runAction(cc.sequence(
                            cc.moveBy(0.1, cc.p(0, 80)),
                            cc.moveBy(0.1, cc.p(0, -15)),
                            cc.delayTime(0.5),
                            cc.fadeOut(0.5),
                            cc.callFunc(function() {
                                this.toast.active = false;
                                this.__twice = false;
                            }, this)
                        ));
                    }
                }
            });
        }
    },

    start: function() {
        this.root.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        cc.game.addPersistRootNode(this.root);
    }
});